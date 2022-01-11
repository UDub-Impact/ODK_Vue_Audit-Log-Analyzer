<template>
  <h1>Instructions</h1> 
  <h4>How to upload data.</h4> 
  <section>
    <img v-bind:src="sampleLog"/>
  </section>
  <router-link to="/">Go Back To Home</router-link>
</template>

<script>
    import sampleLog from "../assets/placeholder.png"
    
    export default {
       name: 'Instructions',
       data: function() {
          return {
            sampleLog: require("../assets/placeholder.png"),
          }
        }
    }
    
</script>
