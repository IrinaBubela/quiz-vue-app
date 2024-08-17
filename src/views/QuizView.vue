<template>
    <div>
      <main v-if="quizArr[2] === 'multiple'">
        <QuizMultipleChoice :quizArr="quizArr" />
      </main>
      <main v-else-if="quizArr[2] === 'boolean'">
        <QuizTrueFalse :quizArr="quizArr" />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import QuizMultipleChoice from '../components/QuizMultipleChoice.vue';
  import QuizTrueFalse from '../components/QuizTrueFalse.vue';
  
  const quizArr = ref<string[]>([]);
  const store = useStore();
  
  onMounted(() => {
    const quizType = store.state.data as string;
    quizArr.value = quizType.split(",");
    console.log(quizArr, 'quizArr');
    
  });
  </script>
  