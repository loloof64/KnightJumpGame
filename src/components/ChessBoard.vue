<template>
  <div class="grid">
    <div
      class="grid_row"
      v-for="row in [0, 1, 2, 3, 4, 5, 6, 7]"
      :key="'row_' + row"
    >
      <div
        :class="classForCell(row, col)"
        v-for="col in [0, 1, 2, 3, 4, 5, 6, 7]"
        :key="'cell_' + row + col"
      >
        <img
          v-if="isPlayerKnightPos(row, col)"
          src="@/assets/chess_vectors/Chess_nlt45.svg"
          width="50"
          height="50"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const playerKnightPos = ref({
      col: 3,
      row: 5,
    });

    function classForCell(row, col) {
      return (row + col) % 2 == 0
        ? { white_cell: true, black_cell: false }
        : { white_cell: false, black_cell: true };
    }

    function isPlayerKnightPos(row, col) {
        console.log(row === playerKnightPos.value.row && col === playerKnightPos.value.col);
      return (
        row === playerKnightPos.value.row && col === playerKnightPos.value.col
      );
    }

    return {
      isPlayerKnightPos,
      classForCell,
    };
  },
};
</script>

<style scoped>
.grid {
  width: 400px;
  height: 400px;
  display: grid;
  grid-template: repeat(8, 1fr) / auto;
}

.grid_row {
  display: grid;
  grid-template: auto / repeat(8, 1fr);
}

.white_cell {
  background-color: navajowhite;
}

.black_cell {
  background-color: peru;
}
</style>