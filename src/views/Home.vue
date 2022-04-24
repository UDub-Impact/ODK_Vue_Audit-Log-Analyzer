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
    /**
     * Display an error below the upload file with the given error text that
     * details why the file upload was unsuccessful.
     */
    displayError(error) {
      if (error) {
        document.querySelector("p").textContent = error;
      } else {
         document.querySelector("p").textContent = "";
      }
    },
    /**
     * Check whether a file was actually uploaded when the user clicks the
     * submit button. Only display the new error message if the user updated
     * the file since the previous error.
     */
    parseBtn() {
        // handle case when no file is uploaded
        if (Object.keys(this.file).length === 0) {

          if (document.querySelector("p").textContent === "") {
            this.displayError("ERROR: Please upload an audit file.");
          }
        // if a file was correctly attached, continue to process it
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
    background-color: #008080; /* teal */
    color: white;
    border: none;
    padding: 15px 32px;
    font-size: 1rem;
    border-radius: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
</style>
