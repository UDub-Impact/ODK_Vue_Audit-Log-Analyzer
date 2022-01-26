<script>
import { defineComponent } from 'vue'
import { Bar } from 'vue3-chart-v2'
import {mapGetters} from "vuex";

export default defineComponent({


  name: 'MonthlyChart',
  computed: {
      ...mapGetters({file: "getData"})
  },
  methods: {
    /**
     * return some sort of an array- need two arrays- one for the labels and other for the average time
     */
    test() {
        let averageQuestionTimes = this.calculateAverageQuestionValues(
          this.file
        );
         console.log(averageQuestionTimes);

          let questionLabels = [];
          let avgAnswerTimes = [];

          averageQuestionTimes.forEach(user => {
          questionLabels.push(user["node"]);
          console.log(user["node"]);
          avgAnswerTimes.push(user["value"]);
          console.log(user["value"]);
        });
        console.log([averageQuestionTimes]);

         return [questionLabels, avgAnswerTimes];

    },
    calculateAverageQuestionValues(groupedSubmissionValues) {
      let questionAggregate = {};
      let questionResponses = {};

      for (const [instanceID, questions] of Object.entries(groupedSubmissionValues)) {
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
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.test()[0],
      datasets: [
        {
          label: 'Average Time (s)',
          backgroundColor: '#f87979',
          data:this.test()[1]
        }
      ]
    })
  },
})

</script>