<template>
  <div id="backdrop" v-if="isVisible">
    <div id="content">
      <h3>{{ t("new_game_dialog.title") }}</h3>
      <input
        type="number"
        :min="OPPONENTS_MIN_COUNT"
        :max="OPPONENTS_MAX_COUNT"
        v-model="opponentsCount"
      />
      <div class="buttons_zone">
        <button @click="handleCancel" class="cancel">
          {{ t("dialogs_generalities.cancel_button") }}
        </button>
        <button @click="handleConfirm" class="validate">
          {{ t("dialogs_generalities.validate_button") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  OPPONENTS_MIN_COUNT,
  OPPONENTS_MAX_COUNT,
} from "@/services/PositionGenerator";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const isVisible = ref(false);
    const okClicked = ref(false);
    const cancelClicked = ref(false);
    const opponentsCount = ref(OPPONENTS_MIN_COUNT);

    const { t } = useI18n();

    function handleCancel() {
      cancelClicked.value = true;
    }

    function handleConfirm() {
      okClicked.value = true;
    }

    function show() {
      okClicked.value = false;
      cancelClicked.value = false;
      return new Promise((resolve) => {
        let buttonClickcheckHandle;
        function checkClickOnCloseButtons() {
          if (okClicked.value) {
            isVisible.value = false;
            resolve(opponentsCount.value);
            clearInterval(buttonClickcheckHandle);
          }
          if (cancelClicked.value) {
            isVisible.value = false;
            resolve();
            clearInterval(buttonClickcheckHandle);
          }
        }
        buttonClickcheckHandle = setInterval(checkClickOnCloseButtons, 700);
        isVisible.value = true;
      });
    }

    return {
      opponentsCount,
      OPPONENTS_MIN_COUNT,
      OPPONENTS_MAX_COUNT,
      isVisible,
      show,
      handleCancel,
      handleConfirm,
      t,
    };
  },
};
</script>

<style scoped>
#backdrop {
  position: absolute;
  background-color: #cccccc7a;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#content {
  position: absolute;
  background-color: white;
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  flex-direction: column;
}

h3 {
  font-size: 1.6rem;
}

.buttons_zone {
  display: flex;
  flex-direction: row;
  justify-content: stretch;
}

button {
  border-radius: 5px;
  color: white;
  margin: 0 auto;
  font-size: 1.6rem;
}

button.validate {
  background-color: yellowgreen;
}

button.cancel {
  background-color: salmon;
}

input[type="number"] {
  font-size: 1.6rem;
  width: 10%;
  margin: 0 auto;
}
</style>