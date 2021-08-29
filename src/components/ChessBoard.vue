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
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    function classForCell(row, col) {
      return (row + col) % 2 == 0
        ? { white_cell: true, black_cell: false }
        : { white_cell: false, black_cell: true };
    }

    return {
      classForCell,
    };
  },
};
</script>

<style scoped>
.grid {
  width: 450px;
  height: 450px;
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