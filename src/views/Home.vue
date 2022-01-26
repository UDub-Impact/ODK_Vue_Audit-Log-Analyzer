<template>
  <router-link to='/instructions'>Learn how to upload data into the analyer.</router-link>
  <h2>Upload CSV File:</h2>
  <UploadFile @uploaded-file="storeFile" />
  <!--<LineChart />-->
  <button @click="$router.push({path: '/summary'})">Click to Analyze</button>
</template>

<script>
import UploadFile from '../components/UploadFile'
import LineChart from '../components/Bar.vue'

export default {
    name: 'Home',
    components: {
        UploadFile,
        LineChart,
    },
    data() {
        return {
            file: null,
        }
    },
    methods: {
        storeFile(file) {
            this.file = file;
        }
    }
}
</script>

<style scoped>
h2 {
    padding-top: 15px;
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
