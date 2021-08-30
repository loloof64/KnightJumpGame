import { createStore } from "vuex";

const storeDefinition = {
  state() {
    return {
      generationCancelRequest: false,
      generationStepsCount: 0,
      generationStepProgress: 0,
      opponentPiecesCount: 0,
      answerData: undefined,
      gameActive: false,
      answerIndex: 0,
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
    setAnswerData(state, payload) {
      state.answerData = payload;
    },
    setGameActive(state, payload) {
      state.gameActive = payload;
    },
    setAnswerIndex(state, payload) {
      state.answerIndex = payload;
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
    setAnswerData(context, payload) {
      context.commit("setAnswerData", payload);
    },
    setGameActive(context, payload) {
      context.commit("setGameActive", payload);
    },
    setAnswerIndex(context, payload) {
      context.commit("setAnswerIndex", payload);
    },
  },
};

export default createStore(storeDefinition);
