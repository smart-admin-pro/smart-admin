<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}部门`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="drawerProps.row.name" placeholder="请填写部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="pid">
        <!--  <el-select v-model="drawerProps.row!.pid" placeholder="请选择部门" clearable>
          <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-cascader
          v-model="drawerProps.row.pid"
          :options="deptOptions as unknown as CascaderOption[]"
          :props="CascaderProps"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="drawerProps.row.status" placeholder="请选择状态" clearable>
          <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.userLabel" :value="item.userStatus" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="deptDrawer">
import { ref, reactive, onMounted } from "vue";
// import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance, CascaderOption } from "element-plus";
import { User } from "@/api/interface";
import { getUserStatus, getUserDepartment } from "@/api/modules/user";
const rules = reactive({
  name: [{ required: true, message: "请填写部门名称" }],
  // pid: [{ required: true, message: "请选择性别" }],
  status: [{ required: true, message: "请选择状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResDepartment>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const CascaderProps = ref({
  label: "name",
  value: "id",
  children: "children"
  // disabled: "status"
});
const statusOptions = ref<User.DeptStatus[]>();
const deptOptions = ref<User.ResDepartment[]>([]);
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {
    status: 1
  }
});

// 接收父组件传过来的参数
const parentParams = (params: DrawerProps) => {
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
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}部门成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const getStatus = () => {
  getUserStatus().then(res => {
    console.log(res);
    statusOptions.value = res.data as User.DeptStatus[];
  });
};
const getDeptOptions = () => {
  getUserDepartment().then(res => {
    // 测试数据转换
    let data = res.data;
    data.forEach(item => {
      item["disabled"] = item.status == 1;
      item.children?.forEach(child => {
        child["disabled"] = child.status == 1;
      });
    });
    deptOptions.value = data;
  });
};
onMounted(() => {
  getStatus();
  getDeptOptions();
});
defineExpose({
  parentParams
});
</script>
