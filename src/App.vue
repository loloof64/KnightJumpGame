<template>
  <new-game-dialog ref="newGameDialog" />
  <chess-board id="board" ref="board" />
  <button @click="showNewGameDialog" class="new_game">New game</button>
</template>

<script>
import {ref} from 'vue';
import ChessBoard from '@/components/ChessBoard';
import NewGameDialog from '@/components/NewGameDialog';

export default {
  name: 'App',
  setup() {
    const newGameDialog = ref();
    const board = ref();

    async function showNewGameDialog() {
      const opponentPiecesCount = await newGameDialog.value.show();
      if (opponentPiecesCount) {
        await board.value.newGame(opponentPiecesCount);
      }
    }

    return {
      newGameDialog,
      showNewGameDialog,
      board,
    }
  },
  components: {
    ChessBoard,
    NewGameDialog,
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

#board {
  margin: 10px auto;
}

body {
  margin: 0;
}

button.new_game {
  border-radius: 5px;
  color: white;
  background-color: olive;
  font-size: 1.6rem;
}
</style>
