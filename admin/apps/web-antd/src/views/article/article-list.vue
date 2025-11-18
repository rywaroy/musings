<script lang="ts" setup>
import type { TableColumnsType, TablePaginationConfig } from 'ant-design-vue';

import dayjs from 'dayjs';
import { Button, Drawer, Modal, Table, Tag, message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  deleteArticleApi,
  fetchArticleCommentsApi,
  fetchArticleListApi,
  updateArticleTopApi,
  type ArticleItem,
  type CommentItem,
} from '#/api';

const router = useRouter();

const articles = ref<ArticleItem[]>([]);
const loading = ref(false);
const pagination = reactive({
  limit: 10,
  page: 1,
  total: 0,
});

const commentDrawerVisible = ref(false);
const commentLoading = ref(false);
const commentList = ref<CommentItem[]>([]);
const currentArticleTitle = ref('');

const columns: TableColumnsType<ArticleItem> = [
  {
    dataIndex: 'title',
    key: 'title',
    title: '标题',
  },
  {
    dataIndex: 'tag',
    key: 'tag',
    title: '标签',
    width: 160,
  },
  {
    dataIndex: 'top',
    key: 'top',
    title: '置顶',
    width: 100,
  },
  {
    dataIndex: 'watch',
    key: 'watch',
    title: '浏览/点赞',
    width: 160,
  },
  {
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    title: '更新时间',
    width: 180,
  },
  {
    key: 'actions',
    title: '操作',
    width: 220,
    align: 'right',
  },
];

async function fetchArticles() {
  loading.value = true;
  try {
    const data = await fetchArticleListApi({
      limit: pagination.limit,
      page: pagination.page,
    });
    articles.value = data.list;
    pagination.total = data.total;
  } catch (error) {
    console.error(error);
    message.error('获取文章列表失败');
  } finally {
    loading.value = false;
  }
}

function handleCreate() {
  router.push({ name: 'ArticleCreate' });
}

function handleEdit(record: ArticleItem) {
  router.push({ name: 'ArticleEdit', params: { id: record.id } });
}

function handleTableChange(pager: TablePaginationConfig) {
  pagination.page = Number(pager.current) || 1;
  pagination.limit = Number(pager.pageSize) || 10;
  fetchArticles();
}

function toggleTop(record: ArticleItem) {
  const nextTop = record.top > 0 ? 0 : 1;
  Modal.confirm({
    title: nextTop > 0 ? '确定置顶该文章？' : '取消置顶该文章？',
    onOk: async () => {
      try {
        await updateArticleTopApi({ id: record.id, top: nextTop });
        message.success('置顶状态已更新');
        fetchArticles();
      } catch (error) {
        console.error(error);
        message.error('更新置顶状态失败');
      }
    },
  });
}

function removeArticle(record: ArticleItem) {
  Modal.confirm({
    title: '确认删除文章？',
    content: `删除后无法恢复：《${record.title}》`,
    okButtonProps: { danger: true },
    okText: '删除',
    onOk: async () => {
      try {
        await deleteArticleApi(record.id);
        message.success('删除成功');
        fetchArticles();
      } catch (error) {
        console.error(error);
        message.error('删除文章失败');
      }
    },
  });
}

async function openComments(record: ArticleItem) {
  commentDrawerVisible.value = true;
  commentLoading.value = true;
  currentArticleTitle.value = record.title;
  try {
    commentList.value = await fetchArticleCommentsApi(record.id);
  } catch (error) {
    console.error(error);
    message.error('获取评论失败');
    commentList.value = [];
  } finally {
    commentLoading.value = false;
  }
}

function goTagPage() {
  router.push('/article/tags');
}

onMounted(() => {
  fetchArticles();
});
</script>

<template>
  <div class="space-y-4 p-5">
    <div class="flex flex-wrap gap-3">
      <Button type="primary" @click="handleCreate">新增文章</Button>
      <Button @click="fetchArticles" :loading="loading">刷新列表</Button>
      <Button type="dashed" @click="goTagPage">标签管理</Button>
    </div>

    <Table
      :columns="columns"
      :data-source="articles"
      :loading="loading"
      :pagination="{
        current: pagination.page,
        pageSize: pagination.limit,
        showSizeChanger: true,
        total: pagination.total,
      }"
      bordered
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Tag v-if="record.top > 0" color="red">置顶</Tag>
              <span class="font-medium">{{ record.title }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ record.intro }}</p>
          </div>
        </template>
        <template v-else-if="column.key === 'tag'">
          <Tag v-if="record.tag" :color="record.tag.color">
            {{ record.tag.title }}
          </Tag>
          <span v-else class="text-gray-400">未设置</span>
        </template>
        <template v-else-if="column.key === 'top'">
          <span class="text-sm">{{
            record.top > 0 ? `权重 ${record.top}` : '否'
          }}</span>
        </template>
        <template v-else-if="column.key === 'watch'">
          <div class="text-sm">
            <div>浏览：{{ record.watch }}</div>
            <div>点赞：{{ record.likes }}</div>
          </div>
        </template>
        <template v-else-if="column.key === 'updatedAt'">
          <div class="text-sm">
            <div>
              创建：{{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm') }}
            </div>
            <div class="text-gray-500">
              更新：{{ dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm') }}
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'actions'">
          <div class="flex flex-wrap justify-end gap-2">
            <Button size="small" @click="handleEdit(record)">编辑</Button>
            <Button size="small" @click="toggleTop(record)">
              {{ record.top > 0 ? '取消置顶' : '设为置顶' }}
            </Button>
            <Button size="small" @click="openComments(record)">评论</Button>
            <Button danger size="small" @click="removeArticle(record)">
              删除
            </Button>
          </div>
        </template>
      </template>
    </Table>

    <Drawer
      v-model:open="commentDrawerVisible"
      :title="`评论 - ${currentArticleTitle}`"
      destroy-on-close
      width="480px"
    >
      <div v-if="commentLoading" class="py-8 text-center text-gray-500">
        正在加载评论...
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="item in commentList"
          :key="item.id"
          class="rounded border border-gray-100 bg-white/50 p-3 shadow-sm"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">{{ item.name }}</span>
            <span class="text-gray-400">
              {{
                item.createdAt
                  ? dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')
                  : ''
              }}
            </span>
          </div>
          <p class="mt-2 whitespace-pre-line text-sm text-gray-700">
            {{ item.content }}
          </p>
        </div>
        <div v-if="!commentList.length" class="py-8 text-center text-gray-400">
          暂无评论
        </div>
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
:deep(.ant-table) {
  background: transparent;
}
</style>
