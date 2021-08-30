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
        id="progressBar"
        :max="generationSteps"
        :value="generationStepProgress"
      ></progress>
      <button @click="cancelGameGeneration" class="cancel_generation">
        {{ t("main_page.cancel_generation") }}
      </button>
    </div>
    <div class="solution_controls" v-if="solutionControlsVisible">
      <button @click="goPreviousSolution">&lt;</button>
      <button @click="goNextSolution">&gt;</button>
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

    const solutionControlsVisible = computed(() => answerData.value && !gameActive.value);

    watch(answerIndex, () => board.value.updatePosition());

    store.subscribe((mutation, state) => {
      generationSteps.value = state.generationStepsCount;
      generationStepProgress.value = state.generationStepProgress;
      opponentPiecesCount.value = state.opponentPiecesCount;
      gameActive.value = state.gameActive;
      answerData.value = state.answerData;

      if (mutation.type === "setAnswerIndex") {
        answerIndex.value = state.answerIndex;
      }
    });

    function goPreviousSolution() {
      if (gameActive.value) return;
      if (answerIndex.value === 0) return;

      store.dispatch('setAnswerIndex', answerIndex.value - 1);
    }

    function goNextSolution() {
      if (gameActive.value) return;
      if (answerIndex.value >= store.state.opponentPiecesCount) return;

      store.dispatch('setAnswerIndex', answerIndex.value + 1);
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
  margin: 10px auto;
}

body,
html {
  margin: 0;
}

button {
  border-radius: 5px;
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
  margin: 10px 0;
}

#progressBar {
  font-size: 1.6rem;
}

.solution_controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px 0;
}

.solution_controls button {
  background-color: greenyellow;
}
</style>
