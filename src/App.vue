<template>
    <v-app id="app">
      <v-main>
        <router-view />
      </v-main>
    </v-app>
</template>

<style lang="scss">
#app {
height: 100%;
overflow-y: auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script>
export default {
  name: 'App',
}
</script>