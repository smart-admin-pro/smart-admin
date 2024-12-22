<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}字典`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="drawerProps.row.name" placeholder="请填写字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典编码" prop="dictCode">
        <el-input v-model="drawerProps.row.dictCode" placeholder="请填写字典编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="drawerProps.row.status" placeholder="请选择状态" clearable>
          <el-option v-for="item in userStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="dictDrawer">
import { ref, reactive } from "vue";
import { userStatus } from "@/utils/dict";
import { ElMessage, FormInstance /* , UploadUserFile */ } from "element-plus";
import { DictBody } from "@/api/modules/dict";

const rules = reactive({
  name: [{ required: true, message: "请填写字典名称" }],
  dictCode: [{ required: true, message: "请填写字典编码" }],
  status: [{ required: true, message: "请选择状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<DictBody>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  if (!params.row.status) {
    params.row = { status: 1 };
  }
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}字典成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
