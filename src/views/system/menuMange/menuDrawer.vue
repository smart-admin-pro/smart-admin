<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="650px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="130px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :model="query"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <!-- <el-input v-model="query.parentId" placeholder="请选择上级菜单" clearable></el-input> -->
        <el-cascader v-model="query.parentId" :options="menuData" :props="CascaderProps" clearable filterable>
          <template #default="{ data }">
            {{ data.meta.title }}
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="query.type">
          <el-radio v-for="item in menuType" :value="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="menuType?.[query.type ?? 0].label + '名称'"
        prop="meta.title"
        :rules="[
          {
            required: true,
            message: `请填写${menuType?.[query.type ?? 0].label}名称`,
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="query.meta.title" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item
        label="编码"
        prop="name"
        :rules="[
          {
            required: true,
            message: '请填写编码',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="query.name" placeholder="请填写编码" clearable></el-input>
      </el-form-item>
      <div v-if="query.type === 0">
        <el-form-item
          label="路由地址"
          prop="path"
          :rules="[
            {
              required: true,
              message: '请填写路由地址',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="query.path" placeholder="请填写路由地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="外链地址" prop="isLink">
          <el-input v-model="query.meta.isLink" placeholder="请填写外链地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="query.component" placeholder="请填写组件路径" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否缓存" prop="isKeepAlive">
          <el-radio-group v-model="query.meta.isKeepAlive">
            <el-radio v-for="(item, index) in isOptions" :value="item.value" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否全屏" prop="isFull">
          <el-radio-group v-model="query.meta.isFull">
            <el-radio v-for="(item, index) in isOptions" :value="item.value" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否固定" prop="isAffix">
          <el-radio-group v-model="query.meta.isAffix">
            <el-radio v-for="(item, index) in isOptions" :value="item.value" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="query.type === 0">
        <el-form-item label="是否隐藏" prop="isHide">
          <el-radio-group v-model="query.meta.isHide">
            <el-radio v-for="(item, index) in isOptions" :value="item.value" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="query.type === 0">
        <el-form-item label="图标" prop="icon">
          <SelectIcon v-model:icon-value="query.meta.icon" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="menuDrawer">
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/dict";
import { /* ElMessage, */ FormInstance } from "element-plus";
// import { User } from "@/api/interface";
// import { getUserStatus } from "@/api/modules/user";
import { menuType } from "@/utils/dict";
import SelectIcon from "@/components/SelectIcon/index.vue";
import authMenuList from "@/assets/json/authMenuList.json";

interface MetaProps {
  icon: string;
  title: string;
  isHide: boolean;
  isFull: boolean;
  isAffix: boolean;
  isKeepAlive: boolean;
  isLink?: string;
  activeMenu?: string;
}
interface MenuOptions {
  id: number | string;
  parentId: number[] | string[];
  type: number;
  path: string;
  name: string;
  component: string;
  meta: MetaProps;
  redirect?: string;
  children?: MenuOptions[];
}

const menuData = ref(authMenuList.data);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuBody>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const query = ref<MenuOptions>({
  id: "",
  parentId: [],
  path: "",
  name: "",
  component: "",
  redirect: "",
  type: 0,
  meta: {
    isHide: false,
    isFull: false,
    isAffix: false,
    isKeepAlive: true,
    icon: "",
    title: ""
  }
});

const CascaderProps = ref<Record<string, unknown | (() => {})>>({
  label: "name",
  value: "id",
  checkStrictly: true
});

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const isOptions = reactive([
  {
    value: true,
    label: "是"
  },
  {
    value: false,
    label: "否"
  }
]);
// 接收父组件传过来的参数
const parentParams = (params: DrawerProps) => {
  if (params.title === "添加子项") {
    let parentId = [...(params.row.parentId ?? []), params.row.id] as number[];
    query.value.parentId = parentId;
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
      console.log(JSON.parse(JSON.stringify(query.value)));
      /*   await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false; */
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  parentParams
});
</script>
