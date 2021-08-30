<template>
<div id="root">
  <new-game-dialog ref="newGameDialog" />
  <game-rules ref="gameRulesDialog" />
  <chess-board id="board" ref="board" />
  <div id="buttons_zone">
    <button @click="showNewGameDialog" class="new_game">{{ t('main_page.new_game_button') }}</button>
    <button @click="showGameRulesDialog" class="games_rules">{{ t('main_page.game_rules_button') }}</button>
  </div>
</div>
</template>

<script>
import {ref} from 'vue';
import { useI18n } from "vue-i18n";
import ChessBoard from '@/components/ChessBoard';
import NewGameDialog from '@/components/NewGameDialog';
import GameRules from '@/components/GameRules';

export default {
  name: 'App',
  setup() {
    const newGameDialog = ref();
    const gameRulesDialog = ref();
    const board = ref();
    const {t} = useI18n();

    async function showNewGameDialog() {
      const opponentPiecesCount = await newGameDialog.value.show();
      if (opponentPiecesCount) {
        await board.value.newGame(opponentPiecesCount);
      }
    }

    async function showGameRulesDialog() {
      await gameRulesDialog.value.show();
    }

    return {
      newGameDialog,
      gameRulesDialog,
      showNewGameDialog,
      showGameRulesDialog,
      board,
      t,
    }
  },
  components: {
    ChessBoard,
    NewGameDialog,
    GameRules,
  }
}
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

body, html {
  margin: 0;
}

button {
  border-radius: 5px;
  
  font-size: 1.6rem;
}

button.new_game {
  color: white;
  background-color: olive;
}

button.games_rules {
  color: white;
  background-color: palevioletred;
}

#buttons_zone {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}
</style>
