<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';

import {
  Button,
  Form,
  Input,
  Modal,
  Tag as AntTag,
  message,
} from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';

import {
  createArticleTagApi,
  deleteArticleTagApi,
  fetchArticleTagsApi,
  type ArticleTag,
  type CreateTagPayload,
} from '#/api';

const FormItem = Form.Item;

const tags = ref<ArticleTag[]>([]);
const loading = ref(false);
const saving = ref(false);
const formRef = ref<FormInstance>();
const formState = reactive<CreateTagPayload>({
  color: '#1677ff',
  title: '',
});

const formRules = {
  color: [{ required: true, message: '请输入颜色值' }],
  title: [{ required: true, message: '请输入标签名称' }],
};

async function fetchTags() {
  loading.value = true;
  try {
    tags.value = await fetchArticleTagsApi();
  } catch (error) {
    console.error(error);
    message.error('获取标签列表失败');
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  formState.title = '';
  formState.color = '#1677ff';
}

async function handleSubmit() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  saving.value = true;
  try {
    await createArticleTagApi({ ...formState });
    message.success('标签创建成功');
    resetForm();
    await fetchTags();
  } catch (error) {
    console.error(error);
    message.error('创建标签失败');
  } finally {
    saving.value = false;
  }
}

function handleDelete(tag: ArticleTag) {
  const targetId = tag.id ?? tag._id;
  if (!targetId) {
    message.error('标签ID缺失，无法删除');
    return;
  }
  Modal.confirm({
    title: '确认删除标签？',
    content: `删除后将无法选择：${tag.title}`,
    okButtonProps: { danger: true },
    okText: '删除',
    onOk: async () => {
      try {
        await deleteArticleTagApi(targetId);
        message.success('删除成功');
        fetchTags();
      } catch (error) {
        console.error(error);
        message.error('删除标签失败');
      }
    },
  });
}

onMounted(() => {
  fetchTags();
});
</script>

<template>
  <div class="space-y-5 p-5">
    <div class="rounded-lg border border-gray-100 bg-white/60 p-5 shadow-sm">
      <div class="mb-4 text-base font-semibold">新增标签</div>
      <Form
        :model="formState"
        :rules="formRules"
        layout="inline"
        ref="formRef"
        @submit.prevent
      >
        <FormItem label="名称" name="title" class="mb-0">
          <Input
            v-model:value="formState.title"
            placeholder="请输入标签名称"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="颜色" name="color" class="mb-0">
          <div class="flex items-center gap-3">
            <Input
              v-model:value="formState.color"
              placeholder="#1677ff"
              style="width: 160px"
            />
            <input
              v-model="formState.color"
              class="h-9 w-12 cursor-pointer rounded border border-gray-200"
              type="color"
            />
          </div>
        </FormItem>
        <FormItem class="mb-0">
          <Button
            :loading="saving"
            html-type="submit"
            type="primary"
            @click="handleSubmit"
          >
            保存标签
          </Button>
        </FormItem>
      </Form>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white/60 p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <div class="text-base font-semibold">标签列表</div>
        <span class="text-sm text-gray-500">共 {{ tags.length }} 个标签</span>
      </div>
      <div v-if="loading" class="py-10 text-center text-gray-500">
        正在加载标签...
      </div>
      <div v-else-if="!tags.length" class="py-10 text-center text-gray-400">
        暂无标签，先创建一个吧
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tag in tags"
          :key="tag.id ?? tag._id"
          class="rounded-lg border border-gray-100 bg-white p-4 shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-base font-medium">
              <span
                class="inline-block h-3 w-3 rounded-full"
                :style="{ backgroundColor: tag.color }"
              ></span>
              {{ tag.title }}
            </div>
            <Button size="small" type="link" @click="handleDelete(tag)">
              删除
            </Button>
          </div>
          <div class="mt-3 text-sm text-gray-500">
            <div>颜色：{{ tag.color }}</div>
            <div class="mt-1">
              <span class="mr-2 text-gray-400">示例：</span>
              <AntTag :color="tag.color">{{ tag.title }}</AntTag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
