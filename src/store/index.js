import { createStore } from "vuex";

const storeDefinition = {
  state() {
    return {
        generationCancelRequest: false,
        generationStepsCount: 0,
        generationStepProgress: 0,
    };
  },
  mutations: {
    cancelGeneration(state) {
        state.generationCancelRequest = true;
    },
    resetCancelGenerationFlag(state) {
        state.generationCancelRequest = false;
    },
    setGenerationStepsCount(state, payload) {
        state.generationStepsCount = payload;
        state.generationStepProgress = 0;
    },
    incrementGenerationStepProgress(state) {
        state.generationStepProgress = state.generationStepProgress + 1;
    }
  },
};

export default createStore(storeDefinition);