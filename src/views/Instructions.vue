<template>
<div class="outer-wrapper">
  <nav>
    <router-link to="/"><img id="back" src="../assets/back-button.png"></router-link>
  </nav>
</div>
  <h1>Instructions</h1>
  <section class="instructions">
    <section>
      <img v-bind:src="login"/>
      <p>Login to<a href="https://sandbox.getodk.cloud">https://sandbox.getodk.cloud</a></p>
    </section>

    <section>
     <img v-bind:src="download_records_button"/>
     <p>Select the desired form, and click on the blue 'Download Records' button.</p>
    </section>

    <section>
      <img v-bind:src="select_all_media"/>
      <p>In order to get the CSV containg the audit data, select 'All data and media files'.</p>
    </section>
    <section>
       <img v-bind:src="csv_files"/>
       <p>
        Unzip the downloaded folder and select the file labeled as audits. Make sure to
        select the CSV containing the audit data rather than the CSV containg the actual
        records from the form.
       </p>
  </section>
   </section>
</template>

<script>
export default {
  name: 'Instructions',
    data: function() {
      return {
        login: require("../assets/login-page.png"),
        csv_files: require("../assets/csv-in-files.png"),
        download_records_button: require("../assets/download-records.png"),
        select_all_media: require("../assets/select-all-media.png"),
      }
    }
}
</script>

<style>
nav {
  text-align: center;
  position: relative;
}

.instructions {
  display: flex;
  width: 95%;
  font-size: 12px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}
.outer-wrapper {
  padding-right: 15px !important;
}

.outer-wrapper, #back {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1em;
}

#back {
  height: 35px;
  position: relative;
}

.instructions img  {
  width: 100%;
}
</style>
