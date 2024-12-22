<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="110px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="drawerProps.row.taskName" placeholder="任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="drawerProps.row.groupName" placeholder="分组名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="起止时间" prop="name">
        <el-date-picker
          v-model="drawerProps.row.dateTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="Cron表达式" prop="cron">
        <!-- <el-input v-model="drawerProps.row!.cron" placeholder="请填写Cron表达式" clearable></el-input> -->

        <!-- <template #append> -->
        <el-popover :visible="cronPopover" width="600px" trigger="click">
          <noVue3Cron
            :cron-value="drawerProps.row.cron"
            @change="changeCron"
            @close="cronPopover = false"
            max-height="400px"
            i18n="cn"
          ></noVue3Cron>
          <template #reference>
            <!-- <el-button @click="cronPopover = !cronPopover">设置</el-button> -->
            <el-input v-model="drawerProps.row.cron" placeholder="cron表达式..." readonly @click="handleCronInput"> </el-input>
          </template>
        </el-popover>
        <!-- </template> -->
      </el-form-item>
      <el-form-item label="执行方式" prop="code">
        <el-radio-group v-model="drawerProps.row.isLocal">
          <el-radio :value="true" size="large">本地任务</el-radio>
          <el-radio :value="false" size="large">外部接口任务</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 根据执行方式 填写任务地址 -->
      <el-form-item label="任务地址" prop="jobCallAddress">
        <!-- <el-input  v-model="drawerProps.row!.jobCallAddress" placeholder="请填写任务地址" clearable></el-input> -->
        <el-select v-if="isShowSelect" v-model="drawerProps.row.jobCallAddress" placeholder="请选择任务地址" clearable>
          <el-option v-for="(item, index) in addressOptions" :key="index" :label="item.label" :value="item.label" />
        </el-select>
        <el-input v-else v-model="drawerProps.row.jobCallAddress" placeholder="请填写任务地址" clearable></el-input>
      </el-form-item>
      <!--  <el-form-item label="任务地址" prop="jobCallAddress">
        <el-input v-model="drawerProps.row!.jobCallAddress" placeholder="请填写任务地址" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="任务参数" prop="jobCallParams">
        <el-input v-model="drawerProps.row.jobCallParams" placeholder="请填写任务参数" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="drawerProps.row.description" placeholder="请填写描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮件通知" prop="isSendMail">
        <el-radio-group v-model="drawerProps.row.isSendMail">
          <el-radio value="1" size="large">不通知</el-radio>
          <el-radio value="2" size="large">异常通知</el-radio>
          <el-radio value="3" size="large">所有通知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Email地址" prop="emailAddress">
        <el-input v-model="drawerProps.row.emailAddress" placeholder="请填写Email地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="enabledMark">
        <el-radio-group v-model="drawerProps.row.enabledMark">
          <el-radio :value="true" size="large">是</el-radio>
          <el-radio :value="false" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="TaskDrawer">
import { ref, onMounted, reactive } from "vue";
// import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { noVue3Cron } from "no-vue3-cron";
import "no-vue3-cron/lib/noVue3Cron.css"; // 引入样式
// import authMenuList from "@/assets/json/authMenuList.json";
import { TaskBody, getTaskAddress, TaskAddress } from "@/api/system/task";

const rules = reactive<FormRules<TaskBody>>({
  taskName: [{ required: true, message: "请填写任务名称" }],
  groupName: [{ required: true, message: "请填写任务分组" }],
  dateTime: [
    {
      type: "date",
      required: true,
      message: "请选择开始时间",
      trigger: "change"
    }
  ],
  cron: [{ required: true, message: "请填写Cron表达式", trigger: "blur" }],
  jobCallAddress: [{ required: true, message: "请选择或填写", trigger: "blur | change" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<TaskBody>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const addressOptions = ref<TaskAddress[]>();
const isShowSelect = ref<boolean>(true);
const cronPopover = ref<boolean>(false);
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const handleCronInput = () => {
  cronPopover.value = true;
};
const changeCron = (val: any) => {
  if (typeof val !== "string") return false;
  console.log(val);
  console.log(drawerProps.value.row);
  drawerProps.value.row.cron = val;
};
// 接收父组件传过来的参数
const parentParams = (params: DrawerProps) => {
  // 新增添加默认值
  if (!params.row.startTime) {
    params.row = {};
    params.row.startTime = [] as never;
    params.row.enabledMark = true;
    params.row.isSendMail = "2";
    params.row.isLocal = true;
  } else {
    params.row.dateTime = [params.row.startTime, params.row.endTime as string];
  }
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  console.log(drawerProps.value.row);

  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let param = JSON.parse(JSON.stringify(drawerProps.value.row));
      param.row.endTime = param.row.dateTime[1];
      param.row.startTime = param.row.dateTime[0];
      // await drawerProps.value.api!(param);
      ElMessage.success({ message: `${drawerProps.value.title}任务成功！` });
      // drawerProps.value.getTableList!();
      // drawerVisible.value = false;
      // handleClose();
    } catch (error) {
      console.log(error);
    }
  });
};

const handleClose = () => {
  cronPopover.value = false;
  drawerVisible.value = false;
};

const getAddrOptions = () => {
  getTaskAddress().then(res => {
    console.log(res);
    addressOptions.value = res.data as unknown as TaskAddress[];
  });
};

onMounted(() => {
  getAddrOptions();
  document.body.click = () => {
    handleClose();
  };
});
defineExpose({
  parentParams
});
</script>
