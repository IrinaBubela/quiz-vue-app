import { createStore } from 'vuex'

export default createStore({
  state: {
    data: '',
    results: {
      score: 0,
      total: 0
    },
    quizArr: [],
  },
  getters: {
  },
  mutations: {
    getData(state, newData) {
      state.data = '',
        state.data += newData;
    },
    updateResults(state, { score, total }) {
      state.results = {
        score,
        total
      };
    },
    setQuizArr(state, payload) {
      state.quizArr = payload;
    },
    resetState(state) {
      state.data = '';
      state.results = {
        score: 0,
        total: 0
      };
      state.quizArr = [];
    },

  },
  actions: {
    resetQuiz({ commit }) {
      commit('resetState');
    },
  },
  modules: {
  }
})
