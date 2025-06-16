<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    :multi-line="options.multiLine"
    :vertical="options.vertical"
    :top="options.top"
    :bottom="options.bottom"
    :left="options.left"
    :right="options.right"
    :centered="options.centered"
    @input="onInput"
  >
    <v-icon left>{{ icon }}</v-icon>
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="hideSnackbar"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const snackbarModule = namespace("snackbar");

@Component
export default class GlobalSnackbar extends Vue {
  @snackbarModule.Getter("isVisible")
  isVisible!: boolean;

  @snackbarModule.Getter("message")
  message!: string;

  @snackbarModule.Getter("icon")
  icon!: string;

  @snackbarModule.Getter("color")
  color!: string;

  @snackbarModule.Getter("timeout")
  timeout!: number;

  @snackbarModule.Getter("options")
  options!: {
    multiLine: boolean;
    vertical: boolean;
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    centered: boolean;
  };

  @snackbarModule.Action("hideSnackbar")
  hideSnackbar!: () => void;

  get show(): boolean {
    return this.isVisible;
  }

  set show(value: boolean) {
    if (!value) {
      this.hideSnackbar();
    }
  }

  onInput(value: boolean) {
    if (!value) {
      this.hideSnackbar();
    }
  }
}
</script>
