<template>
<form @change="updateGraph">
  <h1>Filtering: </h1>
  <label>
    <input type="radio" name="filtering" value="smallest">
      Smallest 10 Entries
  </label>
  <label>
    <input type="radio" name="filtering" value="largest">
      Highest 10 Entries
  </label>
  <label>
    <input checked type="radio" name="filtering" value="mix">
      Smallest 5 and Largest 5 Entries
  </label>
  </form>
  <BarChart :data=this.data :stylingLabels=this.styling></BarChart>
</template>

<script>
import { mapGetters } from "vuex";
import BarChart from "../BarChart.vue";
export default {
  name: "AvgTimePerQuestion",
  components: {
    BarChart,
  },
  computed: {
    ...mapGetters({ file: "getData" }),
  },
  data() {
    return {
      data: [[],[]],
      allData: [[], []],
      styling: {
         text: "Average Time Spent Per Question",
         labelStringX: "Time (seconds)",
         labelStringY: "Questions",
      }
    };
  },
  created() {
    this.allData = this.graphData();
    this.data = this.graphData();
  },
  methods: {
    updateGraph() {
      console.log(this.allData[0].length);
      let labels = this.allData[0];
      let values = this.allData[1]
      let options = document.querySelector("input:checked").value;
      let size = values.length;
      if (options==="smallest") {
        labels = labels.slice(0, 3);
        values = values.slice(0, 3);
      } else if (options==="largest") {
        labels = labels.slice(values.length - 3, size);
        values = values.slice(values.length - 3, size);
      } else {
        labels = [].concat(labels.slice(0,3), labels.slice(size-3, size));
        values = [].concat(values.slice(0,3), values.slice(size-3, size));
      }
      this.data = [labels, values];
    },

    /**
     * Returns an array of labels for the chart followed by an array of corresponding
     * data points that indicate the height of the bar for a specific label. The labels
     * represent the names of the questions on a form and the values represent the average
     * time it took users to answer that question.
     */
    graphData() {
      const groupedAuditData = JSON.parse(JSON.stringify(this.file));
      let groupedSubmissionTimes = this.reduceSubmissionQuestions(
        groupedAuditData,
        this.calculateQuestionTime
      );
      let averageQuestionTimes = this.calculateAverageQuestionValues(
        groupedSubmissionTimes
      );

      let questionLabels = [];
      let avgAnswerTimes = [];

      averageQuestionTimes.forEach((user) => {
        questionLabels.push(user["node"]);

        avgAnswerTimes.push(user["value"].toFixed(2));
      });

      let size = avgAnswerTimes.length;
      if (size > 5) {
        questionLabels = [].concat(questionLabels.slice(0,3), questionLabels.slice(size-3, size));
        avgAnswerTimes = [].concat(avgAnswerTimes.slice(0, 3), avgAnswerTimes.slice(size-3, size));
      }

      return [questionLabels, avgAnswerTimes];
    },

    calculateAverageQuestionValues(groupedSubmissionValues) {
      let questionAggregate = {};
      let questionResponses = {};

      for (const [instanceID, questions] of Object.entries(
        groupedSubmissionValues
      )) {
        for (const [node, value] of Object.entries(questions)) {
          if (!(node in questionAggregate)) {
            questionAggregate[node] = 0;
            questionResponses[node] = 0;
          }

          questionAggregate[node] += value;
          questionResponses[node]++;
        }
      }

      let questionAverages = [];
      for (const node of Object.keys(questionAggregate)) {
        let entry = {};
        entry.node = node;
        entry.value = questionAggregate[node] / questionResponses[node];
        questionAverages.push(entry);
      }
      return questionAverages;
    },

    calculateQuestionTime(events) {
      let totalTime = 0;
      for (const event of events) {
        if (event["end"] && event["start"]) {
          totalTime += event["end"] - event["start"];
        }
      }
      // convert time from ms to s
      return totalTime / 1000;
    },

    reduceSubmissionQuestions(groupedData, fn) {
      let submissionTimes = {};
      for (const [instanceID, questions] of Object.entries(groupedData)) {
        submissionTimes[instanceID] = {};

        for (const [node, events] of Object.entries(questions)) {
          submissionTimes[instanceID][node] = fn(events);
        }
      }
      return submissionTimes;
    },

    applyFilter(val) {
      let data = graphData();
      console.log(data);
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 15px;
  font-weight: bold;
  font-style: italic;
  margin-bottom: 0px;
  display:inline;
}

form {
  margin-top: 50px;
}
</style>