<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}`">
    <!-- <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="drawerProps.row!.code" placeholder="请填写角色编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="drawerProps.row!.status" placeholder="请选择状态" clearable>
          <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.userLabel" :value="item.userStatus" />
        </el-select>
      </el-form-item>
    </el-form> -->
    <TreeFilter
      style="width: 400px"
      ref="treeFilterRef"
      title="权限菜单"
      multiple
      label="name"
      :request-api="getAuthMenuListApi"
      :default-value="treeFilterValue.menuId"
      @change="changeTreeFilter"
    />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="menuTreeDrawer">
import { ref, reactive, onMounted } from "vue";
// import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { getUserStatus } from "@/api/modules/user";
// import authMenuList from "@/assets/json/authMenuList.json";
import { getAuthMenuListApi } from "@/api/modules/login";
import TreeFilter from "@/components/TreeFilter/index.vue";

/* const rules = reactive({
  name: [{ required: true, message: "请填写角色名称" }],
  // pid: [{ required: true, message: "请选择性别" }],
  status: [{ required: true, message: "请选择状态" }]
}); */

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuOptions>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
// const menuData = ref(authMenuList.data);

const statusOptions = ref<User.DeptStatus[]>();
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const treeFilterRef = ref();
const treeFilterValue = reactive({
  menuId: [1, 2, 6]
});
const changeTreeFilter = (val: number[]) => {
  ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
  treeFilterValue.menuId = val;
  console.log(treeFilterRef.value.getCheckedNodes());
  // treeFilterValue.menuId = treeFilterRef.value.getCheckedNodes();
};
// 接收父组件传过来的参数
const parentParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  console.log(drawerProps.value.row);
  console.log(treeFilterValue.menuId);
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}角色成功！` });
      // drawerProps.value.getTableList!();
      // drawerVisible.value = false;
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

onMounted(() => {
  getStatus();
});
defineExpose({
  parentParams
});
</script>
