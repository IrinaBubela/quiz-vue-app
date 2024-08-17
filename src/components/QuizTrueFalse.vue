<template>
  <v-card class="mx-auto mt-5" max-width="800" elevation="4">
    <v-card-title primary-title class="justify-center rounded-card mb-1">
      <h1 class="font-weight-thin">True/False Quiz</h1>
    </v-card-title>
    <v-card-text primary-title class="pt-2">
      <p>Question no. {{ currentIndex + 1 }}</p>
    </v-card-text>
    <v-spacer></v-spacer>
    <v-card>
      <v-card-text v-if="loading">
        <h4 class="justify-center font-italic">Loading...</h4>
      </v-card-text>
      <v-card-text v-else>
        <h4 class="justify-center font-italic">{{ currentQuestion }}</h4>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-radio-group label="Select the correct answer" column v-model="answered">
          <v-radio off-icon="mdi-radiobox-blank"
          on-icon="mdi-radiobox-marked" label="True" value="True"></v-radio>
          <v-radio off-icon="mdi-radiobox-blank"
          on-icon="mdi-radiobox-marked" label="False" value="False"></v-radio>
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
import { useRouter } from 'vue-router';
import { useStore as useVuexStore } from 'vuex';
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
const correct = ref(0);

const router = useRouter();
const store = useVuexStore();

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

const getCorrectAnswer = () => {
  correctAnswer.value = questions.value.results[currentIndex.value].correct_answer;
  console.log('getCorrectAnswer', correctAnswer.value);
};

const answerClass = () => {
  console.log('answerClass', correctAnswer.value, answered.value);
  
  if (!correctAnswer.value || !answered.value) return;
  if (correctAnswer.value === answered.value) {
    correct.value++;
  }
};

const next = () => {
  if (!answered.value) {
    answerClass();
    alert("You didn't select a value");
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
    console.log(correctAnswer.value);
    console.log(answered.value);
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
  getCorrectAnswer();
});
</script>