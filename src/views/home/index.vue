<template>
  <div class="home card">
    <div class="img_container">
      <img class="home-bg" src="@/assets/analysis.svg" alt="welcome" />
    </div>
    <div>
      <el-descriptions class="margin-top" title="系统信息" :column="3" border>
        <el-descriptions-item key="IP" label="IP">
          {{ loginIp }}
        </el-descriptions-item>
        <el-descriptions-item v-for="(value, key) in browserInfo" :key="key" :label="key">
          {{ (value + "").replaceAll('"', "") }}
        </el-descriptions-item>
        <el-descriptions-item label="网络状态">
          <el-badge :type="online ? 'primary' : 'warning'" :offset="[10, 5]" :value="online ? '在线' : '离线'" />
        </el-descriptions-item>
        <!-- <el-descriptions-item label="WebSocket连接情况">
        <Badge :status="statusTextColor" :text="statusText" />
      </el-descriptions-item> -->
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, watchEffect } from "vue";
import BrowserType from "@/utils/browser-type";
import { useBattery } from "@/hooks/useBattery";
import { useOnline } from "@/hooks/useOnline";
// import { useUserStore } from "@/store/modules/user";

const loginIp = "0.0.0.1"; //useUserStore().userInfo?.phone;
// 是否联网
const { online } = useOnline();
// 获取电池信息
const { battery, batteryStatus, calcDischargingTime } = useBattery();
// 获取浏览器信息
const browserInfo = ref(BrowserType("zh-cn"));

watchEffect(() => {
  console.log(online.value);
  console.log("watchEffect");
  console.log(browserInfo.value);
  Object.assign(browserInfo.value, {
    距离电池充满需要: Number.isFinite(battery.chargingTime) && battery.chargingTime != 0 ? calcDischargingTime.value : "未知",
    剩余可使用时间: Number.isFinite(battery.dischargingTime) && battery.dischargingTime != 0 ? calcDischargingTime.value : "未知",
    电池状态: batteryStatus.value,
    当前电量: `${battery.level}%`
  });
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
