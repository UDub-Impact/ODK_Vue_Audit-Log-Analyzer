<template>
    <header>
        <img src="../assets/odk-logo.png">
        <h1>{{title}}</h1>
    </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: String,
  },
}
</script>

<style scoped>
header {
    justify-content: s-pace-between;
    align-items: center;
    margin-bottom: 20px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15pt;
}

img {
  width: 15%;
}
</style>
