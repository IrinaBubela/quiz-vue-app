<template>
  <v-card class="mx-auto mt-5" max-width="800" elevation="4">
    <v-card-title primary-title class="justify-center rounded-card mb-1">
      <h1 class="font-weight-thin">Multiple Choice Quiz</h1>
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
          <v-radio v-for="n in shuffledAnswers" :key="n" :label="n" :value="n"></v-radio>
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
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import _ from 'lodash';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { defineProps } from 'vue';

const props = defineProps<{
  quizArr: string[];
}>();

const progress = ref(0);
const loading = ref(true);
const questions = ref<any>(null);
const currentQuestion = ref<string | null>(null);
const currentIndex = ref(0);
const answered = ref<string | null>(null);
const correctAnswer = ref<string | null>(null);
const shuffledAnswers = ref<string[]>([]);
const correct = ref(0);
const answers = ref<string[]>([]); // To track answers for each question

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
    updateProgress();
    loading.value = false;
  } catch (err) {
    console.error("Server Error:", err);
  }
};

const getQuestion = () => {
  if (questions.value && questions.value.results[currentIndex.value]) {
    const question = questions.value.results[currentIndex.value].question;
    currentQuestion.value = question
      .replace(/(&quot;)/g, " ")
      .replace(/(&#039;)/g, "'");
    loading.value = false;
    getChoices();
    answered.value = answers.value[currentIndex.value] || null;
  }
};

const getChoices = () => {
  if (questions.value && questions.value.results[currentIndex.value]) {
    const result = questions.value.results[currentIndex.value];
    correctAnswer.value = result.correct_answer;
    const answersList = [...result.incorrect_answers, result.correct_answer];
    shuffledAnswers.value = _.shuffle(answersList.map(a =>
      a.replace(/(&quot;)/g, " ")
        .replace(/(&#039;)/g, "'")
    ));
  }
};

const answerClass = () => {
  if (!correctAnswer.value || !answered.value) return;
  if (correctAnswer.value === answered.value) {
    correct.value++;
  }
};

const saveAnswer = () => {
  if (answered.value !== null) {
    answers.value[currentIndex.value] = String(answered.value);
  }
};

const next = () => {
  if (!answered.value) {
    alert("You haven't selected a value");
    return;
  }
  saveAnswer();
  answerClass();
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

const previous = () => {
  saveAnswer();
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

const exit = () => {
  store.dispatch('resetQuiz');
  router.push("/");
};

watch([currentIndex, answered], () => {
  saveAnswer();
});

onMounted(async () => {
  await getAPIquestions();
  getQuestion();
});
</script>
