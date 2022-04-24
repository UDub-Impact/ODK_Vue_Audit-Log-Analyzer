<template>
<article >
    <div>
      <h1>Filtering & Sorting:</h1>
      <select id="graph-filter">
        <option value="lessThan">Less Than</option>
        <option value="greaterThan">Greater Than</option>
      </select>
      <input id="filterLimit" placeholder="Filter Limit" />
      <button class="button" @click="applyFilter()">Apply Filter</button>
    </div>

    <section v-if="this.filtData[0].length >= 10 && !this.filtData[1].every((v) => parseInt(v) === 0)" @change="updateGraph">
      <label>
        <input type="radio" name="filtering" value="smallest" />
        Smallest 5 Entries
      </label>
      <label>
        <input type="radio" name="filtering" value="largest" />
        Highest 5 Entries
      </label>
      <label>
        <input checked type="radio" name="filtering" value="mix" />
        Smallest 5 and Largest 5 Entries
      </label>
    </section>
  </article>
  <BarChart :data=this.data :stylingLabels=this.styling></BarChart>
</template>

<script>
import { defineComponent } from "vue";
import BarChart from "../BarChart.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "AvgChangesPerQuestion",
  components: {
    BarChart,
  },
  computed: {
    ...mapGetters({ file: "getData" }),
  },
  data() {
    return {
      data: [[], []],
      allData: [[], []],
      filtData: [[], []],
      styling: {
         text: "Average Changes Per Question",
         labelStringX: "Questions",
         labelStringY: "Number of Changes",
      }
    };
  },
  created() {
    this.allData = this.graphData();
    this.filtData = this.graphData();
    console.log(this.filtData);
    this.data = this.filteredData();
  },
  methods: {
     updateGraph() {
      let labels = this.filtData[0];
      let values = this.filtData[1];
      let options = document.querySelector("input:checked").value;
      let size = values.length;
      if (options === "smallest") {
        labels = labels.slice(0, 5);
        values = values.slice(0, 5);
      } else if (options === "largest") {
        labels = labels.slice(values.length - 5, size);
        values = values.slice(values.length - 5, size);
      } else {
        labels = [].concat(labels.slice(0, 5), labels.slice(size - 5, size));
        values = [].concat(values.slice(0, 5), values.slice(size - 5, size));
      }
      this.data = [labels, values];
    },
    filteredData() {
      let questionLabels = [...this.allData[0]];
      let avgAnswerTimes = [...this.allData[1]];
      let size = questionLabels.length;
      if (size > 10) {
        questionLabels = [].concat(
          this.allData[0].slice(0, 5),
          this.allData[0].slice(size - 5, size)
        );
        avgAnswerTimes = [].concat(
          this.allData[1].slice(0, 5),
          this.allData[1].slice(size - 5, size)
        );
      }
      return [questionLabels, avgAnswerTimes];
    },
    applyFilter() {
      // check that filterLimit is a number
      let filterLimit = parseInt(this.getFilterLimit());
      let filterOption = document.getElementById("graph-filter").value;

      let questionLabels = [...this.allData[0]];
      let avgAnswerTimes = [...this.allData[1]];

      let isLessThan = filterOption === "lessThan";
      let filteredQ = [];
      let filteredResp = [];

      console.log("questions");
      console.log(questionLabels);
      console.log("answers");
      console.log(avgAnswerTimes);
      // check that question and avgAnswer lengths match
      for (let i = 0; i < questionLabels.length; i++) {
        if (isLessThan) {
          //console.log(avgAnswerTimes[i] + " - " + questionLabels[i]);
          if (avgAnswerTimes[i] < filterLimit) {
            // include that question and label
            filteredQ.push(questionLabels[i]);
            filteredResp.push(avgAnswerTimes[i]);
          }
        } else {
          //console.log(avgAnswerTimes[i] + " - " + questionLabels[i]);
          if (avgAnswerTimes[i] > filterLimit) {
            filteredQ.push(questionLabels[i]);
            filteredResp.push(avgAnswerTimes[i]);
          }
        }
        //console.log(filteredQ);
        //console.log(filteredResp);
        //let data = this.graphData();
        this.data = [filteredQ, filteredResp];
        this.filtData = [filteredQ, filteredResp];
        //if (filData)
      }
    },
    getFilterLimit() {
      // Selecting the input element and get its value
      let inputVal = document.getElementById("filterLimit").value;
      // Displaying the value
      return inputVal;
    },
    /**
     * Returns an array of labels for the chart followed by an array of corresponding
     * data points that indicate the height of the bar for a specific label. The labels
     * represent the names of the various questions on the graph and the values represent the
     * number of times responses were changed for that question.
     */
    graphData() {
      const groupedAuditData = JSON.parse(JSON.stringify(this.file));
      let groupedSubmissionQuestionChanges = this.reduceSubmissionQuestions(
        groupedAuditData,
        this.calculateQuestionChanges
      );

      let averageQuestionChanges = this.calculateAverageQuestionValues(
        groupedSubmissionQuestionChanges
      );

      let questionLabels = [];
      let avgAnswerTimes = [];

      averageQuestionChanges.forEach((user) => {
        questionLabels.push(user["node"]);

        avgAnswerTimes.push(user["value"].toFixed(2));
      });

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
    calculateQuestionChanges(events) {
      let totalChanges = 0;
      for (const event of events) {
        if (event["old-value"]) {
          totalChanges++;
        }
      }

      return totalChanges;
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
  },
});
</script>
<style scoped>
h1 {
  font-size: 15px;
  font-weight: bold;
  font-style: italic;
  margin-bottom: 0px;
  display: inline;
}

article {
  margin-top: 50px;
  border: 3px solid black;
}

div {
  margin-right: auto;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
}

label {
  font-size: 12px;
}
</style>