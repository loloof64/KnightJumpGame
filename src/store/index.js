import { createStore } from "vuex";

const storeDefinition = {
  state() {
    return {
      generationCancelRequest: false,
      generationStepsCount: 0,
      generationStepProgress: 0,
      opponentPiecesCount: 0,
      answerData: undefined,
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
    },
  },
  actions: {
    cancelGeneration(context) {
      context.commit("cancelGeneration");
    },
    resetCancelGenerationFlag(context) {
      context.commit("resetCancelGenerationFlag");
    },
    setGenerationStepsCount(context, payload) {
      context.commit("setGenerationStepsCount", payload);
    },
    incrementGenerationStepProgress(context) {
      context.commit("incrementGenerationStepProgress");
    },
    setOpponentPiecesCount(context, payload) {
      context.commit("setOpponentPiecesCount", payload);
    },
  },
};

export default createStore(storeDefinition);
