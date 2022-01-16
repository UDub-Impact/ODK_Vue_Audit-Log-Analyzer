<template>
  <div class="container">
      <Header @toggle-add-task="toggleAddTask" title = "ODK Audit Log Analyzer" :showAddTask="showAddTask" />
      <router-view ></router-view>
      <Footer />
  </div>

</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');
* {
  box-sizing: border-box;
  margin: 10px;
  padding: 0;
}
body {
  font-family: 'Poppins', sans-serif;
  text-align: center;
}
.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}
.btn:focus {
  outline: none;
}
.btn:active {
  transform: scale(0.98);
}
.btn-block {
  display: block;
  width: 100%;
}
</style>
