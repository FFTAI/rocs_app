<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Human } from "rocs-client";
import Bus from "@/utils/bus.js";
export default {
  name: "app",
  data() {
    return {
      reWs: false,
    };
  },
  created() {
    this.initRobotWs();
  },
  mounted() {
    let lang = localStorage.getItem("lang");
    if (lang == "en") {
      this.$i18n.locale = "en";
    } else if (lang == "tw") {
      this.$i18n.locale = "tw";
    } else {
      this.$i18n.locale = "zh";
      localStorage.setItem("lang", "zh");
    }
    window.addEventListener("gamepadconnected", this.gamepadcted);
    window.addEventListener("gamepaddisconnected", this.gamepaddiscted);
  },
  beforeDestroy() {
    window.removeEventListener("gamepadconnected", this.gamepadcted);
    window.removeEventListener("gamepaddisconnected", this.gamepaddiscted);
  },
  methods: {
    //初始化Robot实例
    initRobotWs() {
      var robot = new Human({
        host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
      });
      this.robotWs.setWs(robot);
      robot.on_connected(() => {
        Bus.$emit("robotOnconnected");
        this.reWs = false;
      });
      robot.on_message((data) => {
        var currData = JSON.parse(data.data);
        Bus.$emit("robotOnmessage", currData);
      });
      robot.on_close(() => {
        this.reconnectWs();
      });
      robot.on_error(() => {
        this.reconnectWs();
      });
    },
    reconnectWs() {
      if (!this.reWs) {
        setTimeout(() => {
          this.initRobotWs();
          this.reWs = true;
        }, 2000);
      }
    },
    gamepadcted() {
      this.$store.commit("setGamepadConnected", true);
    },
    gamepaddiscted() {
      this.$store.commit("setGamepadConnected", false);
    },
  },
};
</script>

<style></style>
