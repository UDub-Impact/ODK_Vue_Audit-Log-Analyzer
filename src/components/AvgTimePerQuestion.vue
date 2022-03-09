<template>
  <select id="graph-filter">
    <option value="lessThan">Less Than</option>
    <option value="greaterThan">Greater Than</option>
  </select>

  <input id="filterLimit" placeholder="Filter Limit" /> <br /><br />
  <button class="button" onClick="applyFilter(filterLimit)">
    Apply Filter
  </button>
  <BarChart :data=this.data :stylingLabels=this.styling></BarChart>
</template>
<script>
import { mapGetters } from "vuex";
import BarChart from "./BarChart.vue";
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
      data: [],
      styling: {
         text: "Average Time Spent Per Question",
         labelStringX: "Time (seconds)",
         labelStringY: "Questions",
      }
    };
  },
  created() {
    this.data = this.graphData();
  },
  methods: {
    /**
     * return some sort of an array- need two arrays- one for the labels and other for the average time
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