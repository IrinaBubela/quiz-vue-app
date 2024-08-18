<template>
  <v-card class="mx-auto mt-5" max-width="800" elevation="4">
    <v-card-title primary-title class="justify-center rounded-card mb-1">
      <h1 class="font-weight-thin">True/False Quiz</h1>
    </v-card-title>
    <v-card-text primary-title class="pt-2">
      <p>Question no. {{ currentIndex + 1 }}</p>
      <v-progress-linear class="mt-2" color="cyan-darken-2" v-model="progress" height="25">
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
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
        <v-radio-group v-model="answered" @change="saveAnswer">
          <v-radio label="True" value="True"></v-radio>
          <v-radio label="False" value="False"></v-radio>
        </v-radio-group>
      </v-card-actions>
    </v-card>
    <v-card-actions class="d-flex justify-space-around">
      <v-btn @click="previous" elevation="2" color="grey lighten-1" size="x-large">Previous</v-btn>
      <v-btn @click="exit" elevation="2" color="black" size="x-large">Exit</v-btn>
      <v-btn @click="next" elevation="2" color="cyan-darken-2" size="x-large">Next</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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
const progress = ref(0);
const answers = ref<string[]>([]);

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
    updateProgress();
    loading.value = false; // Set loading to false once data is fetched
  } catch (err) {
    console.error("Server Error:", err);
  }
};

const getQuestion = () => {
  if (questions.value && questions.value.results.length > 0) {
    const question = questions.value.results[currentIndex.value].question;
    currentQuestion.value = question
      .replace(/(&quot;)/g, " ")
      .replace(/(&#039;)/g, "'");
    answered.value = answers.value[currentIndex.value] || null;
  }
};

const getCorrectAnswer = () => {
  if (questions.value && questions.value.results.length > 0) {
    correctAnswer.value = questions.value.results[currentIndex.value].correct_answer;
  }
};

const answerClass = () => {
  if (!correctAnswer.value || !answered.value) return;
  if (correctAnswer.value === answered.value) {
    correct.value++;
  }
};

const next = () => {
  if (!answered.value) {
    alert("You didn't select a value");
    return;
  }
  answerClass();
  saveAnswer();
  if (currentIndex.value >= parseInt(props.quizArr[0]) - 1) {
    store.commit("updateResults", {
      score: correct.value,
      total: parseInt(props.quizArr[0])
    });
    router.push("/result");
  } else {
    currentIndex.value++;
    getQuestion();
    updateProgress();
  }
};

const exit = () => {
  store.dispatch('resetQuiz');
  router.push("/");
};

const previous = () => {
  saveAnswer(); // Save the answer before moving to the previous question
  if (currentIndex.value > 0) {
    currentIndex.value--;
    getQuestion();
    updateProgress();
  }
};

const updateProgress = () => {
  if (!questions.value || questions.value.results.length === 0) return;
  progress.value = ((currentIndex.value + 1) / questions.value.results.length) * 100;
};

const saveAnswer = () => {
  if (answered.value !== null) {
    answers.value[currentIndex.value] = String(answered.value);
  }
};

// Watcher to ensure answers are saved correctly when navigating between questions
watch([currentIndex, answered], () => {
  saveAnswer();
});

onMounted(async () => {
  await getAPIquestions();
  getQuestion();
  getCorrectAnswer();
});
</script>

