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
      <p>{{ getAvgFormSubmissionTime() }}</p>
    </section>
  </article>
  <article>
  <select id="pet-select">
    <option value="">Choose a chart to display</option>
    <option value="dog">Average Time Spent Responding Per Question</option>
    <option value="cat">Average Number of Response Changes Per Question</option>
    <option value="hamster">Time Spent Responding Per Submission</option>
  </select>
  </article>
  <router-link to="/">Go Back To Home</router-link>
</template>

<script>
import {mapGetters} from "vuex";

 export default {
    name: 'Summary',
    computed: {
      ...mapGetters({file: "getData"})
    },
    methods: {
      getFirstKey() {
        let keyString = Object.keys(this.file)[0] + '';
        return this.file[keyString];
      },
      getNumQuestions() {
        let key = this.getFirstKey();
        let value = this.file[key];
        /* temporary value!! */
        return 0;
      },
      getAvgFormSubmissionTime() {
        /* temporary value!! */
       return 0;
      }
    }
 }
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

p {
  display: inline-block;
  font-size: 40pt;
  font-style: bold;
  animation: fadeIn linear 3s;
}

@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}
</style>