import { get_robot_type } from "rocs-client";
export default {
  data() {
    return {
      intervalId: null,
    };
  },
  created() {
    // 在组件创建时开始心跳检测
    this.startHeartbeat();
  },
  destroyed() {
    // 在组件销毁时停止心跳检测
    this.stopHeartbeat();
  },
  methods: {
    startHeartbeat() {
      this.heartbeatCheck();
      // 定时器检测连接状态
      this.intervalId = setInterval(() => {
        // 执行心跳检测的逻辑
        this.heartbeatCheck();
      }, 5000);
    },
    stopHeartbeat() {
      // 停止心跳检测
      clearInterval(this.intervalId);
    },
    heartbeatCheck() {
      let ip = process.env.VUE_APP_URL.split("//")[1].split(":");
      get_robot_type({ host: ip[0], port: ip[1] })
        .then((res) => {
          console.log("gettype成功", res);
          if (res.status == 200 && res.data.msg == "ok")
            this.$store.commit("setConnected", true);
        })
        .catch((err) => {
          this.$store.commit("setConnected", false);
          console.log("gettype失败", err);
        });
    },
  },
};
