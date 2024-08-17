import { createStore } from 'vuex'

export default createStore({
  state: {
    data: '',
    results: '',

  },
  getters: {
  },
  mutations: {
    getData(state, newData) {
      console.log('getData', newData);
      
      state.data = '',
        state.data += newData;
        console.log('state.data', state.data);
        
    },
    updateResults(state, score) {
      console.log('updateResults', score);
      state.results = '';
      state.results += score;
    }
  },
  actions: {
  },
  modules: {
  }
})
