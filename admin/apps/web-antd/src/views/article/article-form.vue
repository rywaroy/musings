<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from '@wangeditor/editor';

import '@wangeditor/editor/dist/css/style.css';
import { Button, Card, Form, Input, Select, message } from 'ant-design-vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  createArticleApi,
  fetchArticleDetailApi,
  fetchArticleTagsApi,
  updateArticleApi,
  type ArticleItem,
  type ArticleTag,
  type CreateArticlePayload,
} from '#/api';

const route = useRoute();
const router = useRouter();
const FormItem = Form.Item;
const Textarea = Input.TextArea;
const SelectOption = Select.Option;

const formRef = ref<FormInstance>();
const loading = ref(false);
const submitting = ref(false);
const tags = ref<ArticleTag[]>([]);
const editorRef = shallowRef<IDomEditor | null>(null);
const editorHtml = ref('');
const editorText = ref('');

const formState = reactive<CreateArticlePayload>({
  content: '',
  img: '',
  intro: '',
  tagid: '',
  title: '',
});

const formRules = {
  intro: [{ required: true, message: '请输入文章摘要' }],
  tagid: [{ required: true, message: '请选择文章标签' }],
  title: [{ required: true, message: '请输入文章标题' }],
};

const isEdit = computed(() => typeof route.params.id === 'string');
const pageTitle = computed(() => (isEdit.value ? '编辑文章' : '新增文章'));

watch(editorHtml, (val) => {
  formState.content = val;
  editorText.value = editorRef.value?.getText?.() ?? '';
});

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    'bold',
    'underline',
    'italic',
    'through',
    'color',
    'bgColor',
    'fontSize',
    'fontFamily',
    'bulletedList',
    'numberedList',
    'todo',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'insertLink',
    'insertImage',
    'insertTable',
    'insertCodeBlock',
    'undo',
    'redo',
  ],
};
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入文章内容...支持基础富文本格式',
};

function handleEditorCreated(editor: IDomEditor) {
  editorRef.value = editor;
  editorText.value = editor.getText();
}

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
    editorRef.value = null;
  }
});

async function fetchTags() {
  try {
    tags.value = await fetchArticleTagsApi();
  } catch (error) {
    console.error(error);
    message.error('获取标签失败');
  }
}

async function fetchArticleDetail() {
  if (!isEdit.value) return;
  const id = route.params.id as string;
  loading.value = true;
  try {
    const data: ArticleItem = await fetchArticleDetailApi(id);
    formState.title = data.title ?? '';
    formState.intro = data.intro ?? '';
    formState.tagid = data.tagid ?? '';
    formState.img = data.img ?? '';
    editorHtml.value = data.content ?? '';
  } catch (error) {
    console.error(error);
    message.error('获取文章详情失败');
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  if (!formState.content || formState.content === '<p><br></p>') {
    message.error('请输入文章内容');
    return;
  }
  submitting.value = true;
  const payload: CreateArticlePayload = {
    ...formState,
    content: formState.content,
  };
  try {
    if (isEdit.value) {
      await updateArticleApi(route.params.id as string, payload);
      message.success('文章更新成功');
    } else {
      await createArticleApi(payload);
      message.success('文章创建成功');
    }
    router.push('/article/list');
  } catch (error) {
    console.error(error);
    message.error(isEdit.value ? '文章更新失败' : '文章创建失败');
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  router.back();
}

onMounted(() => {
  fetchTags();
  fetchArticleDetail();
});
</script>

<template>
  <div class="p-5">
    <Card :loading="loading" class="max-w-5xl">
      <template #title>
        <div class="flex items-center justify-between">
          <span>{{ pageTitle }}</span>
          <div class="text-xs text-gray-500">填写完成后点击保存即可</div>
        </div>
      </template>
      <Form
        :model="formState"
        :rules="formRules"
        layout="vertical"
        ref="formRef"
      >
        <FormItem label="标题" name="title">
          <Input v-model:value="formState.title" placeholder="请输入文章标题" />
        </FormItem>
        <FormItem label="摘要" name="intro">
          <Textarea
            v-model:value="formState.intro"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入文章摘要"
          />
        </FormItem>
        <div class="grid gap-4 lg:grid-cols-2">
          <FormItem label="标签" name="tagid">
            <Select
              v-model:value="formState.tagid"
              placeholder="请选择文章标签"
              option-filter-prop="children"
              show-search
            >
              <SelectOption
                v-for="tag in tags"
                :key="tag.id ?? tag._id"
                :value="tag.id ?? tag._id"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="inline-block h-3 w-3 rounded-full"
                    :style="{ backgroundColor: tag.color }"
                  ></span>
                  {{ tag.title }}
                </span>
              </SelectOption>
            </Select>
          </FormItem>
          <FormItem label="封面地址" name="img">
            <Input
              v-model:value="formState.img"
              placeholder="请输入封面图片 URL"
            />
          </FormItem>
        </div>
        <FormItem
          label="正文内容"
          name="content"
          :rules="[{ required: true, message: '请输入文章内容' }]"
        >
          <div class="editor-wrapper">
            <Toolbar
              :editor="editorRef"
              :default-config="toolbarConfig"
              class="border border-gray-200"
              mode="default"
            />
            <Editor
              v-model="editorHtml"
              :default-config="editorConfig"
              class="editor-body"
              mode="default"
              @on-created="handleEditorCreated"
            />
          </div>
        </FormItem>
        <FormItem label="正文纯文本预览">
          <Textarea
            :auto-size="{ minRows: 3, maxRows: 6 }"
            :value="editorText"
            disabled
          />
        </FormItem>
        <div class="flex flex-wrap gap-3">
          <Button :loading="submitting" type="primary" @click="handleSubmit">
            保存
          </Button>
          <Button @click="handleCancel">取消</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.editor-wrapper {
  overflow: hidden;
  border: 1px solid rgb(229 231 235 / 100%);
  border-radius: 0.5rem;
}

.editor-body {
  height: 560px !important;
}
</style>
