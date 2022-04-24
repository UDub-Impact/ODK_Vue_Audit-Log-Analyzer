<template>
  <div class="outer-wrapper">
    <nav>
      <router-link to="/"><img src="../assets/back-button.png"></router-link>
    </nav>
  </div>
  <div>
    <!--Hollistic review of the data-->
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

    <!--Options menu to select a graph-->
    <article>
      <select v-model="graphNum" id="graph-options">
        <option value="0">Choose a chart to display</option>
        <option value="1">Average Time Spent Responding Per Question</option>
        <option value="2">Average Number of Response Changes Per Question</option>
        <option value="3">Time Spent Responding Per Submission</option>
      </select>
    </article>

    <div class="graph" v-if="graphNum == 1">
      <p>
        This bar chart shows the average time spent responding to each
        question across submissions. This is the total time that the
        question has been selected across all submissions divided by the
        number of submissions that selected the question.
      </p>
      <AvgTimePerQuestion />
    </div>

    <div class="graph" v-else-if="graphNum == 2">
      <p>
        This bar chart shows the average number of times the
        response to each question is changed. This is the total
        number of times the response to this question was changed
        divided by the number of submissions that selected the question.
        When calculating the number of changes, the first entry
        to a question isn't counted, only subsequent changes.
      </p>
      <AvgChangesPerQuestion :width="300" :height="150"/>
    </div>

    <div class="graph" v-else-if="graphNum == 3">
      <p>
        This bar chart shows the total amount of time spent
        answering questions per submission. This metric only
        includes time spent on a submission while selecting a question.
      </p>
      <TimeSpentPerSubmission :width="300" :height="150"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AvgChangesPerQuestion from "../components/metrics/AvgChangesPerQuestion";
import TimeSpentPerSubmission from "../components/metrics/TimeSpentPerSubmission";
import AvgTimePerQuestion from '../components/metrics/AvgTimePerQuestion.vue';

export default {
  name: "Summary",
  components: {
    AvgChangesPerQuestion,
    TimeSpentPerSubmission,
    AvgTimePerQuestion,
  },
  data() {
    return {
      graphNum: 0, // indicates the graph that should currently be displayed
    };
  },
  computed: {
    ...mapGetters({ file: "getData" }),
  },
  methods: {
    /**
      * Takes a list of dictionaries with each dictionary corresponding to an
      * event of an ODK audit file. Returns a dictionary that maps a submission
      * id to events for that submission s.t. events for each submission are
      * listed in a dictionary mapping question name (node) to a list of events
      * for that question.
      *
      * eg.  {
      *       "instanceID1":
      *        { "question1": [event, event, event],
  	  *          "question2": [event ,event, event],
      *        },
  	  *       "instanceID2": {...},
      *      }
      * Ignores any events that aren't associated with an instanceID and node
      * (question name). Truncates node names to remove "/data/" prefix and
      * truncates instanceIDs to remove "uuid:" prefix.
     */
    getGroupedAuditData() {
      const groupedAuditData = JSON.parse(JSON.stringify(this.file));
      let groupedSubmissionTimes = this.reduceSubmissionQuestions(
        groupedAuditData,
        this.calculateQuestionTime
      );
      return groupedSubmissionTimes;
    },

    /**
     * Takes a list of events corresponding to a single question in one
     * submission. Returns the total response time for the question in seconds
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

    /** Takes grouped audit dictionary returned by groupAuditData. Returns a
      * grouped dictionary of the same format s.t. each question is mapped
      * to the result of calling fn on its list of events.
      *
      * eg.  {
      *		     "instanceID1":
      *	        {
      *			       "question1": fn(events_list1)
      *		         "question2": fn(events_list2),
      *		      },
      *		      "instanceID2": {...},
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
     * Return a string representing a single uiud from the uploaded form.
     */
    getFirstKey() {
      let keyString = Object.keys(this.file)[0] + "";
      console.log(this.file);
      console.log("keyString " + keyString);
      return keyString;
    },

    /**
     * Return the number of questions on the form.
     */
    getNumQuestions() {
      let key = this.getFirstKey();
      let value = this.file[key];
      return Object.keys(value).length;
    },

    /**
     * Computes the average amount of time it took all of the users to fill out
     * the form. Returns a single floating point number indicating this
     * average time.
     */
    getAvgFormSubmissionTime() {
      let groupedSubmissionTimes = this.getGroupedAuditData();
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
  width: 20%;
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
  height:20px;
  font-size: 12px;
}

option {
  text-align: center;
  font-size:20px;
  width:50%;
  height:50px;
}

img{
  height: 35px;
  position: relative;
}

h1{
  margin: 0px;
  font-size: 25px;
}

h2 {
  font-size: 10pt;
}

p {
  border-top:1px dotted;
  border-bottom:1px dotted;
  margin-left:auto;
  margin-right:auto;
  text-align:center;
  width: 50%;
}

nav {
  text-align: center;
  position: relative;
}

div {
  margin: 0px;
}

section p {
  display: inline-block;
  font-size: 20pt;
  font-style: bold;
  animation: fadeIn linear 3s;
}

div > p {
  font-size: 12px;
}

.outer-wrapper {
  padding-right: 15px !important;
}

.outer-wrapper, img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1em;
}

/* adds fade-in effect to text */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
