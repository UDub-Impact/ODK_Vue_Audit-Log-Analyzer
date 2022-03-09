<template>
  <BarChart :data=this.data :stylingLabels=this.styling></BarChart>
</template>
<script>
import { defineComponent } from "vue";
import BarChart from "./BarChart.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "samplechart",
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
         text: "Average Changes Per Question",
         labelStringX: "Questions",
         labelStringY: "Number of Changes",
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