<template>
        <p>Learn more about how to upload data into the analyer.</p>
        <router-link to='/instructions'>Click for More</router-link>
        <h2 class="csv-header">Upload CSV File:</h2>
        <UploadFile />
        <UploadFile />
        <button @click="$router.push('/summary')">Click to Analyze</button>
</template>

<script>
import UploadFile from '../components/UploadFile'

export default {
    name: 'Home',
    components: {
        UploadFile,
    },
}
</script>

<style scoped>
.csv-header {
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
