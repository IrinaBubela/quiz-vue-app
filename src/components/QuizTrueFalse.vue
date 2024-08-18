<template>
  <v-container>
    <HeaderSection />
    <v-card class="quiz-card">
      <v-card-title primary-title class="justify-center rounded-card mb-1">
        <h3>True/False Quiz</h3>
      </v-card-title>
      <v-card-text primary-title class="pt-2">
        <p>Question no. {{ currentIndex + 1 }}</p>
        <v-progress-linear class="mt-2 progress-bar" v-model="progress" height="25">
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-card-text>
      <v-spacer></v-spacer>
      <div>
        <v-card-text v-if="loading">
          <h2 class="justify-center font-italic">Loading...</h2>
        </v-card-text>
        <v-card-text v-else>
          <h2 class="justify-center font-italic">{{ currentQuestion }}</h2>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-radio-group v-model="answered" @change="saveAnswer">
            <v-radio label="True" value="True"></v-radio>
            <v-radio label="False" value="False"></v-radio>
          </v-radio-group>
        </v-card-actions>
      </div>
      <v-card-actions class="d-flex justify-center">
        <div class="btns">
          <v-btn @click="previous" elevation="4" color="grey lighten-1" large>Previous</v-btn>
          <v-btn @click="exit" elevation="4" color="black" large>Exit</v-btn>
          <v-btn @click="next" elevation="4" class="next-btn" large>Next</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore as useVuexStore } from 'vuex';
import { defineProps } from 'vue';
import HeaderSection from '../components/HeaderSection.vue'

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

const timeSpent = ref<number[]>([]);
const startTime = ref<number | null>(null);

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
    loading.value = false;
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

    //start timing
    startTime.value = Date.now();
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
      total: parseInt(props.quizArr[0]),
      timeSpent: timeSpent.value
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

const saveAnswer = () => {
  if (answered.value !== null) {
    answers.value[currentIndex.value] = String(answered.value);
    //tracking time
    if (startTime.value) {
      const endTime = Date.now();
      const time = endTime - startTime.value;
      timeSpent.value[currentIndex.value] = time;
    }
  }
};


watch([currentIndex, answered], () => {
  saveAnswer();
});

onMounted(async () => {
  await getAPIquestions();
  getQuestion();
  getCorrectAnswer();
});
</script>

<style lang="scss" scoped>
.v-container {
  width: 100vw;
  padding: 0px !important;
  margin: 0 !important;
}

.v-card {
  min-height: 90vh !important;
}

.quiz-card {
  max-width: 100vw;
  min-width: 100vw;
  padding: 16px !important;
  margin: 0 !important;
}

h3 {
  color: rgb(14, 100, 53);
}

.progress-bar {
  color: rgb(14, 100, 53);
}

.v-progress-linear__background {
  background: black;
}

.v-progress-linear__content strong{
  color: white !important;
}

.next-btn {
  color: rgb(14, 100, 53);
}

.v-card-actions {
  width: 100vw;
}

.btns {
  display: flex;
  justify-content: space-around;
  width: 30vw;
}
</style>
