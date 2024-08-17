<template>
    <v-container class="py-6 py-lg-12 text-center">
      <h3 class="text-h4 mt-10">
        Congratulations!
        <br/>
        You finished the game with the score:
      </h3>
      <h2 class="text-h6 text-sm-h5 secondary--text mt-4 w-full w-md-8-12 w-xl-half mx-auto">
        {{ results[1] }} of {{ results[0] }}. You got {{ percent }}% correct.
      </h2>
      <div class="mt-4">
        <v-btn x-large class="my-1 mx-sm-1 w-full w-sm-auto" color="black" @click="newGame">
          Play Again
        </v-btn>
      </div>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  const router = useRouter();
  const store = useStore();
  
  const results = ref<number[]>([]);
  const percent = ref<number | null>(null);
  
  const calculatePercentage = (numA: number, numB: number) => {
    return Math.round((numA / numB) * 100);
  };
  
  const newGame = () => {
    router.push('/');
  };
  
  onMounted(() => {
    const quizType = store.state.data;
    const resultsData = store.state.results;
    const quizArr = quizType.split(",");
    console.log(quizArr, resultsData);
    
    results.value = [parseInt(quizArr[0]), resultsData];
    percent.value = calculatePercentage(results.value[1], results.value[0]);
  });
  </script>
  