<template>
<!-- This is the html set up for AvgChangesPerQuestion graph page -->
  <article>
    <!-- The Filtering and Sorting selections can happen here -->
    <div>
      <h1>Filtering & Sorting:</h1>
      <select id="graph-filter">
        <option value="lessThan">Less Than</option>
        <option value="greaterThan">Greater Than</option>
      </select>
      <input id="filterLimit" placeholder="Filter Limit" />
      <button class="button" @click="applyFilter()">Apply Filter</button>
    </div>

    <section v-if="this.filtData[0].length >= 10 && !this.filtData[1].every((v) => parseInt(v) === 0)"
      @change="updateGraph">
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
    <button class="button" @click="clearFilter()">Clear Filters</button>
  </article>
  <div style="height: 30vw; width: 30vw">
    <BarChart :data="this.data" :stylingLabels="this.styling"></BarChart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BarChart from "../BarChart.vue";
const GRAPH_SIZE = 15;

export default {
  name: "AvgTimePerQuestion",
  components: {
    BarChart,
  },
  computed: {
    ...mapGetters({ file: "getData" }),
  },
    /**
   * Creates the 3 arrays and syling fields for the component
   */
  data() {
    return {
      data: [[], []],
      allData: [[], []],
      filtData: [[], []],
      styling: {
        text: "Average Time Spent Per Question",
        labelStringX: "Questions",
        labelStringY: "Time (seconds)",
      },
    };
  },
  /**
   * This method creates the 3 arrays that are updated as the user interacts with this page
   */
  created() {
    this.allData = this.graphData();
    this.filtData = this.graphData();
    this.data = this.filteredData();
  },
  methods: {
    /**
     * Sets the data displayed in the graphs to filtered data
     */
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

      // sort values/label pairs in ascending order
      averageQuestionTimes.sort(function (a, b) {
        return a.value - b.value;
      });

      let questionLabels = [];
      let avgAnswerTimes = [];

      averageQuestionTimes.forEach((user) => {
        questionLabels.push(user["node"]);

        avgAnswerTimes.push(user["value"].toFixed(2));
      });


      return [questionLabels, avgAnswerTimes];
    },
    /**
     * If data is greater than 10 in length only displays least 5 and greates 5 entries
     */
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

    /**
     * Takes submission data in the format returned by reduceSubmissionQuestions
     * Returns a list of dictionaries s.t. each dictionary maps "node" to question name and "value" to the average value of that question
     * across all submissions
     */
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

    /**
     * Takes a list of events corresponding to a single question in one submission
     * Returns the total response time for the question in seconds
     */
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

        /**
     * Takes grouped audit dictionary returned by groupAuditData
     * Returns a grouped dictionary of the same format s.t. each question is mapped to the result of calling fn on its list of events
     * eg.  {
     *      "instanceID1":
     *      {
     *        "question1": fn(events_list1)
     *        "question2": fn(events_list2),
     *       },
     *      "instanceID2": {...},
     *      }
     */
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
    /**
     * Applies the selected filter (greater/less than) with the input filter limit
     */
    applyFilter() {
      // check that filterLimit is a number
      let filterLimit = parseInt(this.getFilterLimit());
      let filterOption = document.getElementById("graph-filter").value;

      let questionLabels = [...this.allData[0]];
      let avgAnswerTimes = [...this.allData[1]];

      let isLessThan = filterOption === "lessThan";
      let filteredQ = [];
      let filteredResp = [];

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
        
        this.data = [filteredQ, filteredResp];
        this.filtData = [filteredQ, filteredResp];
      }
      if (this.filtData[0].length > 10){
        this.updateGraph();
      }
      
    },
    getFilterLimit() {
      // Selecting the input element and get its value
      let inputVal = document.getElementById("filterLimit").value;
      // Displaying the value
      return inputVal;
    },
    /**
     * Clears all existing filters
     */
    clearFilter() {
      this.allData = this.graphData();
      this.filtData = this.graphData();
      this.data = this.filteredData();
      // var inputF = document.getElementById("id1");
      document.getElementById("filterLimit").value = "";
    }
  },
};
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