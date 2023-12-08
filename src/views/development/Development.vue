<template>
  <div class="black-bkg">
    <rtc-header>
      <div class="headState" @click="headChange()">
        <span class="headTxt common-font">{{ $t("developerMode") }}</span>
        <div class="arrow"></div>
      </div>
    </rtc-header>
    <!-- 模式切换 -->
    <div class="headBox" v-if="headBoxVisible" ref="headBoxRef">
      <div @click="changeMode('remoteMode')">
        {{ $t("remoteMode") }}
      </div>
      <div class="divider"></div>
      <div @click="changeMode('developerMode')">
        {{ $t("developerMode") }}
      </div>
    </div>
    <!-- 左侧栏 -->
    <div class="leftBox">
      <!-- 人形模型 -->
      <!-- <img class="humanModel flex-center" src="@/assets/images/icon_model.png" v-show="activated == 'dynamic'" /> -->
      <!-- <iframe ref="unityIfm" src="WebGL/index.html"
          style="border: none;width: 26.0417vw;height: 36.4583vw;margin-top:6.25vw;"
          v-show="activated == 'dynamic'"></iframe> -->
      <div class="humanModel flex-center" v-show="activated == 'dynamic'">
        <iframe
          ref="unityIfm"
          style="
            border: none;
            margin-top: 6vw;
            width: 26.0417vw;
            height: 32.4583vw;
          "
          :src="iframeUrl"
        ></iframe>
      </div>
      <!-- log日志 -->
      <div class="logBox" v-show="activated == 'log'">
        <div class="logTitle common-font">{{ $t("logoFile") }}</div>
        <div class="logMain">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in logList"
              :key="index"
              :type="activity.type"
              :timestamp="activity.timestamp"
              :placement="activity.placement"
            >
              <p class="logTxt common-font">{{ activity.content }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <!-- 底部切换 -->
      <div class="modelChose flex-between">
        <div
          class="modelBtn flex-center"
          :class="{ activatedModel: activated == 'dynamic' }"
          @click="changeModel('dynamic')"
        >
          <span class="btnTxt common-font">{{ $t("dynamic") }}</span>
        </div>
        <div
          class="modelBtn flex-center"
          :class="{ activatedModel: activated == 'log' }"
          style="margin-left: 0.8854vw"
          @click="changeModel('log')"
        >
          <span class="btnTxt common-font">{{ $t("logoFile") }}</span>
        </div>
      </div>
    </div>
    <div class="chartBox flex-center">
      <div class="leftSide">
        <div v-show="doubleChart" class="chartTitle common-font">
          {{ $t("left") }}{{ $t("upperBody") }}
        </div>
        <div v-show="doubleChart" class="chartTitle common-font" style="left: 18.1667vw">
          {{ $t("right") }}{{ $t("upperBody") }}
        </div>
        <div v-show="doubleChart" class="doubleChartSize" id="leftChart"></div>
        <div v-show="doubleChart" class="doubleChartSize" id="rightChart"></div>
        <div v-show="!doubleChart" class="chartTitle common-font">{{ $t("head") }}</div>
        <div
          v-show="!doubleChart"
          class="singleChartSize"
          id="singleChart"
        ></div>
      </div>
      <div class="middleDivider white01-bkg"></div>
      <div class="rightSide">
        <div class="axleVal">
          <div>
            <span class="val1">X{{ $t("axle") }}：</span>
            <span class="val2 title-font">{{ xSpeed }}m/s</span>
          </div>
          <div>
            <span class="val1">Y{{ $t("axle") }}：</span>
            <span class="val2 title-font">{{ ySpeed }}m/s</span>
          </div>
        </div>
        <div class="axleImg">
          <img src="@/assets/images/image_Dashboard.png" class="dashboard" />
          <img
            src="@/assets/images/image_point.png"
            class="pointer"
            :style="{ transform: pointerTransformX }"
          />
        </div>
        <div class="axleImg" style="right: 1.25vw">
          <img src="@/assets/images/image_Dashboard.png" class="dashboard" />
          <img
            src="@/assets/images/image_point.png"
            class="pointer"
            :style="{ transform: pointerTransformY }"
          />
        </div>
      </div>
    </div>
    <!-- 头部上肢 -->
    <div class="rightBox upper">
      <div class="rightTitle">
        <div>{{ $t("head") }}</div>
        <!-- 切换: 度,度/秒，扭矩(牛.米) -->
        <div>
          <img
            class="typeImg"
            :class="{ notAct: activatedType != 'angle' }"
            @click="changeType('angle')"
            src="@/assets/images/icon_angle.png"
          />
          <img
            class="typeImg"
            :class="{ notAct: activatedType != 'Avelocity' }"
            @click="changeType('Avelocity')"
            src="@/assets/images/icon_Avelocity.png"
          />
          <img
            class="typeImg"
            :class="{ notAct: activatedType != 'torque' }"
            @click="changeType('torque')"
            src="@/assets/images/icon_torque.png"
          />
        </div>
      </div>
      <!-- 左右侧图表 -->
      <div class="sideChart">
        <!-- Head Pitch -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
          :class="{ currentItem: activatedItem == 'headPitch' }"
          @click="changeItem('headPitch')"
        >
          <div class="itemChild">{{ $t("pitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ headPitch_qa ? headPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ headPitch_qdota ? headPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ headPitch_taua ? headPitch_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Head Yaw -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0.1)"
          :class="{ currentItem: activatedItem == 'headYaw' }"
          @click="changeItem('headYaw')"
        >
          <div class="itemChild">{{ $t("yaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ headYaw_qa ? headYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ headYaw_qdota ? headYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ headYaw_taua ? headYaw_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Head Roll -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
          :class="{ currentItem: activatedItem == 'headRoll' }"
          @click="changeItem('headRoll')"
        >
          <div class="itemChild">{{ $t("roll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ headRoll_qa ? headRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ headRoll_qdota ? headRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ headRoll_taua ? headRoll_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
      </div>
      <!-- 数值切换显示Table -->
      <div class="rightTable">
        <div
          style="height: 2.125vw; width: 100%; display: flex; color: #85888b"
        >
          <div class="itemChild" style="font-size: 1.25vw; color: #ffffff">
            {{ $t("upperBody") }}
          </div>
          <div class="itemChild">
            {{ $t("left") }}
          </div>
          <div class="itemChild">
            {{ $t("right") }}
          </div>
        </div>
        <!-- Shoulder Pitch -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'shoulderPitch' }"
          @click="changeItem('shoulderPitch')"
        >
          <div class="itemChild">{{ $t("shoulderPitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftPitchShoulder_qa ? leftPitchShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftPitchShoulder_qdota ? leftPitchShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftPitchShoulder_taua ? leftPitchShoulder_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightPitchShoulder_qa ? rightPitchShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{
              rightPitchShoulder_qdota ? rightPitchShoulder_qdota + "°/s" : ""
            }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightPitchShoulder_taua ? rightPitchShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Shoulder Yaw -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'shoulderYaw' }"
          @click="changeItem('shoulderYaw')"
        >
          <div class="itemChild">{{ $t("shoulderYaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftYawShoulder_qa ? leftYawShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftYawShoulder_qdota ? leftYawShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftYawShoulder_taua ? leftYawShoulder_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightYawShoulder_qa ? rightYawShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightYawShoulder_qdota ? rightYawShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightYawShoulder_taua ? rightYawShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Shoulder Roll -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'shoulderRoll' }"
          @click="changeItem('shoulderRoll')"
        >
          <div class="itemChild">{{ $t("shoulderRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftRollShoulder_qa ? leftRollShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftRollShoulder_qdota ? leftRollShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftRollShoulder_taua ? leftRollShoulder_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightRollShoulder_qa ? rightRollShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightRollShoulder_qdota ? rightRollShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightRollShoulder_taua ? rightRollShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Elbow -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'elbow' }"
          @click="changeItem('elbow')"
        >
          <div class="itemChild">{{ $t("elbow") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftElbow_qa ? leftElbow_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftElbow_qdota ? leftElbow_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftElbow_taua ? leftElbow_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightElbow_qa ? rightElbow_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightElbow_qdota ? rightElbow_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightElbow_taua ? rightElbow_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Pitch -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'wristPitch' }"
          @click="changeItem('wristPitch')"
        >
          <div class="itemChild">{{ $t("wristPitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftPitchWrist_qa ? leftPitchWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftPitchWrist_qdota ? leftPitchWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftPitchWrist_taua ? leftPitchWrist_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightPitchWrist_qa ? rightPitchWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightPitchWrist_qdota ? rightPitchWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightPitchWrist_taua ? rightPitchWrist_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Yaw -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'wristYaw' }"
          @click="changeItem('wristYaw')"
        >
          <div class="itemChild">{{ $t("wristYaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftYawWrist_qa ? leftYawWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftYawWrist_qdota ? leftYawWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftYawWrist_taua ? leftYawWrist_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightYawWrist_qa ? rightYawWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightYawWrist_qdota ? rightYawWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightYawWrist_taua ? rightYawWrist_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Roll -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'wristRoll' }"
          @click="changeItem('wristRoll')"
        >
          <div class="itemChild">{{ $t("wristRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftRollWrist_qa ? leftRollWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftRollWrist_qdota ? leftRollWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftRollWrist_taua ? leftRollWrist_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightRollWrist_qa ? rightRollWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightRollWrist_qdota ? rightRollWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightRollWrist_taua ? rightRollWrist_taua + "N.m" : "" }}
          </div>
        </div>
      </div>
    </div>
    <!-- 下肢数据 -->
    <div class="rightBox lower">
      <div class="rightTitle">
        <div>{{ $t("waist") }}</div>
        <div>
          <img
            class="typeImg"
            :class="{ notAct: activatedType != 'angle' }"
            @click="changeType('angle')"
            src="@/assets/images/icon_angle.png"
          />
          <img
            class="typeImg"
            :class="{ notAct: activatedType != 'Avelocity' }"
            @click="changeType('Avelocity')"
            src="@/assets/images/icon_Avelocity.png"
          />
          <img
            class="typeImg"
            :class="{ notAct: activatedType != 'torque' }"
            @click="changeType('torque')"
            src="@/assets/images/icon_torque.png"
          />
        </div>
      </div>
      <!-- 左右侧图表 -->
      <div class="sideChart">
        <!-- Waist Pitch -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
          :class="{ currentItem: activatedItem == 'waistPitch' }"
          @click="changeItem('waistPitch')"
        >
          <div class="itemChild">{{ $t("pitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ waistPitch_qa ? waistPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ waistPitch_qdota ? waistPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ waistPitch_taua ? waistPitch_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Waist Yaw -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0.1)"
          :class="{ currentItem: activatedItem == 'waistYaw' }"
          @click="changeItem('waistYaw')"
        >
          <div class="itemChild">{{ $t("yaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ waistYaw_qa ? waistYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ waistYaw_qdota ? waistYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ waistYaw_taua ? waistYaw_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Waist Roll -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
          :class="{ currentItem: activatedItem == 'waistRoll' }"
          @click="changeItem('waistRoll')"
        >
          <div class="itemChild">{{ $t("roll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ waistRoll_qa ? waistRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ waistRoll_qdota ? waistRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ waistRoll_taua ? waistRoll_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
      </div>
      <!-- 数值切换显示Table -->
      <div class="rightTable">
        <div
          style="height: 2.125vw; width: 100%; display: flex; color: #85888b"
        >
          <div class="itemChild" style="font-size: 1.25vw; color: #ffffff">
            {{ $t("lowerBody") }}
          </div>
          <div class="itemChild">
            {{ $t("left") }}
          </div>
          <div class="itemChild">
            {{ $t("right") }}
          </div>
        </div>
        <!-- Hip Pitch -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'hipPitch' }"
          @click="changeItem('hipPitch')"
        >
          <div class="itemChild">{{ $t("hipPitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftHipPitch_qa ? leftHipPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftHipPitch_qdota ? leftHipPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftHipPitch_taua ? leftHipPitch_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightHipPitch_qa ? rightHipPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightHipPitch_qdota ? rightHipPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightHipPitch_taua ? rightHipPitch_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Hip Yaw -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'hipYaw' }"
          @click="changeItem('hipYaw')"
        >
          <div class="itemChild">{{ $t("hipYaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftHipYaw_qa ? leftHipYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftHipYaw_qdota ? leftHipYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftHipYaw_taua ? leftHipYaw_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightHipYaw_qa ? rightHipYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightHipYaw_qdota ? rightHipYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightHipYaw_taua ? rightHipYaw_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Hip Roll -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'hipRoll' }"
          @click="changeItem('hipRoll')"
        >
          <div class="itemChild">{{ $t("hipRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftHipRoll_qa ? leftHipRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftHipRoll_qdota ? leftHipRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftHipRoll_taua ? leftHipRoll_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightHipRoll_qa ? rightHipRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightHipRoll_qdota ? rightHipRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightHipRoll_taua ? rightHipRoll_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Knee -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'knee' }"
          @click="changeItem('knee')"
        >
          <div class="itemChild">{{ $t("knee") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftKnee_qa ? leftKnee_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftKnee_qdota ? leftKnee_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftKnee_taua ? leftKnee_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightKnee_qa ? rightKnee_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightKnee_qdota ? rightKnee_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightKnee_taua ? rightKnee_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Ankle Pitch -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'anklePitch' }"
          @click="changeItem('anklePitch')"
        >
          <div class="itemChild">{{ $t("anklePitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftAnklePitch_qa ? leftAnklePitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftAnklePitch_qdota ? leftAnklePitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftAnklePitch_taua ? leftAnklePitch_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightAnklePitch_qa ? rightAnklePitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightAnklePitch_qdota ? rightAnklePitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightAnklePitch_taua ? rightAnklePitch_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Ankle Roll -->
        <div
          class="tableItem"
          :class="{ currentItem: activatedItem == 'ankleRoll' }"
          @click="changeItem('ankleRoll')"
        >
          <div class="itemChild">{{ $t("ankleRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftAnkleRoll_qa ? leftAnkleRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftAnkleRoll_qdota ? leftAnkleRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftAnkleRoll_taua ? leftAnkleRoll_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightAnkleRoll_qa ? rightAnkleRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightAnkleRoll_qdota ? rightAnkleRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightAnkleRoll_taua ? rightAnkleRoll_taua + "N.m" : "" }}
          </div>
        </div>
        <div class="tableItem"></div>
      </div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  components: { rtcHeader },
  computed: {
    ...mapState(["connected"]),
  },
  data() {
    return {
      activated: "dynamic", //动态展示:dynamic Log日志:log
      logList: [], //日志列表
      /**
       * 上肢部分关节数据
       * qa:弧度 qdota:弧度/秒 taua:力矩(牛.米)
       */
      //左侧
      leftPitchShoulder_qa: "",
      leftPitchShoulder_qdota: "",
      leftPitchShoulder_taua: "",
      leftRollShoulder_qa: "",
      leftRollShoulder_qdota: "",
      leftRollShoulder_taua: "",
      leftYawShoulder_qa: "",
      leftYawShoulder_qdota: "",
      leftYawShoulder_taua: "",
      leftElbow_qa: "",
      leftElbow_qdota: "",
      leftElbow_taua: "",
      leftYawWrist_qa: "",
      leftYawWrist_qdota: "",
      leftYawWrist_taua: "",
      leftRollWrist_qa: "",
      leftRollWrist_qdota: "",
      leftRollWrist_taua: "",
      leftPitchWrist_qa: "",
      leftPitchWrist_qdota: "",
      leftPitchWrist_taua: "",
      //右侧
      rightPitchShoulder_qa: "",
      rightPitchShoulder_qdota: "",
      rightPitchShoulder_taua: "",
      rightRollShoulder_qa: "",
      rightRollShoulder_qdota: "",
      rightRollShoulder_taua: "",
      rightYawShoulder_qa: "",
      rightYawShoulder_qdota: "",
      rightYawShoulder_taua: "",
      rightElbow_qa: "",
      rightElbow_qdota: "",
      rightElbow_taua: "",
      rightYawWrist_qa: "",
      rightYawWrist_qdota: "",
      rightYawWrist_taua: "",
      rightRollWrist_qa: "",
      rightRollWrist_qdota: "",
      rightRollWrist_taua: "",
      rightPitchWrist_qa: "",
      rightPitchWrist_qdota: "",
      rightPitchWrist_taua: "",
      /**
       * 下肢部分关节数据
       * qa:弧度 qdota:弧度/秒 taua:力矩(牛.米)
       */
      //左侧
      leftHipPitch_qa: "",
      leftHipPitch_qdota: "",
      leftHipPitch_taua: "",
      leftHipYaw_qa: "",
      leftHipYaw_qdota: "",
      leftHipYaw_taua: "",
      leftHipRoll_qa: "",
      leftHipRoll_qdota: "",
      leftHipRoll_taua: "",
      leftKnee_qa: "",
      leftKnee_qdota: "",
      leftKnee_taua: "",
      leftAnklePitch_qa: "",
      leftAnklePitch_qdota: "",
      leftAnklePitch_taua: "",
      leftAnkleRoll_qa: "",
      leftAnkleRoll_qdota: "",
      leftAnkleRoll_taua: "",
      //右侧
      rightHipPitch_qa: "",
      rightHipPitch_qdota: "",
      rightHipPitch_taua: "",
      rightHipYaw_qa: "",
      rightHipYaw_qdota: "",
      rightHipYaw_taua: "",
      rightHipRoll_qa: "",
      rightHipRoll_qdota: "",
      rightHipRoll_taua: "",
      rightKnee_qa: "",
      rightKnee_qdota: "",
      rightKnee_taua: "",
      rightAnklePitch_qa: "",
      rightAnklePitch_qdota: "",
      rightAnklePitch_taua: "",
      rightAnkleRoll_qa: "",
      rightAnkleRoll_qdota: "",
      rightAnkleRoll_taua: "",
      /**
       * 头部数据
       */
      headYaw_qa: "",
      headYaw_qdota: "",
      headYaw_taua: "",
      headPitch_qa: "",
      headPitch_qdota: "",
      headPitch_taua: "",
      headRoll_qa: "",
      headRoll_qdota: "",
      headRoll_taua: "",
      /**
       * 腰部数据
       */
      waistYaw_qa: "",
      waistYaw_qdota: "",
      waistYaw_taua: "",
      waistPitch_qa: "",
      waistPitch_qdota: "",
      waistPitch_taua: "",
      waistRoll_qa: "",
      waistRoll_qdota: "",
      waistRoll_taua: "",
      /**
       * 速度
       */
      xSpeed: "",
      ySpeed: "",
      leftChartData: [], //左侧图表数据
      rightChartData: [], //右侧图表数据
      singleChartData: [], //单个图表数据
      leftSpeedChartData: [], //X轴速度图表数据
      rightSpeedChartData: [], //Y轴速度图表数据
      doubleChart: true,
      activatedItem: "headPitch",
      activatedType: "angle",
      headBoxVisible: false,
      robotCount: 1,
      iframeUrl: "Build/index.html",
      pointerTransformX: "translate(-50%, -100%) rotate(0deg)",
      pointerTransformY: "translate(-50%, -100%) rotate(0deg)",
      lastMessageReceivedTime: Date.now(),
      wsInterval: null
    };
  },
  created() {
    
  },
  destroyed() {
    clearInterval(this.wsInterval);
    //关闭监听
    this.robotWs.robot.disable_debug_state();
    this.$bus.$off('robotOnmessage')
  },
  mounted() {
    // 初始化图表
    this.initSideCharts();
    this.initSpeedCharts();
    //开启状态发送
    this.$nextTick(()=>{
      this.robotWs.robot.enable_debug_state(50);
    })
    this.createWsInterval()
    this.$bus.$on('robotOnmessage',(data)=>{
      console.log('development=============',data)
      this.lastMessageReceivedTime = Date.now();
      if (data.data.log && data.data.log.logBuffer)
        this.getLog(data.data.log.logBuffer);
      if (this.robotCount == 50) {
        this.assignData(data.data.states);
        this.singleOrDouble(this.activatedItem);
        this.updateSideCharts(this.activatedItem, this.activatedType);
        this.updateSpeedCharts();
        this.robotCount = 1;
      } else {
        this.robotCount = this.robotCount + 1;
      }
    });
  },
  watch: {
    //监听当前渲染图表的切换
    activatedItem(newVal, oldVal) {
      this.singleOrDouble(newVal);
      this.updateSideCharts(newVal, this.activatedType);
    },
    activatedType(newVal, oldVal) {
      this.updateSideCharts(this.activatedItem, newVal);
    },
  },
  methods: {
    createWsInterval() {
      if (!this.wsInterval) {
        this.wsInterval = setInterval(() => {
          const currentTime = Date.now();
          const timeSinceLastMessage =
            currentTime - this.lastMessageReceivedTime;
          // 如果超过了阈值3秒，认为连接断开
          const threshold = 3000;
          if (timeSinceLastMessage > threshold) {
            console.log("WebSocket connection might be disconnected.");
            this.robotWs.robot.enable_debug_state(50);
            clearInterval(this.wsInterval);
          }
        }, 1000); // 每秒检查一次
      }
    },
    changeModel(e) {
      console.log("changeModel", e);
      this.activated = e;
    },
    initSideCharts() {
      var leftChart = echarts.init(document.getElementById("leftChart"));
      var rightChart = echarts.init(document.getElementById("rightChart"));
      var singleChart = echarts.init(document.getElementById("singleChart"));
      leftChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false,
          },
          axisLine: {
            onZero: false,
            show: false,
          },
          boundaryGap: true,
          axisTick: {
            length: 1,
            lineStyle: {
              type: "dotted",
              color: "#ffffff",
              width: 2,
              cap: "round",
            },
          },
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            name: "angle",
            data: this.leftChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 0.2,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 0.4,
                    color: "#ffffff",
                  },
                  {
                    offset: 0.6,
                    color: "#ffffff",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                ]),
              },
            },
            smooth: true,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255,255,255,0.12)",
                },
                {
                  offset: 1,
                  color: "rgb(0,76,129,0)",
                },
              ]),
              origin: "start",
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 12,
            end: 100,
            xAxisIndex: [0],
            filterMode: "none",
          },
        ],
      });
      rightChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false,
          },
          axisLine: {
            onZero: false,
            show: false,
          },
          axisTick: {
            length: 1,
            lineStyle: {
              type: "dotted",
              color: "#ffffff",
              width: 2,
              cap: "round",
            },
          },
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            name: "angle",
            data: this.rightChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 0.2,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 0.4,
                    color: "#ffffff",
                  },
                  {
                    offset: 0.6,
                    color: "#ffffff",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                ]),
              },
            },
            smooth: true,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255,255,255,0.12)",
                },
                {
                  offset: 1,
                  color: "rgb(0,76,129,0)",
                },
              ]),
              origin: "start",
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 12,
            end: 100,
            xAxisIndex: [0],
            filterMode: "none",
          },
        ],
      });
      singleChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false,
          },
          axisLine: {
            onZero: false,
            show: false,
          },
          axisTick: {
            length: 1,
            lineStyle: {
              type: "dotted",
              color: "#ffffff",
              width: 2,
              cap: "round",
            },
          },
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            name: "angle",
            data: this.singleChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 0.2,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 0.4,
                    color: "#ffffff",
                  },
                  {
                    offset: 0.6,
                    color: "#ffffff",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                ]),
              },
            },
            smooth: true,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255,255,255,0.12)",
                },
                {
                  offset: 1,
                  color: "rgb(0,76,129,0)",
                },
              ]),
              origin: "start",
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 12,
            end: 100,
            xAxisIndex: [0],
            filterMode: "none",
          },
        ],
      });
    },
    initSpeedCharts() {},
    // 格式化当前数据
    assignData(data) {
      let states = data.jointStates;
      //上肢部分
      this.leftPitchShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_shoulder").qa
      );
      this.leftPitchShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_shoulder").qdota
      );
      this.leftPitchShoulder_taua = states
        .find((obj) => obj.name === "left_pitch_shoulder")
        .taua.toFixed(2);
      this.leftRollShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_shoulder").qa
      );
      this.leftRollShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_shoulder").qdota
      );
      this.leftRollShoulder_taua = states
        .find((obj) => obj.name === "left_roll_shoulder")
        .taua.toFixed(2);
      this.leftYawShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_shoulder").qa
      );
      this.leftYawShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_shoulder").qdota
      );
      this.leftYawShoulder_taua = states
        .find((obj) => obj.name === "left_yaw_shoulder")
        .taua.toFixed(2);
      this.leftElbow_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_elbow").qa
      );
      this.leftElbow_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_elbow").qdota
      );
      this.leftElbow_taua = states
        .find((obj) => obj.name === "left_elbow")
        .taua.toFixed(2);
      this.leftYawWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_wrist").qa
      );
      this.leftYawWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_wrist").qdota
      );
      this.leftYawWrist_taua = states
        .find((obj) => obj.name === "left_yaw_wrist")
        .taua.toFixed(2);
      this.leftRollWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_wrist").qa
      );
      this.leftRollWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_wrist").qdota
      );
      this.leftRollWrist_taua = states
        .find((obj) => obj.name === "left_roll_wrist")
        .taua.toFixed(2);
      this.leftPitchWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_wrist").qa
      );
      this.leftPitchWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_wrist").qdota
      );
      this.leftPitchWrist_taua = states
        .find((obj) => obj.name === "left_pitch_wrist")
        .taua.toFixed(2);
      this.rightPitchShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_shoulder").qa
      );
      this.rightPitchShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_shoulder").qdota
      );
      this.rightPitchShoulder_taua = states
        .find((obj) => obj.name === "right_pitch_shoulder")
        .taua.toFixed(2);
      this.rightRollShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_shoulder").qa
      );
      this.rightRollShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_shoulder").qdota
      );
      this.rightRollShoulder_taua = states
        .find((obj) => obj.name === "right_roll_shoulder")
        .taua.toFixed(2);
      this.rightYawShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_shoulder").qa
      );
      this.rightYawShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_shoulder").qdota
      );
      this.rightYawShoulder_taua = states
        .find((obj) => obj.name === "right_yaw_shoulder")
        .taua.toFixed(2);
      this.rightElbow_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_elbow").qa
      );
      this.rightElbow_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_elbow").qdota
      );
      this.rightElbow_taua = states
        .find((obj) => obj.name === "right_elbow")
        .taua.toFixed(2);
      this.rightYawWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_wrist").qa
      );
      this.rightYawWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_wrist").qdota
      );
      this.rightYawWrist_taua = states
        .find((obj) => obj.name === "right_yaw_wrist")
        .taua.toFixed(2);
      this.rightRollWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_wrist").qa
      );
      this.rightRollWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_wrist").qdota
      );
      this.rightRollWrist_taua = states
        .find((obj) => obj.name === "right_roll_wrist")
        .taua.toFixed(2);
      this.rightPitchWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_wrist").qa
      );
      this.rightPitchWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_wrist").qdota
      );
      this.rightPitchWrist_taua = states
        .find((obj) => obj.name === "right_pitch_wrist")
        .taua.toFixed(2);
      //下肢部分
      this.leftHipPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_pitch").qa
      );
      this.leftHipPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_pitch").qdota
      );
      this.leftHipPitch_taua = states
        .find((obj) => obj.name === "left_hip_pitch")
        .taua.toFixed(2);
      this.leftHipYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_yaw").qa
      );
      this.leftHipYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_yaw").qdota
      );
      this.leftHipYaw_taua = states
        .find((obj) => obj.name === "left_hip_yaw")
        .taua.toFixed(2);
      this.leftHipRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_roll").qa
      );
      this.leftHipRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_roll").qdota
      );
      this.leftHipRoll_taua = states
        .find((obj) => obj.name === "left_hip_roll")
        .taua.toFixed(2);
      this.leftKnee_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_knee_pitch").qa
      );
      this.leftKnee_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_knee_pitch").qdota
      );
      this.leftKnee_taua = states
        .find((obj) => obj.name === "left_knee_pitch")
        .taua.toFixed(2);
      this.leftAnklePitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_pitch").qa
      );
      this.leftAnklePitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_pitch").qdota
      );
      this.leftAnklePitch_taua = states
        .find((obj) => obj.name === "left_ankle_pitch")
        .taua.toFixed(2);
      this.leftAnkleRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_roll").qa
      );
      this.leftAnkleRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_roll").qdota
      );
      this.leftAnkleRoll_taua = states
        .find((obj) => obj.name === "left_ankle_roll")
        .taua.toFixed(2);
      this.rightHipPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_pitch").qa
      );
      this.rightHipPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_pitch").qdota
      );
      this.rightHipPitch_taua = states
        .find((obj) => obj.name === "right_hip_pitch")
        .taua.toFixed(2);
      this.rightHipYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_yaw").qa
      );
      this.rightHipYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_yaw").qdota
      );
      this.rightHipYaw_taua = states
        .find((obj) => obj.name === "right_hip_yaw")
        .taua.toFixed(2);
      this.rightHipRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_roll").qa
      );
      this.rightHipRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_roll").qdota
      );
      this.rightHipRoll_taua = states
        .find((obj) => obj.name === "right_hip_roll")
        .taua.toFixed(2);
      this.rightKnee_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_knee_pitch").qa
      );
      this.rightKnee_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_knee_pitch").qdota
      );
      this.rightKnee_taua = states
        .find((obj) => obj.name === "right_knee_pitch")
        .taua.toFixed(2);
      this.rightAnklePitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_pitch").qa
      );
      this.rightAnklePitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_pitch").qdota
      );
      this.rightAnklePitch_taua = states
        .find((obj) => obj.name === "right_ankle_pitch")
        .taua.toFixed(2);
      this.rightAnkleRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_roll").qa
      );
      this.rightAnkleRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_roll").qdota
      );
      this.rightAnkleRoll_taua = states
        .find((obj) => obj.name === "right_ankle_roll")
        .taua.toFixed(2);
      this.headYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "head_yaw").qa
      );
      this.headYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "head_yaw").qdota
      );
      this.headYaw_taua = states
        .find((obj) => obj.name === "head_yaw")
        .taua.toFixed(2);
      this.headPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "head_pitch").qa
      );
      this.headPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "head_pitch").qdota
      );
      this.headPitch_taua = states
        .find((obj) => obj.name === "head_pitch")
        .taua.toFixed(2);
      this.headRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "head_roll").qa
      );
      this.headRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "head_roll").qdota
      );
      this.headRoll_taua = states
        .find((obj) => obj.name === "head_roll")
        .taua.toFixed(2);
      this.waistYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "waist_yaw").qa
      );
      this.waistYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "waist_yaw").qdota
      );
      this.waistYaw_taua = states
        .find((obj) => obj.name === "waist_yaw")
        .taua.toFixed(2);
      this.waistPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "waist_pitch").qa
      );
      this.waistPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "waist_pitch").qdota
      );
      this.waistPitch_taua = states
        .find((obj) => obj.name === "waist_pitch")
        .taua.toFixed(2);
      this.waistRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "waist_roll").qa
      );
      this.waistRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "waist_roll").qdota
      );
      this.waistRoll_taua = states
        .find((obj) => obj.name === "waist_roll")
        .taua.toFixed(2);
      this.xSpeed = data.basestate.vx.toFixed(2);
      this.ySpeed = data.basestate.vy.toFixed(2);
      this.updatePointer("x", this.xSpeed);
      this.updatePointer("y", this.ySpeed);
    },
    //获取log列表
    getLog(data) {
      data.forEach((element) => {
        let item = {};
        item.content = element.log;
        item.placement = "top";
        item.timestamp = this.dateFormart();
        this.logList.unshift(item);
      });
    },
    dateFormart() {
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var formattedDate =
        year + "/" + month + "/" + day + " " + hours + ":" + minutes;
      return formattedDate;
    },
    //弧度转角度
    toDegrees(e) {
      var degrees = e * (180 / Math.PI);
      return degrees.toFixed(2);
    },
    //更新两侧图表
    updateSideCharts(item, type) {
      console.log("updateSideCharts", item, type);
      if (
        !document.getElementById("leftChart") ||
        !document.getElementById("rightChart") ||
        !document.getElementById("singleChart")
      )
        return;
      if (this.doubleChart) {
        if (this.leftChartData.length > 11)
          //每超过10条数据，删除最旧的一条
          this.leftChartData.shift();
        if (this.rightChartData.length > 11) this.rightChartData.shift();
      } else {
        if (this.singleChartData.length > 11) this.singleChartData.shift();
      }
      switch (item) {
        case "hipPitch":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipPitch_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipPitch_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipPitch_qdota));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightHipPitch_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipPitch_taua));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightHipPitch_taua)
            );
          }
          break;
        case "hipYaw":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipYaw_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipYaw_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipYaw_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipYaw_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipYaw_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipYaw_taua));
          }
          break;
        case "hipRoll":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipRoll_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipRoll_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipRoll_qdota));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightHipRoll_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipRoll_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipRoll_taua));
          }
          break;
        case "knee":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftKnee_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightKnee_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftKnee_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightKnee_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftKnee_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightKnee_taua));
          }
          break;
        case "anklePitch":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnklePitch_qa));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightAnklePitch_qa)
            );
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftAnklePitch_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightAnklePitch_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftAnklePitch_taua)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightAnklePitch_taua)
            );
          }
          break;
        case "ankleRoll":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftAnkleRoll_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightAnkleRoll_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_taua));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightAnkleRoll_taua)
            );
          }
          break;
        case "shoulderPitch":
          if (type == "angle") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftPitchShoulder_qa)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightPitchShoulder_qa)
            );
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftPitchShoulder_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightPitchShoulder_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftPitchShoulder_taua)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightPitchShoulder_taua)
            );
          }
          break;
        case "shoulderYaw":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftYawShoulder_qa));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightYawShoulder_qa)
            );
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftYawShoulder_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightYawShoulder_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftYawShoulder_taua)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightYawShoulder_taua)
            );
          }
          break;
        case "shoulderRoll":
          if (type == "angle") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftRollShoulder_qa)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightRollShoulder_qa)
            );
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftRollShoulder_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightRollShoulder_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftRollShoulder_taua)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightRollShoulder_taua)
            );
          }
          break;
        case "elbow":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftElbow_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightElbow_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftElbow_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightElbow_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftElbow_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightElbow_taua));
          }
          break;
        case "wristPitch":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftPitchWrist_qa));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightPitchWrist_qa)
            );
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftPitchWrist_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightPitchWrist_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftPitchWrist_taua)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightPitchWrist_taua)
            );
          }
          break;
        case "wristYaw":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftYawWrist_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightYawWrist_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftYawWrist_qdota));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightYawWrist_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftYawWrist_taua));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightYawWrist_taua)
            );
          }
          break;
        case "wristRoll":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftRollWrist_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightRollWrist_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(
              this.xAxisDataFmt(this.leftRollWrist_qdota)
            );
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightRollWrist_qdota)
            );
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftRollWrist_taua));
            this.rightChartData.push(
              this.xAxisDataFmt(this.rightRollWrist_taua)
            );
          }
          break;
        case "headPitch":
          if (type == "angle") {
            this.singleChartData.push(this.xAxisDataFmt(this.headPitch_qa));
          } else if (type == "Avelocity") {
            this.singleChartData.push(this.xAxisDataFmt(this.headPitch_qdota));
          } else if (type == "torque") {
            this.singleChartData.push(this.xAxisDataFmt(this.headPitch_taua));
          }
          break;
        case "headYaw":
          if (type == "angle") {
            this.singleChartData.push(this.xAxisDataFmt(this.headYaw_qa));
          } else if (type == "Avelocity") {
            this.singleChartData.push(this.xAxisDataFmt(this.headYaw_qdota));
          } else if (type == "torque") {
            this.singleChartData.push(this.xAxisDataFmt(this.headYaw_taua));
          }
          break;
        case "headRoll":
          if (type == "angle") {
            this.singleChartData.push(this.xAxisDataFmt(this.headRoll_qa));
          } else if (type == "Avelocity") {
            this.singleChartData.push(this.xAxisDataFmt(this.headRoll_qdota));
          } else if (type == "torque") {
            this.singleChartData.push(this.xAxisDataFmt(this.headRoll_taua));
          }
          break;
        case "waistPitch":
          if (type == "angle") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistPitch_qa));
          } else if (type == "Avelocity") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistPitch_qdota));
          } else if (type == "torque") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistPitch_taua));
          }
          break;
        case "waistYaw":
          if (type == "angle") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistYaw_qa));
          } else if (type == "Avelocity") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistYaw_qdota));
          } else if (type == "torque") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistYaw_taua));
          }
          break;
        case "waistRoll":
          if (type == "angle") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistRoll_qa));
          } else if (type == "Avelocity") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistRoll_qdota));
          } else if (type == "torque") {
            this.singleChartData.push(this.xAxisDataFmt(this.waistRoll_taua));
          }
          break;
        default:
          break;
      }
      if (this.doubleChart) {
        let leftChart = echarts.getInstanceByDom(
          document.getElementById("leftChart")
        );
        leftChart.setOption({
          series: [
            {
              name: type,
              data: this.leftChartData,
            },
          ],
        });
        let rightChart = echarts.getInstanceByDom(
          document.getElementById("rightChart")
        );
        rightChart.setOption({
          series: [
            {
              name: type,
              data: this.rightChartData,
            },
          ],
        });
      } else {
        let singleChart = echarts.getInstanceByDom(
          document.getElementById("singleChart")
        );
        singleChart.setOption({
          series: [
            {
              name: type,
              data: this.singleChartData,
            },
          ],
        });
      }
    },
    //doubleChart
    singleOrDouble(e) {
      if (
        e == "headPitch" ||
        e == "headYaw" ||
        e == "headRoll" ||
        e == "waistPitch" ||
        e == "waistYaw" ||
        e == "waistRoll"
      ) {
        this.doubleChart = false;
      } else {
        this.doubleChart = true;
      }
    },
    //更新速度图表
    updateSpeedCharts() {},
    // x轴格式化成时间轴数据
    xAxisDataFmt(e) {
      return {
        name: +new Date(),
        value: [+new Date(), e],
      };
    },
    changeItem(e) {
      this.activatedItem = e;
      this.leftChartData = [];
      this.rightChartData = [];
    },
    changeType(e) {
      this.activatedType = e;
      this.leftChartData = [];
      this.rightChartData = [];
    },
    headChange() {
      this.headBoxVisible = !this.headBoxVisible;
    },
    changeMode(e) {
      if (e == "remoteMode") {
        this.$router.push({
          name: "controller",
        });
      } else if (e == "developerMode") {
        this.headBoxVisible = false;
      }
    },
    updatePointer(e, value) {
      const rotation = value * 90;
      if (e == "x")
        this.pointerTransformX = `translate(-50%, -100%) rotate(${rotation}deg)`;
      if (e == "y")
        this.pointerTransformY = `translate(-50%, -100%) rotate(${rotation}deg)`;
    },
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
    font-size: 1.9792vw;
    color: $white;
  }

  .arrow {
    position: absolute;
    top: 2vh;
    left: 11.2375vw;
    width: 0;
    height: 0;
    background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
    border-left: 0.4167vw solid transparent;
    border-right: 0.4167vw solid transparent;
    border-top: 0.5208vw solid $white;
  }
}

.logTitle {
  font-size: 1.5833vw;
  color: $white;
}

.leftBox {
  position: absolute;
  left: 3.0833vw;
  top: 5.7083vw;
  height: 38.2083vw;
  width: 23.0417vw;

  .humanModel {
    height: 32.125vw;
  }

  .logBox {
    height: 30.8333vw;
    padding: 1.2917vw 1.25vw 0 2.4583vw;
    box-shadow: 0 0.1042vw 0.2083vw 0 rgba(41, 72, 152, 0.01),
      0 0.4688vw 0.4167vw 0 rgba(41, 72, 152, 0.02);
    border-radius: 0.2604vw;
    background-color: rgba(255, 255, 255, 0.1);

    .logMain {
      margin-top: 1.0417vw;
      overflow-y: auto;
      height: 26.6667vw;

      .logTxt {
        font-size: $size-30;
        color: $white;
      }

      .txtErr {
        color: #dc4253;
      }
    }

    .logMain::-webkit-scrollbar {
      width: 0.5vw;
    }

    .logMain::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.125vw;
    }

    .logMain::-webkit-scrollbar-corner {
      background-color: transparent;
    }
  }

  .modelChose {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3.7083vw;
    width: 23.0417vw;
    align-items: center;

    .modelBtn {
      flex: 1;
      width: 11.0938vw;
      height: 3.6979vw;

      .btnTxt {
        font-size: $size-35;
        color: $white;
        opacity: 1;
        line-height: 2.0313vw;
      }
    }

    .activatedModel {
      border-radius: 1.8229vw;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.chartBox {
  position: absolute;
  top: 5.7083vw;
  right: 2.5833vw;
  width: 67.75vw;
  height: 8.625vw;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.25vw;

  .leftSide {
    width: 33.75vw;
    height: 8.625vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .doubleChartSize {
      width: 16.875vw;
      height: 11vw;
      margin-top: 2vw;
    }

    .singleChartSize {
      width: 33.75vw;
      height: 11vw;
      margin-top: 2vw;
    }

    .chartTitle {
      position: absolute;
      left: 1.25vw;
      top: 0.875vw;
      font-size: 1vw;
      color: #85888b;
    }
  }

  .middleDivider {
    width: 0.125vw;
    height: 4.4167vw;
  }

  .rightSide {
    width: 33.875vw;

    .axleVal {
      position: absolute;
      left: 36.9583vw;
      top: 2.4167vw;
      height: 3.8333vw;

      .val1 {
        font-size: 1vw;
        font-family: AlibabaPuHuiTiM;
        color: #85888b;
      }

      .val2 {
        font-size: $size-30;
        color: #ffffff;
        margin-left: 0.25vw;
      }
    }

    .axleImg {
      position: absolute;
      right: 11.7083vw;
      top: 2.4167vw;
      width: 8.625vw;
      height: 4.2917vw;

      .dashboard {
        width: 8.625vw;
        height: 4.2917vw;
      }
      .pointer {
        position: absolute;
        top: 3.75vw;
        right: 3.5vw;
        width: 0.8125vw;
        height: 2.5625vw;
        transform-origin: bottom;
        transition: transform 0.5s ease-in-out;
      }
    }
  }
}

.upper {
  right: 37.0833vw;
}

.lower {
  right: 2.5833vw;
}

.rightBox {
  position: absolute;
  top: 15.5417vw;
  width: 33.25vw;
  height: 28.3333vw;
  box-shadow: 0 0.1042vw 0.2083vw 0 rgba(41, 72, 152, 0.01),
    0 0.4688vw 0.4167vw 0 rgba(41, 72, 152, 0.02);
  border-radius: 0.2604vw;

  .rightTitle {
    display: flex;
    justify-content: space-between;
    padding: 1.1667vw 1.25vw 0.75vw 2.4583vw;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 0.2604vw 0.2604vw 0 0;
    font-size: $size-30;
    color: $white;

    .typeImg {
      width: 1.4583vw;
      height: 1.4583vw;
      margin-left: 1.25vw;
    }

    .notAct {
      opacity: 0.3;
    }
  }

  .sideChart {
    height: 6.2917vw;
    padding: 0 1.25vw;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .rightTable {
    height: 16.7917vw;
    padding: 1.9583vw 1.25vw 0 1.25vw;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 0 0 0.2604vw 0.2604vw;
  }

  .tableItem {
    height: 2.0833vw;
    width: 100%;
    display: flex;
    align-items: center;
    color: #85888b;
  }

  .tableItem:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .itemChild {
    flex: 1;
    font-size: 1vw;
    margin-left: 1.25vw;
  }

  .itemTxt {
    color: $white;
  }

  .currentItem {
    background-color: $base-bkg !important;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: 1.7188vw;
  color: $white;

  .divider {
    height: 0.1042vw;
    width: 11.9792vw;
    background: $white;
    opacity: 0.3;
  }
}

.unity-robot {
  width: 18.9063vw;
  height: 29.0625vw;
}
</style>
