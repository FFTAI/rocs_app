<template>
  <div>
    <div class="container">
      <div ref="videoContainer" align="center" class="video-container">
        <div class="video-item common-bkg">
          <img class="video-play" :src="videoSrc" v-show="camera" />
        </div>
      </div>
      <div class="videoBox">
        <rtc-header
          :currentSpeed="current_speed"
          :isController="true"
          :camera="true"
          @cameraOn="openCamera()"
          @returnMain="promptBoxOpen('returnMain')"
        >
          <div class="headState" @click="headChange()">
            <span class="headTxt common-font">{{ $t("remoteMode") }}</span>
            <div class="arrow"></div>
          </div>
        </rtc-header>
        <div class="headBox flex-column" v-if="headBoxVisible" ref="headBoxRef">
          <div @click="changeMode('remoteMode')">
            {{ $t("remoteMode") }}
          </div>
          <div class="divider"></div>
          <div @click="changeMode('developerMode')">
            {{ $t("developerMode") }}
          </div>
        </div>
        <!-- Stop按钮 -->
        <!-- <div class="stopControl">
          <img class="stopImg" src="@/assets/images/icon_chStop.png" @click="stop()" />
        </div> -->
        <!--初始-->
        <div class="calibration">
          <img
            class="calibrationImg"
            src="@/assets/images/icon_calibration.png"
            @click="calibration()"
          />
        </div>
        <!-- 速度挡位调节 -->
        <div class="speedBox">
          <div class="speedControl">
            <div class="speedDirection flex-column">
              <img
                class="speedAdd"
                @click="speedChange('add')"
                src="@/assets/images/btn_add.png"
              />
              <span class="speedNum title-font">{{ speed }}</span>
              <img
                class="speedReduce"
                @click="speedChange('reduce')"
                src="@/assets/images/btn_reduce.png"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 虚拟摇杆 joystick-start-->
      <div class="joystickBorder flex-center" style="left: 11.0833vw">
        <img class="joystickImg" src="@/assets/images/image_direction.png" />
      </div>
      <div class="joystickBorder flex-center" style="right: 11.0833vw">
        <img class="joystickImg" src="@/assets/images/image_direction.png" />
      </div>
      <div id="zone_joystickL"></div>
      <div id="zone_joystickR"></div>
      <!-- joystick-end -->
      <div
        :class="controlExpand ? 'controlActivated' : 'controlStatus'"
        ref="controlRef"
      >
        <!-- 步态运动展开 -->
        <div class="actionBox" v-if="controlExpand && controlModel == 'gait'">
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_markingTime.png"
              @click="choseMode('markingTime')"
            />
            <div>{{ $t("markingTime") }}</div>
          </div>
        </div>
        <!-- 原地运动展开 -->
        <div
          class="actionBox"
          v-else-if="controlExpand && controlModel == 'inPlace'"
        >
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_zero.png"
              @click="choseMode('zero')"
            />
            <div>{{ $t("zero") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_waveLeft.png"
              @click="choseMode('waveLeftHand')"
            />
            <div>{{ $t("waveLeftHand") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_swingArms.png"
              @click="choseMode('swingArms')"
            />
            <div>{{ $t("swingArms") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_greet.png"
              @click="choseMode('greet')"
            />
            <div>{{ $t("greet") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_nod.png"
              @click="choseMode('nod')"
            />
            <div>{{ $t("nod") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_shake.png"
              @click="choseMode('shake')"
            />
            <div>{{ $t("shake") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_twist.png"
              @click="choseMode('twist')"
            />
            <div>{{ $t("twist") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_squat.png"
              @click="choseMode('squat')"
            />
            <div>{{ $t("squat") }}</div>
          </div>
        </div>
        <div
          class="actionBox"
          v-else-if="controlExpand && controlModel == 'endGrasping'"
        >
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_open.png"
              @click="choseMode('openHand')"
            />
            <div>{{ $t("openHand") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_grasp.png"
              @click="choseMode('grasp')"
            />
            <div>{{ $t("grasp") }}</div>
          </div>
          <div class="actionItem">
            <img
              class="actionImg"
              src="@/assets/images/icon_tremble.png"
              @click="choseMode('tremble')"
            />
            <div>{{ $t("tremble") }}</div>
          </div>
        </div>
        <!-- action box -->
        <div class="controlBox flex-between">
          <!-- 站立 -->
          <div
            :class="['choseBox', 'txt', controlModel == 'stand' ? 'chose' : '']"
            @click="changeControl('stand')"
          >
            {{ $t("stand") }}
          </div>
          <!-- 步态运动 -->
          <div
            :class="[
              'choseBox',
              'txt',
              controlModel != 'gait' ? '' : controlExpand ? 'choseBk' : 'chose',
            ]"
            @click="changeControl('gait')"
          >
            {{ $t("gaitMotion") }}
          </div>
          <!-- 原地运动 -->
          <div
            :class="[
              'choseBox',
              'txt',
              controlModel != 'inPlace'
                ? ''
                : controlExpand
                ? 'choseBk'
                : 'chose',
            ]"
            @click="changeControl('inPlace')"
          >
            {{ $t("inPlaceMotion") }}
          </div>
          <!-- 末端抓取 -->
          <div
            :class="[
              'choseBox',
              'txt',
              controlModel != 'endGrasping'
                ? ''
                : controlExpand
                ? 'choseBk'
                : 'chose',
            ]"
            @click="changeControl('endGrasping')"
          >
            {{ $t("endGrasping") }}
          </div>
        </div>
      </div>
      <!-- 当前状态提示 -->
      <div
        class="stateMessage flex-center"
        v-if="(mode != '' && doAction) || mode == 'initial'"
      >
        <span>{{ $t(mode) }}{{ $t("ing") }}...</span>
      </div>
      <prompt-box
        v-if="promptVisible || !connected"
        :prompt="connected ? promptVal : 'reconnect'"
        @cancel="cancel()"
        @confirm="confirm()"
      ></prompt-box>
    </div>
  </div>
</template>
<script>
import nipplejs from "nipplejs";
import RtcHeader from "@/components/rtcHeader.vue";
import rtcLeftControl from "@/components/rtcLeftControl.vue";
import promptBox from "@/components/promptBox.vue";
import { mapState } from "vuex";
import Heartbeat from "@/mixin/Heartbeat";
export default {
  mixins: [Heartbeat],
  components: { RtcHeader, rtcLeftControl, promptBox },
  computed: {
    ...mapState(["gamepadConnected", "connected"]),
  },
  data() {
    return {
      videoContainer: "", //视频
      buttons: "", //当前按键
      joystickL: undefined, //左侧虚拟摇杆
      joystickR: undefined, //右侧虚拟摇杆
      screenWidth: document.body.clientWidth, //当前屏幕宽度
      speed: 1, //当前速度档位 1-3
      current_speed: 0, //当前速度，默认0
      videoSrc: "", //摄像头视频路径
      controlModel: "", //当前运动 gait:步态 inPlace:原地 endGrasping:末端抓取
      controlExpand: false, //运动选择栏展开
      mode: "", //当前运动模式
      headBoxVisible: false, //模式选择框显隐
      camera: true, //是否开启视频
      doAction: false,
      isStand: false,
      isWalking: false,
      velocity: 0,
      direction: 0,
      interval: null,
      intervalCount: 0,
      promptVisible: false,
      promptVal: "",
      lastMessageReceivedTime: Date.now(),
      wsInterval: null,
    };
  },
  created() {
    document.addEventListener(
      "click",
      (e) => {
        let controlRef = this.$refs.controlRef;
        if (controlRef && !controlRef.contains(e.target)) {
          this.controlExpand = false;
        }
      },
      true
    );
  },
  async mounted() {
    this.videoContainer = this.$refs.videoContainer;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    this.cameraOpen();
    this.startJoystickL(); //生成虚拟摇杆
    this.startJoystickR();
    this.startGamepad();
    this.createWsInterval();
    this.$nextTick(() => {
      this.robotWs.robot.enable_debug_state(2);
    });
    this.$bus.$on("robotOnmessage", (data) => {
      this.lastMessageReceivedTime = Date.now();
      console.log("controller===========", data);
      if (data.data) this.doAction = data.data.upper_action;
    });
  },
  destroyed() {
    clearInterval(this.interval);
    clearInterval(this.wsInterval);
    //关闭监听
    this.robotWs.robot.disable_debug_state();
    this.$bus.$off("robotOnmessage");
  },
  watch: {
    //屏幕尺寸变化后，重新生成joystick适配当前尺寸
    screenWidth: function (n, o) {
      if (this.joystickL) {
        this.joystickL.destroy();
        this.startJoystickL();
      }
      if (this.joystickR) {
        this.joystickR.destroy();
        this.startJoystickR();
      }
    },
  },
  methods: {
    //创建定时器监听websocket是否断连
    createWsInterval() {
      if (!this.wsInterval) {
        this.wsInterval = setInterval(() => {
          const currentTime = Date.now();
          const timeSinceLastMessage =
            currentTime - this.lastMessageReceivedTime;
          // 如果超过了阈值3秒，认为连接断开
          const threshold = 3000;
          console.log("sadahusfdh.............", timeSinceLastMessage);
          if (timeSinceLastMessage > threshold) {
            console.log("WebSocket connection might be disconnected.");
            this.robotWs.robot.enable_debug_state(2);
            clearInterval(this.wsInterval);
          }
        }, 1000); // 每秒检查一次
      }
    },
    // 启动手柄
    startGamepad() {
      const _this = this;
      // 每10ms 获取一次手柄数据，查看是否按下手柄按键
      this.interval = setInterval(function () {
        if (_this.gamepadConnected) {
          _this.intervalCount++;
          let gamepad = null;
          gamepad = navigator.getGamepads()[0]
            ? navigator.getGamepads()[0]
            : navigator.getGamepads()[1]
            ? navigator.getGamepads()[1]
            : navigator.getGamepads()[2]
            ? navigator.getGamepads()[2]
            : navigator.getGamepads()[3];
          // console.log(navigator.getGamepads(), gamepad)
          if (_this.intervalCount >= 10) {
            // navigator.getGamepads()[0].axes[0],navigator.getGamepads()[0].axes[1],navigator.getGamepads()[0].axes[2],navigator.getGamepads()[0].axes[3]
            _this.pressKey(gamepad.buttons);
            _this.remoteSensing(gamepad.axes);
            _this.intervalCount = 0;
          }

          let size = (_this.screenWidth * 100) / 1440;
          _this.joystickL[0].setPosition(1, {
            x: gamepad.axes.slice(0, 2)[0] * size,
            y: gamepad.axes.slice(0, 2)[1] * size,
          });
          _this.joystickR[0].setPosition(1, {
            x: gamepad.axes.slice(2, 4)[0] * size,
            y: gamepad.axes.slice(2, 4)[1] * size,
          });
        }
      }, 1);
    },
    /**
     * 手柄遥感 --- 圆心方案整改（新）
     */
    remoteSensing(arr) {
      // let velocity = arr[1];
      // let direction = arr[0];
      // //圆的半径设为前后速度
      // let v = Math.hypot(Math.abs(velocity), Math.abs(direction));
      // if (v > 1) v = 1;
      // if (velocity < 0) v = v * -1;
      // //计算正弦值，根据反正弦算出角度
      // let sin = direction / Math.abs(v);
      // let angle = (Math.asin(sin) * 180) / Math.PI;
      // //设定低值死区
      // if (Math.abs(velocity) < 0.1) v = 0;
      // if (Math.abs(direction) < 0.1) angle = 0;
      // if (Math.abs(velocity) < 0.1) {
      //   velocity = 0;
      // }
      // this.operateWalk(angle * -0.5, (velocity * this.speed) / -6.25);
      if (!this.isStand && this.isWalking) {
        this.velocity = arr[1];
        console.log(arr[1], arr[2]);
        if (Math.abs(this.velocity) < 0.1) this.velocity = 0;
        this.direction = arr[2];
        if (Math.abs(this.direction) < 0.1) this.direction = 0;
        this.operateWalk(
          this.direction * -45,
          (this.velocity * this.speed) / -6.25
        );
      } else if (this.isStand && !this.isWalking) {
        let pitch = arr[1] * -17.1887;
        let rotate_waist = arr[0] * -14.32;
        if (Math.abs(pitch) < 1.71887) pitch = 0;
        if (Math.abs(rotate_waist) < 1.432) rotate_waist = 0;
        let squat = arr[3] * -0.15;
        let yaw = arr[2] * 60;
        if (squat > -0.015) squat = 0;
        if (Math.abs(yaw) < 6) yaw = 0;
        this.operateHead(pitch, yaw);
        this.operateBody(squat, rotate_waist);
      }
    },
    // 手柄按键
    pressKey(arr) {
      let stopL = false;
      let stopR = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === 1) {
          if (!this.speedTime) {
            if (i === 4) {
              this.buttons = "左手1";
              if (this.speed > 1) this.speed -= 1;
            }
            if (i === 5) {
              this.buttons = "右手1";
              if (this.speed < 3) this.speed += 1;
            }
            this.speedTime = setTimeout(() => {
              this.speedTime = null;
            }, 500);
          }
          if (i === 6) {
            this.buttons = "左手2";
            stopL = true;
          }
          if (i === 7) {
            this.buttons = "右手2";
            stopR = true;
          }
        }
      }
      if (stopL && stopR) this.stop();
    },
    //开启左侧虚拟触控摇杆
    startJoystickL() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 14.8 * 0.01);
      _this.joystickL = nipplejs.create({
        zone: document.getElementById("zone_joystickL"),
        mode: "static",
        position: { left: "20%", top: "70%" },
        color: "white",
        size: sWidth,
      });
      _this.joystickL
        .on("start", function (evt, data) {
          if (!_this.gamepadConnected) {
            _this.time = setInterval(() => {
              _this.onStart && _this.onStart(_this.distance, _this.angle);
            }, 5);
          }
        })
        .on("move", function (evt, data) {
          if (!_this.gamepadConnected) {
            if (!_this.isStand && _this.isWalking) {
              _this.velocity = data.vector.y;
              if (Math.abs(_this.velocity) < 0.1) _this.velocity = 0;
              _this.operateWalk(
                _this.direction * -45,
                (_this.velocity * _this.speed) / 6.25
              );
            } else if (_this.isStand && !_this.isWalking) {
              let pitch = data.vector.y * 17.1887;
              let rotate_waist = data.vector.x * -14.32;
              if (Math.abs(pitch) < 1.71887) pitch = 0;
              if (Math.abs(rotate_waist) < 1.432) rotate_waist = 0;
              console.log(pitch, rotate_waist);
              _this.operateHead(pitch, 0);
              _this.operateBody(0, rotate_waist);
            }
          }
        })
        .on("end", function (evt, data) {
          if (!_this.gamepadConnected) {
            //摇杆回原点后速度方向归零
            if (!_this.isStand && _this.isWalking) {
              _this.operateWalk(0, 0);
            } else if (_this.isStand && !_this.isWalking) {
              _this.operateHead(0, 0);
              _this.operateBody(0, 0);
            }
            clearInterval(_this.time);
            _this.onEnd && _this.onEnd();
          }
        });
    },
    //开启右侧虚拟触控摇杆
    startJoystickR() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 14.8 * 0.01);
      _this.joystickR = nipplejs.create({
        zone: document.getElementById("zone_joystickR"),
        mode: "static",
        position: { right: "20%", top: "70%" },
        color: "white",
        size: sWidth,
      });
      _this.joystickR
        .on("start", function (evt, data) {})
        .on("move", function (evt, data) {
          if (!_this.gamepadConnected) {
            if (_this.isStand && !_this.isWalking) {
              let squat = data.vector.y * 0.15;
              let yaw = data.vector.x * 60;
              if (squat > -0.015) squat = 0;
              if (Math.abs(yaw) < 6) yaw = 0;
              _this.operateHead(0, yaw);
              _this.operateBody(squat, 0);
            } else if (!_this.isStand && _this.isWalking) {
              _this.direction = data.vector.x;
              if (Math.abs(_this.direction) < 0.1) _this.direction = 0;
              _this.operateWalk(
                _this.direction * -45,
                (_this.velocity * _this.speed) / 6.25
              );
            }
          }
        })
        .on("end", function (evt, data) {
          if (!_this.gamepadConnected) {
            if (_this.isStand && !_this.isWalking) {
              _this.operateHead(0, 0);
              _this.operateBody(0, 0);
            } else if (!_this.isStand && _this.isWalking) {
              _this.direction = 0;
              _this.operateWalk(0, 0);
            }
          }
        });
    },
    calibration() {
      this.promptBoxOpen("calibration");
    },
    doCalibration() {
      this.isStand = false
      this.robotWs.robot.start();
      this.mode = "initial";
      setTimeout(() => {
        this.mode = "";
      }, 7000);
    },
    //紧急停止
    stop() {
      this.robotWs.robot.stop();
    },
    // 速度挡位调节
    speedChange(e) {
      if (!this.speedTime) {
        if (e == "add" && this.speed < 3) this.speed += 1;
        if (e == "reduce" && this.speed > 1) this.speed -= 1;
        this.speedTime = setTimeout(() => {
          this.speedTime = null;
        }, 500);
      }
    },
    //操控行走
    operateWalk(direction, velocity) {
      try {
        this.robotWs.robot.walk(direction, velocity);
      } catch (error) {
        console.log("Walk错误。。。。。。", error);
      }
    },
    //操控头部
    operateHead(pitch, yaw) {
      console.log("头部。。。。。", pitch, yaw);
      try {
        this.robotWs.robot.head(0, pitch, yaw);
      } catch (error) {
        console.log("Head错误。。。。。。", error);
      }
    },
    //操控身体
    operateBody(squat, rotate_waist) {
      console.log("身体。。。。。", squat, rotate_waist);
      try {
        this.robotWs.robot.body(squat, rotate_waist);
      } catch (error) {
        console.log("Body错误。。。。。。", error);
      }
    },
    //开启视频
    cameraOpen() {
      this.videoSrc = this.robotWs.robot.camera.videoStreamUrl;
    },
    //切换当前控制模式
    changeControl(e) {
      if (e == "stand") {
        this.isStand = true;
        this.robotWs.robot.stand();
        this.controlExpand = false;
      } else {
        this.controlExpand = true;
      }
      this.controlModel = e;
    },
    choseMode(e) {
      if (this.doAction == true) return;
      this.controlExpand = false;
      this.mode = e;
      //原地踏步，速度位置发0
      if (e == "markingTime") {
        this.isStand = false;
        this.isWalking = true;
        this.robotWs.robot.walk(0, 0);
      } else {
        //上肢data
        let upper_data = {
          arm_action: "",
          hand_action: "",
        };
        //下肢data
        let lower_data = {
          lower_body_mode: "",
        };
        setTimeout(() => {
          this.doAction = true;
        }, 500);
        if (e == "zero") {
          upper_data.arm_action = "RESET";
        } else if (e == "waveLeftHand") {
          upper_data.arm_action = "LEFT_ARM_WAVE";
        } else if (e == "swingArms") {
          upper_data.arm_action = "ARMS_SWING";
        } else if (e == "greet") {
          upper_data.arm_action = "HELLO";
        } else if (e == "openHand") {
          upper_data.hand_action = "OPEN";
        } else if (e == "grasp") {
          upper_data.hand_action = "GRASP";
        } else if (e == "tremble") {
          upper_data.hand_action = "TREMBLE";
        } else if (e == "twist") {
          lower_data.lower_body_mode = "ROTATE_WAIST";
        } else if (e == "squat") {
          lower_data.lower_body_mode = "SQUAT";
        } else if (e == "nod") {
          //上下点头
          this.operateHead(17, 0);
          setTimeout(() => {
            this.operateHead(-17, 0);
          }, 1000);
          setTimeout(() => {
            this.operateHead(0, 0);
          }, 3000);
        } else if (e == "shake") {
          //左右摇头
          this.operateHead(0, 17);
          setTimeout(() => {
            this.operateHead(0, -17);
          }, 1000);
          setTimeout(() => {
            this.operateHead(0, 0);
          }, 3000);
        }
        if (lower_data.lower_body_mode == "" && e != "nod" && e != "nod") {
          this.robotWs.robot
            .upper_body(upper_data.arm_action, upper_data.hand_action)
            .then((response) => {
              console.log("upper_body-response", response);
              this.doAction = false;
            })
            .catch((error) => {
              console.log("upper_body-error", error);
              this.doAction = false;
            });
        } else if (
          lower_data.lower_body_mode != "" &&
          e != "nod" &&
          e != "nod"
        ) {
          // this.robotWs.robot.lower_body(lower_data.lower_body_mode)
          this.$http
            .request({
              timeout: 30000,
              baseURL: process.env.VUE_APP_URL,
              method: "POST",
              url: "/robot/lower_body",
              data: {
                lower_body_mode: lower_data.lower_body_mode,
              },
            })
            .then((response) => {
              console.log("lower_body-response", response);
              this.doAction = false;
            })
            .catch((error) => {
              console.log("lower_body-error", error);
              this.doAction = false;
            });
        } else {
          setTimeout(() => {
            this.doAction = false;
          }, 4000);
        }
      }
    },
    headChange() {
      this.headBoxVisible = !this.headBoxVisible;
    },
    changeMode(e) {
      if (e == "remoteMode") {
        this.headBoxVisible = false;
      } else if (e == "developerMode") {
        this.$router.push({
          name: "development",
        });
      }
    },
    openCamera() {
      this.camera = !this.camera;
    },
    promptBoxOpen(e) {
      this.promptVal = e;
      this.promptVisible = !this.promptVisible;
    },
    confirm() {
      switch (this.promptVal) {
        case "calibration":
          this.doCalibration();
          break;
        case "returnMain":
          this.$router.push({
            name: "login",
          });
          break;
        default:
          break;
      }
      this.promptVisible = false;
    },
    cancel() {
      this.promptVisible = !this.promptVisible;
    },
  },
};
</script>
<style lang="scss">
.video-container {
  display: flex;
  justify-content: center;
}

.video-item {
  position: fixed;
  z-index: 3;
  background-image: url("../../assets/images/image_cameraBk.jpg");
}

.video-play {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buttons {
  display: flex;
  margin-top: 1.3889vw;
}

.videoBox {
  width: 100%;
  height: 100%;
  background-color: cadetblue;
  position: absolute;
}

.stopControl {
  position: absolute;
  right: 5vw;
  top: 8.3333vw;
  z-index: 9999;

  .stopImg {
    width: 3.9583vw;
    height: 3.9583vw;
    margin: auto;
  }
}

.calibration {
  position: absolute;
  left: 2.4583vw;
  top: 7.375vw;
  z-index: 9999;

  .calibrationImg {
    width: 4.9167vw;
    height: 4.9167vw;
    margin: auto;
  }
}

.speedBox {
  position: absolute;
  left: 1.8333vw;
  bottom: 5.25vw;
  z-index: 999;

  .speedControl {
    width: 6.1667vw;
    height: 14.7917vw;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2.9583vw;

    .speedDirection {
      width: 3.7083vw;
      height: 12.3333vw;
      background: rgba(0, 76, 129, 0.12);
      border-radius: 2.4583vw;
      position: absolute;
      left: 1.28vw;
      bottom: 1.2556vw;
      justify-content: space-around;
      align-items: center;

      .speedAdd {
        width: 1.375vw;
        height: 1.375vw;
        z-index: 1000;
      }

      .speedReduce {
        width: 1.375vw;
        height: 1.375vw;
        z-index: 1000;
      }

      .speedNum {
        font-size: 1.7188vw;
        color: $white;
      }
    }
  }
}

.joystickBorder {
  position: absolute;
  bottom: 3.7083vw;
  width: 17.875vw;
  height: 17.875vw;
  border: 3px solid rgba(255, 255, 255, 0.3);
  z-index: 999;
  border-radius: 50%;
}

.joystickImg {
  width: 11.0833vw;
  height: 11.0833vw;
  z-index: 999;
}

#zone_joystickL {
  position: absolute;
  left: 20.2625vw;
  bottom: 12.8458vw;
}

#zone_joystickR {
  position: absolute;
  right: 20.2625vw;
  bottom: 12.8458vw;
}

.controlStatus {
  position: absolute;
  left: 32.75vw;
  bottom: 3.7083vw;
  width: 31.75vw;
  height: 3.4583vw;
  border-radius: 2.7917vw;
  padding: 0.9167vw 1.25vw;
  border: 0.125vw solid rgba(255, 255, 255, 0.3);
  z-index: 999;
}

.controlActivated {
  position: absolute;
  left: 32.75vw;
  bottom: 3.7083vw;
  width: 34.25vw;
  height: 31.75vw;
  border-radius: 3.0833vw;
  border: 0.125vw solid rgba(255, 255, 255, 0.3);
  background-color: rgba(0, 75, 133, 0.5);
  z-index: 999;
}

.controlBox {
  position: absolute;
  left: 1.25vw;
  bottom: 0.9167vw;
  width: 31.75vw;
  height: 3.4583vw;
  align-items: center;

  .choseBox {
    width: 8vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chose {
    background: rgba(0, 75, 133, 0.4);
    border-radius: 2.2396vw;
  }

  .choseBk {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2.2396vw;
  }

  .txt {
    font-size: 1.4583vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: $white;
  }
}

.actionBox {
  height: 23vw;
  width: 27.775vw;
  padding: 3.125vw 3.1333vw 0 3.5917vw;
  display: flex;
  flex-wrap: wrap;
  .actionItem {
    text-align: center;
    flex-basis: 33.33%;
    font-size: 1.25vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: $white;
  }

  .actionImg {
    width: 2.7083vw;
    height: 2.7083vw;
  }
}

.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;

  .headTxt {
    font-size: 1.9792vw;
    color: $white;
  }

  .arrow {
    position: absolute;
    top: 1.2vw;
    left: 8.34vw;
    width: 0;
    height: 0;
    background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
    border-left: 0.4167vw solid transparent;
    border-right: 0.4167vw solid transparent;
    border-top: 0.5208vw solid $white;
  }
}

.headBox {
  position: absolute;
  top: 4.453123vw;
  left: 10.9375vw;
  width: 13.5417vw;
  height: 11.4334vw;
  padding: 1.4708vw 0;
  background: rgba(0, 75, 133, 0.3);
  border: 0.1042vw solid rgba(68, 216, 251, 0.3);
  z-index: 99;
  align-items: center;
  justify-content: space-around;
  font-size: $size-41;
  color: $white;

  .divider {
    height: 0.1042vw;
    width: 11.9792vw;
    background: $white;
    opacity: 0.3;
  }
}

.stateMessage {
  position: absolute;
  left: 50%;
  top: 7.5vw;
  transform: translate(-50%, -50%);
  width: 14.7917vw;
  height: 3.4583vw;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  z-index: 999;
  font-size: $size-30;
  color: $white;
}
</style>
