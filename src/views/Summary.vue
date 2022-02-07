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
  <div v-if="graphNum==1">
    <AvgTimePerQuestion />
  </div>
  <div v-else-if="graphNum==2">
    <AvgChangesPerQuestion />
  </div>
  <div v-else-if="graphNum==3">
    <TimeSpentPerQuestion />
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
    }
  },
  computed: {
    ...mapGetters({ file: "getData" }),
    displaySelectedComponent() {
      let graphDivs = document.getElementById("graph-components").children;
      let selected = getSelectedFromDropDown();
      for (var graphDiv of graphDivs) {
        if (graphDiv.id !== selected) {
          // change the value of the data vars
          this.data[graphDiv.id] = false;
        }
      }
      this.data[selected] = true;
    },
    getSelectedFromDropDown() {
      for (var option of document.getElementById("graph-options")) {
        if (option.selected) {
          return option.value;
        }
      }
    },
  },
  methods: {
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
      console.log(this.file);
      let uids = Object.keys(this.file);
      let totalTimeAllUsers = 0;
      uids.forEach((user) => {
        let value = this.file[user];
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
