import { createStore } from "vuex";

const storeDefinition = {
  state() {
    return {
        generationCancelRequest: false,
    };
  },
  mutations: {
    cancelGeneration(state) {
        state.generationCancelRequest = true;
    },
    resetCancelGenerationFlag(state) {
        state.generationCancelRequest = false;
    }
  },
};

export default createStore(storeDefinition);