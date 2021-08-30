import { createStore } from "vuex";

const storeDefinition = {
  state() {
    return {
        generationCancelRequest: false,
        generationStepsCount: 0,
        generationStepProgress: 0,
        opponentPiecesCount: 0,
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
    },
    setOpponentPiecesCount(state, payload) {
      if (payload >= 0) {
        state.opponentPiecesCount = payload;
      }
    }
  },
};

export default createStore(storeDefinition);