<template>
  <v-card elevation="4">
    <v-card-title primary-title class="rounded-card mb-1">
      <h1 class="font-weight-thin">Quiz Results</h1>
    </v-card-title>
    <v-card-text class="text-center">
      <h2 class="display-1">Congratulations!</h2>
      <p>You finished the game with a score of:</p>
      <h3>{{ score }} of {{ total }}</h3>
      <h4>You got {{ percentage }}% correct!</h4>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn @click="retry" color="cyan-darken-2">Retry Quiz</v-btn>
      <v-btn @click="goHome" color="black">Go Home</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const results = store.state.results;
const score = results.score;
const total = results.total;
const percentage = computed(() => (total > 0 ? (score / total) * 100 : 0).toFixed(2));

const retry = () => {
  store.dispatch('resetQuiz');
  router.push("/");
};

const goHome = () => {
  router.push("/");
};
</script>
