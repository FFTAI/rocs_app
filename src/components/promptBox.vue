<template>
  <div class="wrapper flex-center">
    <div class="prompt vertically-centered common-font">
      <div class="title" v-if="prompt == 'returnMain'">
        {{ $t("tip") }}
      </div>
      <div class="promptContent" :style="contentStyle">
        <img
          v-if="prompt != 'returnMain'"
          class="warningIcon"
          src="@/assets/images/warning1.png"
        />
        <div class="promptTxt" :style="txtStyle">
          <span v-if="prompt == 'closeSh'">{{ $t("closeShPrompt") }}</span>
          <span v-else-if="prompt == 'reconnect'">{{
            $t("reconnectPrompt")
          }}</span>
          <span v-else-if="prompt == 'returnMain'">{{ $t("returnMain") }}</span>
          <span v-else-if="prompt == 'calibration'">{{
            $t("calibrationTips")
          }}</span>
        </div>
      </div>
      <div v-if="prompt != 'reconnect'" class="btnBox flex-between">
        <div class="btn blue" @click="cancel()">{{ $t("cancel") }}</div>
        <div class="btn white01-bkg" @click="confirm()">
          {{ $t("confirm") }}
        </div>
      </div>
      <div v-else class="btnBox flex-between" style="left: 11.7083vw">
        <div class="btn blue" @click="reconnect()">{{ $t("reconnect") }}</div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "promptBox",
  props: {
    prompt: {
      type: String,
      default: "",
    },
  },
  computed: {
    contentStyle() {
      let style = { left: "9.5417vw" };
      if (this.prompt == "returnMain") style.left = "13.9167vw";
      if (this.prompt == "calibration") style.left = "5.1667vw";
      return style;
    },
    txtStyle() {
      let style = { width: "10.2083vw " };
      if (this.prompt == "calibration") style.width = "16vw";
      return style;
    },
  },
  data() {
    return {};
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
    reconnect() {
      let main = plus.android.runtimeMainActivity();
      let Intent = plus.android.importClass("android.content.Intent");
      let mIntent = new Intent("android.settings.WIFI_SETTINGS");
      main.startActivity(mIntent);
    },
  },
};
</script>

<style lang="scss" scoped>
.prompt {
  z-index: 999;
  width: 35.7083vw;
  height: 20.9167vw;
  background-image: url("../assets/images/image_card.png");
  background-repeat: no-repeat;
  background-size: cover;
  font-size: $size-41;
  color: $white;
}

.title {
  position: absolute;
  top: 1.7917vw;
  left: 15.875vw;
}

.promptContent {
  display: flex;
  position: absolute;
  bottom: 11.2083vw;

  .promptTxt {
    font-size: $size-35;
    display: inline-block;
  }
}

.warningIcon {
  width: 4.9167vw;
  height: 4.5417vw;
  margin-right: $size-35;
}

.btnBox {
  width: 27.125vw;
  font-size: 1.7083vw;
  position: absolute;
  left: 4.2917vw;
  bottom: 2.7083vw;
}

.btn {
  width: 12.3333vw;
  height: 4.1667vw;
  border-radius: 2.2083vw;
  line-height: 4.1667vw;
  text-align: center;
}

.blue {
  background: $base-bkg;
}
</style>
