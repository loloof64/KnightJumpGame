<template>
  <div id="backdrop" v-if="isVisible">
    <div id="content">
      <h2>{{ t("games_rules.title") }}</h2>
      <p>{{ t("games_rules.content_1") }}</p>
      <p>{{ t("games_rules.content_2") }}</p>
      <div class="buttons_zone">
        <button @click="handleConfirm" class="validate">
          {{ t("dialogs_generalities.validate_button") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
export default {
  setup() {
    const { t } = useI18n();

    const isVisible = ref(false);
    const okClicked = ref(false);

    function handleConfirm() {
      okClicked.value = true;
    }

    function show() {
      okClicked.value = false;
      let checkHandle;

      return new Promise((resolve) => {
        function checkButtonClicked() {
          if (okClicked.value) {
            isVisible.value = false;
            resolve();
            clearInterval(checkHandle);
          }
        }

        checkHandle = setInterval(checkButtonClicked, 700);
        isVisible.value = true;
      });
    }

    return { t, isVisible, show, handleConfirm };
  },
};
</script>

<style scoped>
#backdrop {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: grey;
  width: 100%;
  height: 100%;
  z-index: 10;
}

#content {
  background-color: whitesmoke;
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.buttons_zone {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

button {
  border-radius: 0.4rem;
  color: white;
  font-size: 1.6rem;
  margin: 0.8rem 0;
}

button.validate {
  background-color: yellowgreen;
}

button.cancel {
  background-color: salmon;
}

h2 {
    text-align: center;
    color: rebeccapurple;
}

p {
    color: saddlebrown;
    font-size: 1.6rem;
    margin: 0.4rem 0.8rem;
    text-align: start;
}
</style>