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
      <el-form-item label="字典标签" prop="label">
        <el-input v-model="drawerProps.row.label" placeholder="请填写字典标签" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="drawerProps.row.value" placeholder="请填写字典值" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="drawerProps.row.status" placeholder="请选择状态" clearable>
          <el-option v-for="item in userStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="drawerProps.row.sort" placeholder="请填写排序" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="dictDetailDrawer">
import { ref, reactive } from "vue";
import { userStatus } from "@/utils/dict";
import { ElMessage, FormInstance /* , UploadUserFile */ } from "element-plus";
import { DictDataBody } from "@/api/modules/dict";

const rules = reactive({
  label: [{ required: true, message: "请填写字典值" }],
  value: [{ required: true, message: "请填写字典值" }],
  status: [{ required: true, message: "请选择状态" }],
  sort: [{ required: true, message: "请填写排序" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<DictDataBody>;
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
const parentParams = (params: DrawerProps) => {
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
  parentParams
});
</script>
