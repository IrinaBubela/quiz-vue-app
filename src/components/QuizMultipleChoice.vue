<template>
    <v-card class="mx-auto mt-5" max-width="800" elevation="4">
      <v-card-title primary-title class="justify-center rounded-card mb-1">
        <h1 class="font-weight-thin">Multiple Choice Quiz</h1>
      </v-card-title>
      <v-card-text primary-title class="pt-2">
        <p>Question no. {{ currentIndex + 1 }}</p>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card>
        <v-card-text v-if="loading">
          <h4 class="justify-center font-italic">Loading..</h4>
        </v-card-text>
        <v-card-text v-else>
          <h4 class="justify-center font-italic">{{ currentQuestion }}</h4>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-radio-group v-model="answered">
            <v-radio :off-icon="n ? '$radioOn' : '$radioOff'" v-for="n in shuffledAnswers" :key="n" :label="`${n}`" :value="n"></v-radio>
          </v-radio-group>
        </v-card-actions>
      </v-card>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn @click="exit" elevation="2" color="error" size="x-large">Exit</v-btn>
        <v-btn @click="next" elevation="2" color="black" size="x-large">Next</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  import _ from 'lodash';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    quizArr: string[];
  }>();
  
  const loading = ref(true);
  const questions = ref<any>(null);
  const currentQuestion = ref<string | null>(null);
  const currentIndex = ref(0);
  const answered = ref<string | null>(null);
  const correctAnswer = ref<string | null>(null);
  const shuffledAnswers = ref<string[]>([]);
  const correct = ref(0);
  
  const router = useRouter();
  const store = useStore();

  const getAPIquestions = async () => {
    const link = 'https://opentdb.com/api.php?';
    const typeOption = props.quizArr[2].toLowerCase();
    const quiz = `amount=${props.quizArr[0]}&difficulty=${props.quizArr[1]}&type=${typeOption}`;
    const url = link.concat(quiz);
    try {
      const response = await axios.get(url);
      questions.value = response.data;
    } catch (err) {
      console.error("Server Error:", err);
    }
  };
  
  const getQuestion = () => {
    const question = questions.value.results[currentIndex.value].question;
    currentQuestion.value = question
      .replace(/(&quot;)/g, " ")
      .replace(/(&#039;)/g, "'");
    loading.value = false;
  };
  
  const getChoices = () => {
    const result = questions.value.results[currentIndex.value];
    correctAnswer.value = result.correct_answer;
    const answers = [...result.incorrect_answers, result.correct_answer];
    shuffledAnswers.value = _.shuffle(answers.map(a =>
      a.replace(/(&quot;)/g, " ")
        .replace(/(&#039;)/g, "'")
    ));
    console.log(shuffledAnswers, 'shuffledAnswers');
    
  };
  
  const answerClass = () => {
    console.log(answered.value, 'answered.value');
    
    if (!correctAnswer.value || !answered.value) return;
    if (correctAnswer.value === answered.value) {
      correct.value++;
    } else {
      console.log("incorrect");
    }
    console.log(correct.value);
  };
  
  const next = () => {
    if (!answered.value) {
      answerClass();
      alert("You haven't selected a value");
      return;
    }
    if (currentIndex.value >= parseInt(props.quizArr[0]) - 1) {
      answerClass();
      store.commit("updateResults", correct.value);
      router.push("/result");
    } else {
      answerClass();
      currentIndex.value++;
      getQuestion();
      getChoices();
      console.log(correctAnswer.value);
    }
  };
  
  const exit = () => {
    router.push("/");
  };
  
  watch(currentQuestion, () => {
    answered.value = null;
  });
  
  onMounted(async () => {
    await getAPIquestions();
    getQuestion();
    getChoices();
  });
  </script>
  