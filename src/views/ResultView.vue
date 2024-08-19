<template>
  <HeaderSection />
  <v-card elevation="4" class="results-card">
    <v-card-title class="text-center my-4">
      <h1 class="font-weight-thin">Quiz Results</h1>
    </v-card-title>

    <v-card-text class="text-center">
      <h2 class="display-1">Congratulations!</h2>
      <p class="mt-4">You finished the game with a score:</p>
      <h2>{{ score }} of {{ total }}</h2>
      <h2 class="mt-4">You got {{ percentage }}% correct!</h2>
    </v-card-text>

    <v-card-text v-if="timeSpent.length" class="text-center">
      <h2>Time Spent on Each Question:</h2>
      <ul>
        <li v-for="(time, index) in timeSpent" :key="index">
          Question {{ index + 1 }}: {{ (time / 1000).toFixed(2) }} seconds
        </li>
      </ul>
    </v-card-text>

    <v-spacer></v-spacer>

    <v-card-actions class="justify-center mt-10">
      <v-btn @click="retry" class="retry-btn" variant="outlined">Retry Quiz</v-btn>
      <v-btn @click="goHome" class="home-btn" variant="outlined">Go Home</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HeaderSection from '../components/HeaderSection.vue';

const store = useStore();
const router = useRouter();

const timeSpent = store.state.timeSpent as number[];
const results = store.state.results;
const score = results.score;
const total = results.total;
const percentage = computed(() => (total > 0 ? ((score / total) * 100) : 0).toFixed(2));

const retry = () => {
  store.dispatch('resetQuiz');
  router.push('/');
};

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.results-card {
  min-height: 90vh;
  background-color: rgb(14, 100, 53);
  color: white;
  font-size: 16px;
}

.retry-btn, .home-btn {
  color: white;
}

.retry-btn {
  background-color: rgb(14, 100, 53);
}

.home-btn {
  background-color: rgb(14, 100, 53);
}
</style>