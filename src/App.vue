<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<style lang="scss">
#app {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.v-input__details, .v-messages {
  display: none !important;
}

* {
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-stretch: 100%;
}

.v-container {
  width: 100vw !important;
  max-width: 100vw !important;
  overflow-y: auto;
  padding: 0px !important;
  margin: 0 !important;
  text-align: center;
}

@media (min-width: 960px) {
  .v-container {
    width: 100vw !important;
  }
}

.v-card-title {
  font-family: "Bebas Neue", sans-serif !important;
  letter-spacing: 5px !important;
}

.v-card-subtitle {
  font-family: "Roboto Flex", sans-serif;
}

.v-card-actions .v-label {
  font-size: 16px !important;
}
</style>

<script>
export default {
  name: 'App',
}
</script>