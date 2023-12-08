<template>
  <div class="black-bkg">
    <rtc-header :isSetting="true" @connect="toConnect()">
      <div class="headState">
        <span class="headTxt common-font">{{ $t("systemSettings") }}</span>
      </div>
    </rtc-header>
    <!-- 左侧Tab标签栏 -->
    <div class="tabBox">
      <!-- 连接 -->
      <div
        class="txt"
        :class="{ activeTab: isActivated == 'connect' }"
        @click="changeTab('connect')"
      >
        <div class="tab common-font" :class="{ opt: isActivated != 'connect' }">
          <img class="iconConnect" src="@/assets/images/icon_connect.png" />
          <div style="margin-left: 1.25vw">
            {{ $t("connect") }}
          </div>
        </div>
      </div>
      <!-- 设备设置 -->
      <!-- <div class="txt" :class="{ 'activeTab': isActivated == 'deviceSettings' }" style="top: 47%;"
                @click="changeTab('deviceSettings')">
                <div class="tab common-font" :class="{ 'opt': isActivated != 'deviceSettings' }">
                    <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('deviceSettings') }}
                    </div>
                </div>
            </div> -->
      <!-- 系统信息 -->
      <div
        class="txt"
        :class="{ activeTab: isActivated == 'status' }"
        style="top: 94%"
        @click="changeTab('status')"
      >
        <div class="tab common-font" :class="{ opt: isActivated != 'status' }">
          <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
          <div style="margin-left: 1.25vw">
            {{ $t("systemInfo") }}
          </div>
        </div>
      </div>
    </div>
    <!-- 连接标签页 -->
    <div class="listBox" v-if="isActivated == 'connect'">
      <div class="item flex-between common-font">
        <span>{{ $t("connectionStatus") }}</span>
        <span>{{ $t("connected") }}</span>
      </div>
      <!-- <div class="item" v-if="!connected" @click="toConnect()">
                <span>{{ $t('connectionStatus') }}</span>
                <span class="itemTxt">{{ $t('notConnected') }}</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div> -->
      <div class="item flex-between common-font" v-if="connected">
        <span>{{ $t("robotIP") }}</span>
        <span>192.168.12.1</span>
      </div>
      <div class="item flex-between common-font" v-if="connected">
        <span>{{ $t("wifiName") }}</span>
        <span>gr1********</span>
      </div>
      <div class="item flex-between common-font" v-if="connected">
        <span>{{ $t("wifiPwd") }}</span>
        <span>66668888</span>
      </div>
    </div>
    <!-- 设备设置标签页 -->
    <!-- <div class="listBox" v-if="isActivated == 'deviceSettings'">
            <div class="item flex-between common-font">
                <span>{{ $t('defaultNickname') }}</span>
                <span>小傅小傅</span>
            </div>
            <div class="item flex-between common-font">
                <span>{{ $t('customNickname') }}</span>
                <span class="itemTxt">小傅小傅</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
            <div class="item flex-between common-font">
                <span>{{ $t('volumeAdjustment') }}</span>
                <div style="display: flex;align-items: center;justify-content: space-between;">
                    <el-slider class="splider" v-model="volume"></el-slider>
                    <span style="font-size: 1.4583vw;">{{ volume }}</span>
                </div>
            </div>
            <div class="item flex-between common-font" :class="{ 'expandLabel': microphoneOpen }">
                <span>{{ $t('microphone') }}</span>
                <div class="switch" :class="{ 'isChecked': microphoneOpen }" @click="openMicrophone()">
                    <span class="switchCore"></span>
                </div>
            </div>
            <div class="item flex-between common-font" style="border-radius: 0 0 .25vw .25vw;" v-if="microphoneOpen">
                <span>{{ $t('speechRecognition') }}</span>
                <div class="switch" :class="{ 'isChecked': speechOpen }" @click="openSpeech()">
                    <span class="switchCore"></span>
                </div>
            </div>
            <div class="item flex-between common-font" :class="{ 'expandLabel': selfCheckActivated }" @click="selfCheckExpand()">
                <span>{{ $t('selfCheck') }}</span>
                <span class="itemTxt">{{ $t('normal') }}</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
            <div class="item flex-between common-font scItem" v-if="selfCheckActivated">
                <div class="scChild">
                    <span>{{ $t('visionCamera') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('controlModule') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('actuator') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('battery') }}</span>
                    <span style="color: #DC4253;">{{ $t('anomaly') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('screen') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
            </div>
            <div class="powerBtn flex-center common-font">
                <div>
                    {{ $t('powerOff') }}
                </div>
            </div>
        </div> -->
    <!-- 系统信息标签页 -->
    <div class="listBox" v-if="isActivated == 'status'">
      <div class="item flex-between common-font">
        <span>{{ $t("productModel") }}</span>
        <span>GR-1</span>
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("serialNumber") }}</span>
        <span>GR123OT0001</span>
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("robotVersion") }}</span>
        <span>V1.0.0</span>
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("appVersion") }}</span>
        <span>V1.1.42</span>
      </div>
      <div
        class="item flex-between common-font"
        :class="{ expandLabel: languageActivated }"
        @click="languageExpand()"
      >
        <span>{{ $t("appLanguage") }}</span>
        <span class="itemTxt" v-if="currLanguage == 'zh'">简体中文</span>
        <span class="itemTxt" v-if="currLanguage == 'tw'">繁體中文</span>
        <span class="itemTxt" v-if="currLanguage == 'en'">English</span>
        <img class="iconTo" src="@/assets/images/icon_to.png" />
      </div>
      <!-- 多语言选择 -->
      <div
        class="item flex-between common-font"
        style="border-radius: 0 0 0.25vw 0.25vw"
        v-if="languageActivated"
      >
        <div
          class="languageItem white01-bkg"
          :class="{ chosedLanguage: currLanguage == 'zh' }"
          @click="changeLanguage('zh')"
        >
          <span>简体中文</span>
          <img
            class="iconChose"
            :class="{ visibility: currLanguage != 'zh' }"
            src="@/assets/images/icon_chose.png"
          />
        </div>
        <div
          class="languageItem white01-bkg"
          :class="{ chosedLanguage: currLanguage == 'tw' }"
          @click="changeLanguage('tw')"
        >
          <span>繁體中文</span>
          <img
            class="iconChose"
            :class="{ visibility: currLanguage != 'tw' }"
            src="@/assets/images/icon_chose.png"
          />
        </div>
        <div
          class="languageItem white01-bkg"
          :class="{ chosedLanguage: currLanguage == 'en' }"
          @click="changeLanguage('en')"
        >
          <span>English</span>
          <img
            class="iconChose"
            :class="{ visibility: currLanguage != 'en' }"
            src="@/assets/images/icon_chose.png"
          />
        </div>
      </div>
      <!-- 是否开启日志 -->
      <div class="item flex-between common-font">
        <span>{{ $t("logRecording") }}</span>
        <div class="switch" :class="{ isChecked: logOpen }" @click="openLog">
          <span class="switchCore"></span>
        </div>
      </div>
    </div>
    <prompt-box
      :prompt="'reconnect'"
      v-if="!connected"
      @reconnect="reconnect"
    ></prompt-box>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import promptBox from "@/components/promptBox.vue";
import { mapState } from "vuex";
import Heartbeat from "@/mixin/Heartbeat";
export default {
  mixins: [Heartbeat],
  components: { rtcHeader, promptBox },
  computed: {
    ...mapState(["connected"]),
  },
  data() {
    return {
      isActivated: "connect", //当前活动Tab
      logOpen: true,
      nickname: false,
      microphone: false,
      speech: false,
      currLanguage: "zh",
      languageActivated: false,
      volume: 70,
      microphoneOpen: true,
      speechOpen: false,
      selfCheckActivated: false,
    };
  },
  mounted() {
    this.currLanguage = localStorage.getItem("lang");
  },
  methods: {
    changeTab(e) {
      this.isActivated = e;
    },
    languageExpand() {
      this.languageActivated = !this.languageActivated;
    },
    changeLanguage(e) {
      this.currLanguage = e;
      this.$i18n.locale = e;
      localStorage.setItem("lang", e);
      this.languageActivated = false;
    },
    toConnect() {
      this.$router.push({
        name: "robotStartup",
      });
    },
    openLog() {
      this.logOpen = !this.logOpen;
    },
    openMicrophone() {
      this.microphoneOpen = !this.microphoneOpen;
    },
    openSpeech() {
      this.speechOpen = !this.speechOpen;
    },
    selfCheckExpand() {
      this.selfCheckActivated = !this.selfCheckActivated;
    },
    reconnect() {},
  },
};
</script>

<style lang="scss" scoped>

.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;

  .headTxt {
    font-size: $size-47;
    color: $white;
    line-height: 2.7083vw;
  }
}

.tabBox {
  position: absolute;
  left: 0;
  top: 6.9167vw;
  width: 23.4167vw;
  height: 17.0833vw;

  .tab {
    position: absolute;
    left: 20%;
    width: 23.4167vw;
    height: 6.1667vw;
    font-size: 1.8333vw;
    color: $white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .txt {
    width: 23.3854vw;
    height: 6.1458vw;
    margin-bottom: 1.9167vw;
  }

  .activeTab {
    background: linear-gradient(
      274deg,
      rgba(26, 25, 25, 0.4) 0%,
      rgba(0, 76, 129, 0.4) 100%
    );
  }

  .activeTab::after {
    position: absolute;
    content: " ";
    left: 0;
    border-width: 6.1vw 3.3021vw 2.3021vw 0;
    border-style: solid;
    border-color: $light-blue transparent transparent transparent;
  }

  .iconConnect {
    width: 1.5625vw;
    height: 1.5625vw;
  }

  .iconSysState {
    width: 1.4063vw;
    height: 1.5625vw;
  }

  .opt {
    opacity: 0.3;
  }
}

.listBox {
  position: absolute;
  right: 3.625vw;
  top: 6.2917vw;
  width: 65.2083vw;
  height: 38vw;
  overflow-y: auto;

  .item {
    width: 55.625vw;
    height: 7.375vw;
    background-color: rgba(255, 255, 255, 0.08);
    margin-bottom: 1.25vw;
    padding: 0 3.5vw 0 2.4583vw;
    font-size: $size-41;
    align-items: center;
    border-radius: 0.25vw;
    color: $white;
  }

  .expandLabel {
    margin-bottom: 0;
    border-radius: 0.25vw 0.25vw 0 0;
  }

  .iconTo {
    position: absolute;
    right: 5.4167vw;
    width: 0.625vw;
    height: 1.1979vw;
  }

  .itemTxt {
    color: $light-blue;
  }

  .languageItem {
    width: 17.2396vw;
    height: 4.1667vw;
    border-radius: 0.2604vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .chosedLanguage {
    background: rgba(68, 216, 251, 0.1);
    border: 0.1042vw solid $light-blue;
  }

  .iconChose {
    width: 1.25vw;
    height: 1.25vw;
  }

  .visibility {
    visibility: hidden;
  }

  .splider {
    width: 24.625vw;
    font-size: initial;
    display: inline-block;
    margin-right: 1.25vw;
    position: absolute;
    right: 9vw;
  }

  .powerBtn {
    width: 34.5vw;
    height: 4.1667vw;
    background: $base-bkg;
    border-radius: 2.0833vw;
    font-size: $size-41;
    color: $white;
    margin-left: 14.8333vw;
    margin-top: 2.4583vw;
  }

  .scItem {
    height: 25.3333vw;
    flex-direction: column;
    justify-content: space-around;
    align-items: normal;
    border-radius: 0 0 0.25vw 0.25vw;
    .scChild {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
}

.listBox::-webkit-scrollbar {
  width: 0.25vw;
}

.listBox::-webkit-scrollbar-track {
  background-color: rgba(81, 82, 85, 0.2);
}

.listBox::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.125vw;
}

.listBox::-webkit-scrollbar-corner {
  background-color: transparent;
}

.switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 0.5833vw;
  line-height: 0.8333vw;
  height: 2.7083vw;
  vertical-align: middle;

  .switchCore {
    margin: 0;
    position: relative;
    width: 5.1667vw;
    height: 2.7083vw;
    border: 0.0417vw solid #dcdfe6;
    outline: 0;
    border-radius: 1.5vw;
    box-sizing: border-box;
    background: #dcdfe6;
    transition: border-color 0.3s, background-color 0.3s;
    vertical-align: middle;
  }

  .switchCore::after {
    content: "";
    position: absolute;
    top: 0.2083vw;
    left: 0.0417vw;
    border-radius: 100%;
    transition: all 0.3s;
    width: 2.1667vw;
    height: 2.1667vw;
    background-color: #fff;
  }
}

.switch.isChecked .switchCore {
  border-color: $light-blue;
  background-color: $light-blue;
}

.switch.isChecked .switchCore::after {
  left: 100%;
  margin-left: -2.1667vw;
}

.el-slider__button {
  width: 1.3333vw;
  height: 1.3333vw;
}
</style>
