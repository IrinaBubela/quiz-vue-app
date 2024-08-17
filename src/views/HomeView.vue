<template>
  <v-container class="py-6 px-4 text-center">
    <v-card class="mx-auto mt-4 main-card" max-width="100vw">
      <v-card-title class="d-flex justify-center align-center" primary-title>
        <h1 class="font-weight-thin">Trivia Quiz App</h1>
      </v-card-title>

      <v-card-subtitle class="mt-4 mb-4">
        <h2 class="display-2">Setup Your Quiz</h2>
      </v-card-subtitle>

      <v-card-actions>
        <v-text-field v-model="question_length" name="question_length" type="number" class="text-field"
          label="Number of Questions (min. 5)" min="5" step="1" outlined></v-text-field>
      </v-card-actions>

      <v-card-actions>
        <v-select v-model="level" :items="difficultyLevels" item-value="value" item-title="label"
          label="Select Difficulty Level" outlined dense class="modern-select" hide-details>
        </v-select>
      </v-card-actions>

      <v-card-actions>
        <v-select v-model="question_type" :items="itemOptions" item-value="value" item-title="label" label="Question Type" outlined dense class="modern-select"
          hide-details></v-select>
      </v-card-actions>

      <v-card-actions class="pt-4 justify-end">
        <v-btn elevation="6" :loading="loading5" color="black" class="ma-2 white--text submit-btn" variant="outlined"
          :disabled="!validated" @click="selected" large>
          <router-link style="text-decoration: none; color: inherit;" to='/quiz'>
            Start Game!
          </router-link>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>



<style lang="scss">
.main-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.text-field {
  margin: 0 auto;
}

.modern-select {
  .v-select__selections {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 4px;
  }

  .v-select__slot {
    border-radius: 4px;
    border: 1px solid #cccccc;
  }

  .v-select__control {
    border-radius: 4px;
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

.sumbit-btn {
  background-color: black;

  &:hover {
    background-color: white
  }
}
</style>



<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

interface ItemOption {
  label: string;
  value: string;
}

const itemOptions: ItemOption[] = [
  { label: 'Multiple', value: 'multiple' },
  { label: 'True or False', value: 'boolean' }
];

const store = useStore();

const question_length = ref('');
const level = ref('');
const question_type = ref('');
const items = ['Multiple', 'True or False'];
const selection = ref<string[]>([]);
const loading5 = ref(false);

const difficultyLevels = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
];

const validated = computed(() => question_type.value !== '' && Number(question_length.value) >= 5 && level.value !== '');

function selected() {

  selection.value.push(question_length.value, level.value, question_type.value);
  store.commit("getData", selection.value);
  console.log('selected', selection.value);
}
</script>
