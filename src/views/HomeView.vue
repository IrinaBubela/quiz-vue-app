<template>
  <v-container>
    <HeaderSection />
    <v-card class="main-card">
      <v-card-title class="d-flex justify-center align-center">
        <h1>Trivia Quiz App</h1>
      </v-card-title>

      <v-card-subtitle class="mb-4">
        <h2 class="display-2">Setup Your Quiz</h2>
      </v-card-subtitle>

      <v-card-actions>
        <v-text-field
          v-model="questionLength"
          name="questionLength"
          type="number"
          class="text-field"
          label="Number of Questions (min. 5)"
          min="5"
          step="1"
          outlined
        ></v-text-field>
      </v-card-actions>

      <v-card-actions>
        <v-select
          v-model="difficultyLevel"
          :items="difficultyLevels"
          item-value="value"
          item-title="label"
          label="Select Difficulty Level"
          outlined
          dense
          class="modern-select"
          hide-details
        ></v-select>
      </v-card-actions>

      <v-card-actions>
        <v-select
          v-model="questionType"
          :items="itemOptions"
          item-value="value"
          item-title="label"
          label="Question Type"
          outlined
          dense
          class="modern-select"
          hide-details
        ></v-select>
      </v-card-actions>

      <v-card-actions class="pt-4 justify-end">
        <v-btn
          elevation="4"
          :loading="isLoading"
          color="white"
          class="ma-2 white--text submit-btn"
          variant="outlined"
          :disabled="!isValidated"
          @click="startGame"
          large
        >
          Start Game!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.main-card {
  width: 100vw;
  min-height: 90vh;
  margin: 0 !important;
  background-color: rgb(14, 100, 53) !important;
  color: rgb(255, 255, 255) !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Roboto Flex", sans-serif;
  font-size-adjust: none;
  padding: 8px !important;
}

.text-field {
  margin: 0 auto;
}

.modern-select {
  .v-select__selections,
  .v-select__slot,
  .v-select__control {
    border-radius: 4px;
    border: 1px solid #cccccc;
  }

  .v-select__selections {
    background-color: #ffffff;
  }
}

.bg-teal-lighten-5 {
  background-color: #e3f2fd;
}

.rounded-lg {
  border-radius: 8px;
}

.headline {
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
}

.v-card-actions {
  padding: 16px 24px;
}

.v-messages,
.v-input__details {
  display: none !important;
}

.submit-btn {
  background-color: rgb(14, 100, 53);

  &:hover {
    background-color: white;
    color: rgb(14, 100, 53) !important;
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import HeaderSection from '../components/HeaderSection.vue';

interface ItemOption {
  label: string;
  value: string;
}

const itemOptions: ItemOption[] = [
  { label: 'Multiple', value: 'multiple' },
  { label: 'True or False', value: 'boolean' }
];

const difficultyLevels: ItemOption[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
];

const store = useStore();
const router = useRouter();

const questionLength = ref('');
const difficultyLevel = ref('');
const questionType = ref('');
const isLoading = ref(false);

const isValidated = computed(() =>
  questionType.value !== '' &&
  Number(questionLength.value) >= 5 &&
  difficultyLevel.value !== ''
);

function updateSelection() {
  const selection = [questionLength.value, difficultyLevel.value, questionType.value];
  store.commit("getData", selection);
}

async function startGame() {
  if (!isValidated.value) return;

  isLoading.value = true;
  updateSelection();

  try {
    await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await router.push('/quiz');
  } catch (error) {
    console.error('Navigation error:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>
