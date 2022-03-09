<template>
<div>
<router-link to="/"><img src="../assets/back-button.png"></router-link>
</div>
<div>
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
    <p>This bar chart shows the average time spent responding to each
      question across submissions. This is the total time that the
      question has been selected across all submissions divided by the
      number of submissions that selected the question.</p>
    <AvgTimePerQuestion />
  </div>
  <div class="graph" v-else-if="graphNum == 2">
    <p>This bar chart shows the average number of times the
      response to each question is changed. This is the total
      number of times the response to this question was changed
      divided by the number of submissions that selected the question.
      When calculating the number of changes, the first entry
      to a question isn't counted, only subsequent changes.</p>
    <AvgChangesPerQuestion :width="300" :height="150"/>
  </div>
  <div class="graph" v-else-if="graphNum == 3">
    <p>This bar chart shows the total amount of time spent
      answering questions per submission. This metric only
      includes time spent on a submission while selecting a question.</p>
    <TimeSpentPerQuestion :width="300" :height="150"/>
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AvgChangesPerQuestion from "../components/AvgChangesPerQuestion";
import TimeSpentPerQuestion from "../components/TimeSpentPerQuestion";
import AvgTimePerQuestion from '../components/AvgTimePerQuestion.vue';

export default {
  name: "Summary",
  components: {
    AvgChangesPerQuestion,
    TimeSpentPerQuestion,
    AvgTimePerQuestion,
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
select {
  width:50%;
  height:50px;
  font-size: 20px;
}
option {
  text-align: center;
  font-size:20px;
   width:50%;
  height:50px;
}

img{
  height: 30px;
  position: relative;
}

h2 {
  font-size: 15pt;
}

h1{
  margin-left: -10px;
}

p {
  border-top:1px dotted;
  border-bottom:1px dotted;
  margin-left:auto;
  margin-right:auto;
  text-align:center;
  width: 50%; /* whatever width you want */
}

section p {
  display: inline-block;
  font-size: 40pt;
  font-style: bold;
  animation: fadeIn linear 3s;
}

div > p {
  font-size: 20px;
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
