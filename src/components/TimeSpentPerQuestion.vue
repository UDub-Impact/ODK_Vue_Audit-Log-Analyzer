<script>
import { defineComponent } from "vue";
import { Bar } from "vue3-chart-v2";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "BarChart",
  computed: {
    ...mapGetters({ file: "getData" }),
  },
  data() {
    return {
      options: {
        responsive: true,
        title: {
          text: "Avg Changes Per Question",
          display: true,
          fontSize: 24,
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Time (seconds)",
                fontColor: "teal",
                fontSize: 18,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Questions",
                fontColor: "teal",
                fontSize: 18,
              },
            },
          ],
        },
      },
    };
  },
  methods: {
    /**
     * return some sort of an array- need two arrays- one for the labels and other for the average time
     */
    graphData() {
      console.log("groupedAuditData: ");
      const groupedAuditData = JSON.parse(JSON.stringify(this.file));
      console.log(groupedAuditData);

      // new
      let groupedSubmissionQuestionTimes = this.reduceSubmissionQuestions(
        groupedAuditData,
        this.calculateQuestionTime
      );
      let submissionTimes = this.calculateAggregateSubmissionValues(
        groupedSubmissionQuestionTimes
      );
      console.log("submissionTimes");
      console.log(submissionTimes);

      let questionLabels = [];
      let avgAnswerTimes = [];

      submissionTimes.forEach((user) => {
        questionLabels.push(user["instance ID"]);

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
    calculateAggregateSubmissionValues(groupedSubmissionValues) {
      let submissionAggregate = [];

      for (const [instanceID, questions] of Object.entries(
        groupedSubmissionValues
      )) {
        let entry = {};
        entry["instance ID"] = instanceID;
        entry["value"] = 0;

        for (const [node, value] of Object.entries(questions)) {
          entry["value"] += value;
        }

        submissionAggregate.push(entry);
      }

      return submissionAggregate;
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
  extends: Bar,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: this.graphData()[0],
        datasets: [
          {
            label: "Average Time (s)",
            backgroundColor: "#f87979",
            data: this.graphData()[1],
          },
        ],
      },
      this.options
    );
  },
});
</script>