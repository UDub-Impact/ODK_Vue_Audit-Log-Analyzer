<template>
  <h1>Summary Statistics</h1>
  <article>
    <section>
      <h2>Total Submissions</h2>
      <p>{{ Object.keys(this.file).length }}</p>
    </section>
    <section>
      <h2>Number of Questions</h2>
      <p>{{ getNumQuestions() }}</p>
    </section>
    <section>
      <h2>Average Form Submission Time</h2>
      <p>{{ getAvgFormSubmissionTime() }} s</p>
    </section>
  </article>
  <article>
    <select v-model="graphNum" id="graph-options">
      <option value="0">Choose a chart to display</option>
      <option value="1">Average Time Spent Responding Per Question</option>
      <option value="2">Average Number of Response Changes Per Question</option>
      <option value="3">Time Spent Responding Per Submission</option>
    </select>
  </article>
  <div class="graph" v-if="graphNum == 1">
    <AvgTimePerQuestion :width="300" :height="150"/>
  </div>
  <div class="graph" v-else-if="graphNum == 2">
    <AvgChangesPerQuestion :width="300" :height="150"/>
  </div>
  <div class="graph" v-else-if="graphNum == 3">
    <TimeSpentPerQuestion :width="300" :height="150"/>
  </div>
  <router-link to="/">Go Back To Home</router-link>
</template>

<script>
import { mapGetters } from "vuex";
import AvgTimePerQuestion from "../components/AvgTimePerQuestion";
import AvgChangesPerQuestion from "../components/AvgChangesPerQuestion";
import TimeSpentPerQuestion from "../components/TimeSpentPerQuestion";

export default {
  name: "Summary",
  components: {
    AvgTimePerQuestion,
    AvgChangesPerQuestion,
    TimeSpentPerQuestion,
  },
  data() {
    return {
      graphNum: 0,
    };
  },
  computed: {
    ...mapGetters({ file: "getData" }),
  },
  methods: {
    getGroupedAuditData() {
      const groupedAuditData = JSON.parse(JSON.stringify(this.file));
      console.log(groupedAuditData);
      let groupedSubmissionTimes = this.reduceSubmissionQuestions(
        groupedAuditData,
        this.calculateQuestionTime
      );
      return groupedSubmissionTimes;
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
    getFirstKey() {
      let keyString = Object.keys(this.file)[0] + "";
      return keyString;
    },
    getNumQuestions() {
      let key = this.getFirstKey();
      let value = this.file[key];
      return Object.keys(value).length;
    },
    getAvgFormSubmissionTime() {
      let groupedSubmissionTimes = this.getGroupedAuditData();
      console.log(groupedSubmissionTimes);
      let uids = Object.keys(groupedSubmissionTimes);
      let totalTimeAllUsers = 0;
      uids.forEach((user) => {
        let value = groupedSubmissionTimes[user];
        let questions = Object.keys(value);
        questions.forEach((question) => {
          totalTimeAllUsers += value[question];
        });
      });
      return Math.round(totalTimeAllUsers / uids.length);
    },
  },
};
</script>

<style scoped>
section {
  background-color: #bc006b;
  color: white;
  width: 30%;
  border-radius: 20px;
  padding: 5px;
  overflow-wrap: break-word;
}
article {
  display: flex;
  margin: 20px auto 20px auto;
  justify-content: center;
}

option {
  text-align: center;
}

h2 {
  font-size: 15pt;
}

section p {
  display: inline-block;
  font-size: 40pt;
  font-style: bold;
  animation: fadeIn linear 3s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
