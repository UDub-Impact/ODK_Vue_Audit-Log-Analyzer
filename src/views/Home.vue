<template>
  <router-link to='/instructions'>Learn how to upload data into the analyer.</router-link>
  <h2>Upload CSV File:</h2>
  <UploadFile @error="displayError" />
  <button @click=parseBtn>Click to Analyze</button>
  <p></p>
</template>

<script>
import UploadFile from '../components/UploadFile'
import { mapGetters } from "vuex";

export default {
  name: 'Home',
  components: {
    UploadFile,
  },
  computed: {
    ...mapGetters({ file: "getData" }),
  },
  mounted() {
    this.$store.commit('setFile', {});
  },
  methods: {
    displayError(error) {
      if (error) {
        document.querySelector("p").textContent = error;
      } else {
         document.querySelector("p").textContent = "";
      }
    },
    parseBtn() {
        // no file was uploaded
        if (Object.keys(this.file).length === 0) {
          // only display a new error if user uploaded an updated file after an earlier
          //  error message was displayed
          if (document.querySelector("p").textContent === "") {
            this.displayError("ERROR: Please upload an audit file.");
          }
        } else {
          this.displayError("");
          this.$router.push({path: '/summary'})
        }
      }
    }
  }
</script>

<style scoped>
h2 {
    padding-top: 15px;
}

p {
  color: red;
}

button {
    background-color: #008080; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    font-size: 1rem;
    border-radius: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
</style>
