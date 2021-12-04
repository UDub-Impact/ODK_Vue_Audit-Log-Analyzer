<template>
    <header>
        <h1>{{title}}</h1>
        <router-link to='/instructions'>Instructions</router-link>
    </header>
</template>

<script>

export default {
  name: 'Header',
  props: {
    title: String,
  },
  computed: {
    homePage() {
      if(this.$route.path === '/') {
          return true;
      } else {
        return false;
      }
    }
  }
}

</script>

<style scoped>
header {
    justify-content: s-pace-between;
    align-items: center;
    margin-bottom: 20px;
}
</style>
