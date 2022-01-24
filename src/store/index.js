import { createStore } from 'vuex'

export default createStore({
  state: {
    file: {}
  },
  mutations: {
    setFile (state, fileData) {
      state.file = fileData;
    }
  },
  getters: {
    getData(state) {
      return state.file;
    },
  }
});