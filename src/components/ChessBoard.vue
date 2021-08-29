<template>
  <div
    ref="rootElt"
    class="grid"
    @mousedown="handleDragStart"
    @mousemove="handleDrag"
    @mouseup="handleDragEnd"
  >
    <div
      class="grid_row"
      v-for="row in [0, 1, 2, 3, 4, 5, 6, 7]"
      :key="'row_' + row"
    >
      <div
        :class="classForCell(row, col)"
        v-for="col in [0, 1, 2, 3, 4, 5, 6, 7]"
        :key="'cell_' + row + col"
      ></div>
    </div>
    <div class="pieces_layer">
      <img
        id="player_knight"
        src="@/assets/chess_vectors/Chess_nlt45.svg"
        :style="{
          left: playerKnightLeft,
          top: playerKnightTop,
        }"
        width="50"
        height="50"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

const cellSizePx = 50;

export default {
  setup() {
    const rootElt = ref();
    const dndData = ref();

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
      return (
        row === playerKnightPos.value.row && col === playerKnightPos.value.col
      );
    }

    function handleDragStart(event) {
      const { clientX, clientY } = event;
      const rootElementRect = rootElt.value.getBoundingClientRect();
      const rootEltX = rootElementRect.left;
      const rootEltY = rootElementRect.top;
      const evtX = clientX - rootEltX;
      const evtY = clientY - rootEltY;

      const evtCol = parseInt(Math.floor(evtX / cellSizePx));
      const evtRow = parseInt(Math.floor(evtY / cellSizePx));

      const isPlayerKnightCell =
        evtCol === playerKnightPos.value.col &&
        evtRow === playerKnightPos.value.row;

      if (!isPlayerKnightCell) return;
      dndData.value = {
        left: evtCol * cellSizePx,
        top: evtRow * cellSizePx,
      };
    }

    function handleDrag(event) {
      if (!dndData.value) return;

      const { clientX, clientY } = event;
      const rootElementRect = rootElt.value.getBoundingClientRect();
      const rootEltX = rootElementRect.left;
      const rootEltY = rootElementRect.top;
      const evtX = clientX - rootEltX;
      const evtY = clientY - rootEltY;

      dndData.value = {
        left: evtX,
        top: evtY,
      };
    }

    function handleDragEnd(event) {
      if (!dndData.value) return;

      const { clientX, clientY } = event;
      const rootElementRect = rootElt.value.getBoundingClientRect();
      const rootEltX = rootElementRect.left;
      const rootEltY = rootElementRect.top;
      const evtX = clientX - rootEltX;
      const evtY = clientY - rootEltY;

      const evtCol = parseInt(Math.floor(evtX / cellSizePx));
      const evtRow = parseInt(Math.floor(evtY / cellSizePx));

      const colInBounds = evtCol >= 0 && evtCol <= 7;
      const rowInBounds = evtRow >= 0 && evtRow <= 7;

      if (colInBounds && rowInBounds) {
        const absDeltaCol = Math.abs(playerKnightPos.value.col - evtCol);
        const absDeltaRow = Math.abs(playerKnightPos.value.row - evtRow);

        const validMove =
          absDeltaCol > 0 && absDeltaRow > 0 && absDeltaRow + absDeltaCol === 3;
        if (validMove) {
          playerKnightPos.value = {
            col: evtCol,
            row: evtRow,
          };
        }
      }

      dndData.value = undefined;
    }

    const dndIsActive = computed(() => !!dndData.value);

    const playerKnightLeft = computed(() => {
      const newValue = dndData.value
        ? dndData.value.left
        : playerKnightPos.value.col * cellSizePx;
      return newValue + "px";
    });
    const playerKnightTop = computed(() => {
      const newValue = dndData.value
        ? dndData.value.top
        : playerKnightPos.value.row * cellSizePx;
      return newValue + "px";
    });

    return {
      rootElt,
      isPlayerKnightPos,
      classForCell,
      handleDragStart,
      handleDrag,
      handleDragEnd,
      dndIsActive,
      dndData,
      playerKnightLeft,
      playerKnightTop,
    };
  },
};
</script>

<style scoped>
.grid {
  position: relative;
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

.pieces_layer {
  position: absolute;
  width: 400px;
  height: 400px;
}

#player_knight {
  position: absolute;
}
</style>