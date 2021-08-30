<template>
  <div id="root">
    <new-game-dialog ref="newGameDialog" />
    <game-rules ref="gameRulesDialog" />
    <chess-board id="board" ref="board" />
    <div id="buttons_zone">
      <button @click="showNewGameDialog" class="new_game">
        {{ t("main_page.new_game_button") }}
      </button>
      <span id="ennemies_count" v-if="opponentPiecesCount > 0">
        {{ opponentPiecesCount }} {{ t("main_page.opponent_pieces") }}
      </span>
      <button @click="showGameRulesDialog" class="games_rules">
        {{ t("main_page.game_rules_button") }}
      </button>
    </div>
    <div class="generation_zone" v-if="isGeneratingGame">
      <progress
        class="progressBar"
        min="0"
        :max="generationSteps"
        :value="generationStepProgress"
      ></progress>
      <button @click="cancelGameGeneration" class="cancel_generation">
        {{ t("main_page.cancel_generation") }}
      </button>
    </div>
    <div class="solution_controls" v-if="solutionControlsVisible">
      <div class="header">{{ t("main_page.possible_solution") }}</div>
      <div class="content">
        <button @click="goPreviousSolution">&lt;</button>
        <input
          ref="slider"
          type="range"
          class="slider"
          step="1"
          min="0"
          :max="solutionSteps"
          :value="answerIndex"
          @change="handleSliderChanged"
        />
        <button @click="goNextSolution">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import ChessBoard from "@/components/ChessBoard";
import NewGameDialog from "@/components/NewGameDialog";
import GameRules from "@/components/GameRules";

export default {
  name: "App",
  setup() {
    const newGameDialog = ref();
    const gameRulesDialog = ref();
    const isGeneratingGame = ref(false);
    const slider = ref();
    const board = ref();
    const { t } = useI18n();
    const store = useStore();

    const opponentPiecesCount = ref(store.state.opponentPiecesCount);
    const answerIndex = ref(0);

    async function showNewGameDialog() {
      const opponentPiecesCount = await newGameDialog.value.show();
      if (opponentPiecesCount) {
        isGeneratingGame.value = true;
        await board.value.newGame(opponentPiecesCount);
        isGeneratingGame.value = false;
      }
    }

    async function showGameRulesDialog() {
      await gameRulesDialog.value.show();
    }

    function cancelGameGeneration() {
      store.dispatch("cancelGeneration");
    }

    const generationSteps = ref(store.state.generationStepsCount);
    const generationStepProgress = ref(store.state.generationStepProgress);
    const gameActive = ref(store.state.gameActive);
    const answerData = ref(store.state.answerData);

    const solutionSteps = ref(0);

    const solutionControlsVisible = computed(
      () => answerData.value && !gameActive.value
    );

    watch(answerIndex, () => board.value.updatePosition());

    store.subscribe((mutation, state) => {
      if (mutation.type === "setGenerationStepsCount") {
        generationSteps.value = state.generationStepsCount;
        generationStepProgress.value = state.generationStepProgress;
      } else if (mutation.type === "incrementGenerationStepProgress") {
        generationStepProgress.value = state.generationStepProgress;
      } else if (mutation.type === "setOpponentPiecesCount") {
        opponentPiecesCount.value = state.opponentPiecesCount;
      } else if (mutation.type === "setGameActive") {
        gameActive.value = state.gameActive;
      } else if (mutation.type === "setAnswerData") {
        answerData.value = state.answerData;
        solutionSteps.value = state.answerData.length - 1;
      } else if (mutation.type === "setAnswerIndex") {
        answerIndex.value = state.answerIndex;
      }
    });

    function goPreviousSolution() {
      if (gameActive.value) return;
      if (answerIndex.value === 0) return;

      store.dispatch("setAnswerIndex", answerIndex.value - 1);
    }

    function goNextSolution() {
      if (gameActive.value) return;
      if (answerIndex.value >= store.state.opponentPiecesCount) return;

      store.dispatch("setAnswerIndex", answerIndex.value + 1);
    }

    function handleSliderChanged() {
      store.dispatch("setAnswerIndex", parseInt(slider.value.value));
    }

    return {
      newGameDialog,
      gameRulesDialog,
      showNewGameDialog,
      showGameRulesDialog,
      board,
      isGeneratingGame,
      cancelGameGeneration,
      generationSteps,
      generationStepProgress,
      opponentPiecesCount,
      gameActive,
      answerData,
      goPreviousSolution,
      goNextSolution,
      solutionControlsVisible,
      solutionSteps,
      answerIndex,
      handleSliderChanged,
      slider,
      t,
    };
  },
  components: {
    ChessBoard,
    NewGameDialog,
    GameRules,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#root {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
}

#board {
  margin: 0.8rem auto;
}

body,
html {
  margin: 0;
}

button {
  border-radius: 0.4rem;
  color: white;
  font-size: 1.6rem;
}

button.new_game {
  background-color: olive;
}

button.games_rules {
  background-color: palevioletred;
}

button.cancel_generation {
  background-color: red;
}

#buttons_zone {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

#ennemies_count {
  font-size: 1.6rem;
}

.generation_zone {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 0.8rem 0;
}

.progressBar,
.slider {
  font-size: 1.6rem;
}

.solution_controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.8rem 0;
}

.solution_controls button {
  background-color: greenyellow;
}

.solution_controls .header {
  font-size: 1.6rem;
}

.solution_controls .content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
