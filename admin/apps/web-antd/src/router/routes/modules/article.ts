import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'ArticleManage',
    path: '/contents',
    meta: {
      icon: 'mdi:post-outline',
      title: '文章管理',
    },
    children: [
      {
        name: 'ArticleList',
        path: '/article/list',
        component: () => import('#/views/article/article-list.vue'),
        meta: {
          icon: 'mdi:format-list-text',
          title: '文章列表',
        },
      },
      {
        name: 'ArticleCreate',
        path: '/article/create',
        component: () => import('#/views/article/article-form.vue'),
        meta: {
          currentActiveMenu: '/article/list',
          hideInMenu: true,
          title: '新增文章',
        },
      },
      {
        name: 'ArticleEdit',
        path: '/article/edit/:id',
        component: () => import('#/views/article/article-form.vue'),
        meta: {
          currentActiveMenu: '/article/list',
          hideInMenu: true,
          title: '编辑文章',
        },
      },
      {
        name: 'ArticleTags',
        path: '/article/tags',
        component: () => import('#/views/article/article-tags.vue'),
        meta: {
          icon: 'mdi:tag-multiple',
          title: '标签管理',
        },
      },
    ],
  },
];

export default routes;
