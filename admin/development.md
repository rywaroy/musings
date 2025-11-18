## 简介

这是一个基于 `pnpm` workspace 的 monorepo 项目，使用了 `Turbo` 来优化构建和任务执行。项目核心是一个后台管理系统模板，提供了多种 UI 框架的实现，并且包含了文档、工具脚本和后端模拟等多个包。

### **项目技术栈**

- **前端框架**: Vue 3
- **构建工具**: Vite
- **包管理器**: pnpm
- **Monorepo 工具**: Turbo
- **UI 框架**: Ant Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router
- **代码规范**: ESLint, Prettier, stylelint, commitlint

### **目录结构分析**

根据 `pnpm-workspace.yaml` 文件，我们可以看到项目主要分为以下几个部分：

- `apps/*`: 存放的是最终的应用，可以直接运行。
  - `backend-mock`: 一个用于模拟后端 API 的应用，基于 `nitro`。
  - `web-antd`: 使用 Ant Design Vue 作为 UI 框架的管理后台应用。
- `docs`: 项目的文档站，使用了 `VitePress`。
- `internal/*`: 存放项目内部使用的配置包，用于统一管理不同包的配置。
  - `lint-configs`: 包含了 `commitlint`, `eslint`, `prettier`, `stylelint` 的配置。
  - `node-utils`: 提供了一些 Node.js 环境下的工具函数。
  - `tailwind-config`: 共享的 `tailwindcss` 配置。
  - `tsconfig`: 共享的 `TypeScript` 配置文件。
  - `vite-config`: 共享的 `Vite` 配置。
- `packages/*`: 存放的是可复用的包，提供给 `apps` 中的应用使用。
  - `@core/*`: 核心的功能包。
    - `base`: 存放最基础的设计、图标、类型定义和共享工具函数等。
    - `composables`: 存放 Vue 的组合式函数。
    - `preferences`: 用于管理项目的主题、布局等偏好设置。
    - `ui-kit`: 存放 UI 无关的核心组件，如图表、表单、布局、菜单等。
  - `effects`: 存放一些开箱即用的功能插件或效果，如权限控制、请求处理、布局方案等。
  - `business`: (在 `pnpm-workspace.yaml` 中有定义，但未在上传的文件中体现) 可能包含一些业务相关的组件或模块。
- `playground`: 一个用于开发和调试组件的隔离环境。
- `scripts/*`: 存放一些脚本文件，用于自动化任务，如清理、部署等。
  - `turbo-run`: 用于在 Turbo 环境下运行命令的脚本。
  - `vsh`: 一个自定义的命令行工具，用于执行检查、格式化等任务。

### **开发与构建流程**

从根目录的 `package.json` 文件可以看出项目的核心脚本：

- **`dev`**: 使用 `turbo-run dev` 启动开发环境。Turbo 会根据 `turbo.json` 的配置来决定并行运行哪些包的 `dev` 脚本。
- **`build`**: 使用 `turbo build` 来构建项目。`turbo.json` 中定义了 `build` 任务的依赖关系和产物输出路径。例如，一个应用的 `build` 任务会依赖其所有依赖包的 `build` 任务。
- **`lint` 和 `format`**: 使用自定义脚本 `vsh lint` 来进行代码检查和格式化。
- **`test:unit` 和 `test:e2e`**: 分别用于运行单元测试和端到端测试。

## web-antd

### **1. 概述**

`web-antd` 是一个完整的后台管理应用，它依赖于 `packages` 目录下的核心库和功能模块，并使用 `ant-design-vue` 作为其主要的 UI 组件库。这个包展示了如何将 `vue-vben-admin` 的核心能力与 Ant Design Vue 进行集成和定制。

### **2. 核心依赖**

通过分析 `apps/web-antd/package.json` 文件，我们可以看到它的核心依赖：

- **`ant-design-vue`**: 项目的核心 UI 框架。
- **`@vben/common-ui`**: 共享的 UI 组件。
- **`@vben/composables`**: 共享的 Vue Composables。
- **`@vben/layouts`**: 提供了通用的页面布局组件。
- **`@vben/styles`**: 全局共享的样式文件。
- **`@vben/utils`**: 共享的工具函数库。

### **3. 项目入口与初始化**

应用的入口文件是 `apps/web-antd/src/main.ts`。在这个文件中，完成了以下关键初始化工作：

- **全局样式加载**: 引入了 `packages/styles/src/index.ts`，包含了项目的基础样式和 Ant Design Vue 的样式。
- **UI 组件适配**: 调用 `bootstrap` 函数（来自 `apps/web-antd/src/bootstrap.ts`），这个函数中会注册 UI 框架的适配器。
- **应用挂载**: 创建 Vue 应用实例，并挂载到 `#app` 元素上。

### **4. 适配器 (Adapter) 机制**

`vue-vben-admin` 设计了一套适配器机制，使得核心组件（如表单、弹窗等）可以方便地与不同的 UI 框架集成。在 `web-antd` 中，适配器文件位于 `apps/web-antd/src/adapter/` 目录下。

- **`adapter/component/index.ts`**: 这个文件负责将 `ant-design-vue` 的全局组件（如 `ConfigProvider`, `App` 等）注册到应用中。
- **`adapter/form.ts`**: 这是表单适配器的核心。它将 `ant-design-vue` 的表单相关组件（如 `Input`, `Select`, `DatePicker` 等）映射为 `@vben/common-ui` 中表单组件可以识别的类型，从而实现了UI无关的表单渲染。
- **`adapter/vxe-table.ts`**: 类似地，这个文件为 `vxe-table` 表格组件库提供了针对 `ant-design-vue` 的适配，例如自定义渲染器等。

### **5. 路由与页面**

- **路由定义**: 路由主要在 `apps/web-antd/src/router/routes` 目录下定义。其中，`core.ts` 定义了核心路由（如登录、404等），而 `modules` 目录下的文件则定义了各个业务模块的路由，例如 `dashboard.ts` 定义了仪表盘页面的路由。
- **页面组件**: 页面组件存放在 `apps/web-antd/src/views` 目录下。例如，`demos/antd/index.vue` 是一个专门用于展示 Ant Design Vue 组件的示例页面。

### **6. 构建配置**

`apps/web-antd/vite.config.mts` 文件是 `web-antd` 包的 Vite 构建配置文件。它主要做了以下几件事：

- **引入基础配置**: 继承了 `internal/vite-config` 中的公共 Vite 配置。
- **UI 框架定制**: 可能包含了一些针对 `ant-design-vue` 的特定插件或配置，例如按需引入组件的设置。

### **总结**

`web-antd` 包是 `vue-vben-admin` 项目的一个最佳实践范例。它清晰地展示了如何通过分包、适配器等机制，将一个通用的后台管理系统核心与具体的 UI 框架（Ant Design Vue）进行解耦和集成。这种架构使得项目具有高度的可扩展性和可维护性，开发者可以相对容易地替换或增加新的 UI 框架支持。

## 规范

### 代码规范

1. 方法定义请使用箭头函数
2. 异步方法优先使用 async/await
3. 本项目为 vue3 框架，请严格使用 setup 模式
4. 请优先使用 Vben 框架的内部封装组件如 Vben Form、Vben Modal、Vben Drawer、VxeTable 等，如果没有再使用 Ant Design Vue 组件

### 页面构建

好的，在 `vue-vben-admin` 中添加一个新的页面、路由和菜单项是一个常规操作，遵循其约定即可。下面我将以 `web-antd` 应用为例，为你提供详细的步骤。

#### **1. 创建页面组件**

首先，你需要在 `apps/web-antd/src/views` 目录下创建一个新的 `.vue` 文件作为你的页面。为了更好地组织代码，建议根据业务模块创建子目录。

例如，我们创建一个新的 `demo` 页面：

- 在 `apps/web-antd/src/views` 下创建一个 `demo` 目录。
- 在 `apps/web-antd/src/views/demo` 目录下创建一个 `index.vue` 文件。

<!-- end list -->

```vue
<template>
  <div class="p-4">这是一个新的演示页面</div>
</template>

<script lang="ts" setup>
// 你的页面逻辑
</script>
```

#### **2. 添加路由配置**

路由的配置是模块化的，存放在 `apps/web-antd/src/router/routes/modules` 目录下。你可以选择一个现有的模块文件（如 `demos.ts`）添加新的路由，或者创建一个新的模块文件。

我们在这里创建一个新的 `demo.ts` 文件来管理演示页面的路由：

```typescript
// apps/web-antd/src/router/routes/modules/demo.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/layouts/basic.vue'), // 使用基础布局
    meta: {
      title: '演示页面', // 菜单标题
      icon: 'radix-icons:dashboard', // 菜单图标
    },
    children: [
      {
        path: 'index',
        name: 'DemoIndex',
        component: () => import('@/views/demo/index.vue'),
        meta: {
          title: '演示页面',
        },
      },
    ],
  },
];

export default routes;
```

**关键配置说明：**

- `path`: 路由的访问路径。
- `name`: 路由的唯一名称，建议大写驼峰。
- `component`: 页面所使用的布局组件。通常，业务页面都使用 `basic.vue` 这个基础布局。
- `meta`: 路由的元信息，这是生成菜单的关键。
  - `title`: 会显示在菜单和 Tab 标签页上的标题。
  - `icon`: 菜单项的图标。`vue-vben-admin` 使用了 `unplugin-icons`，你可以直接使用 [Iconify](https://icones.js.org/) 上的图标名称。

#### **3. 自动注册路由模块**

`vue-vben-admin` 会自动加载 `apps/web-antd/src/router/routes/modules` 目录下的所有路由模块文件，所以你不需要手动导入新建的 `demo.ts` 文件。这个自动加载的逻辑可以在 `apps/web-antd/src/router/routes/index.ts` 文件中看到。

#### meta 对象详解

当然，`meta` 对象是 `vue-router` 中一个非常强大和灵活的配置项，`vue-vben-admin` 在此基础上进行了扩展，用于实现菜单、权限、布局等各种功能。

下面我将为你详细解析 `meta` 对象中常用的字段及其作用，特别是权限相关的配置。

##### **`meta` 对象的核心字段**

通过分析项目代码，我们可以看到 `meta` 对象主要包含以下核心字段：

| 字段 | 类型 | 描述 |
| :-- | :-- | :-- |
| `title` | `string` | **必需。** 用于在菜单、面包屑和标签页中显示的标题。它支持国际化，你可以直接写入 `i18n` 的 `key`。 |
| `icon` | `string` | 菜单和面包屑的图标。推荐使用 [Iconify](https://icones.js.org/) 图标集。 |
| `roles` | `string[]` | **权限控制**：指定哪些角色可以访问该路由。 |
| `permissions` | `string[]` | **权限控制**：指定需要哪些权限点才能访问该路由。 |
| `access` | `(route: RouteLocationNormalized) => boolean` | **权限控制**：更灵活的函数式权限判断，返回 `true` 表示有权限。 |
| `hideMenu` | `boolean` | 如果设置为 `true`，该路由将不会显示在菜单中。 |
| `hideChildrenInMenu` | `boolean` | 如果设置为 `true`，子路由将不会显示在菜单中，通常用于只有一个子路由的情况。 |
| `order` | `number` | 菜单的排序，值越小越靠前。 |
| `keepAlive` | `boolean` | 如果设置为 `true`，页面在切换后会被缓存。 |
| `frameSrc` | `string` | 内嵌 `iframe` 的 `src` 地址。 |
| `external` | `boolean` | 如果设置为 `true`，表示该路由为外部链接。 |

##### **权限限制的实现**

`vue-vben-admin` 的权限控制主要通过 `meta` 对象中的 `roles`、`permissions` 和 `access` 字段来实现的。

###### **1. 基于角色的权限控制 (`roles`)**

这是最常见的权限控制方式。你可以在路由的 `meta` 对象中定义一个 `roles` 数组，只有当用户拥有该数组中至少一个角色时，才能访问该路由。

```typescript
// 只有 'admin' 或 'editor' 角色的用户才能访问
meta: {
  title: '某个页面',
  roles: ['admin', 'editor'],
}
```

用户的角色信息通常在登录后从后端获取，并存储在 `pinia` 的 `access` store 中。路由守卫 (`router/guard.ts`) 会在每次路由跳转时，检查用户角色是否满足目标路由的 `roles` 要求。

###### **2. 基于权限点的权限控制 (`permissions`)**

对于更细粒度的权限控制（例如，控制页面上的某个按钮是否显示），`vue-vben-admin` 提供了基于权限点的控制。

```typescript
// 需要同时拥有 'user:create' 和 'user:edit' 权限才能访问
meta: {
  title: '用户管理',
  permissions: ['user:create', 'user:edit'],
}
```

###### **3. 动态权限控制 (`access` 函数)**

如果你需要更复杂的权限判断逻辑，可以使用 `access` 函数。这个函数会接收当前的路由对象作为参数，你可以根据路由信息、用户信息或其他状态来进行动态判断。

```typescript
// 动态判断，例如：只有当某个特定条件下才允许访问
meta: {
  title: '动态页面',
  access: (route) => {
    // 你的自定义逻辑
    return someCondition;
  },
}
```

##### **示例**

下面是一个综合了多个 `meta` 字段的路由配置示例：

```typescript
// in apps/web-antd/src/router/routes/modules/demo.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/advanced-demo',
    name: 'AdvancedDemo',
    component: () => import('@/layouts/basic.vue'),
    meta: {
      title: '高级演示',
      icon: 'radix-icons:gear',
      order: 10,
    },
    children: [
      {
        path: 'admin-only',
        name: 'AdminOnlyPage',
        component: () => import('@/views/demo/admin-only.vue'),
        meta: {
          title: '仅管理员可见',
          roles: ['admin'], // 只有 admin 角色可见
        },
      },
      {
        path: 'permission-required',
        name: 'PermissionRequiredPage',
        component: () => import('@/views/demo/permission-required.vue'),
        meta: {
          title: '需要特定权限',
          permissions: ['feature:export-data'], // 需要导出数据的权限
          keepAlive: true, // 缓存该页面
        },
      },
      {
        path: 'hidden-page',
        name: 'HiddenPage',
        component: () => import('@/views/demo/hidden-page.vue'),
        meta: {
          title: '隐藏的页面',
          hideMenu: true, // 不在菜单中显示
        },
      },
    ],
  },
];

export default routes;
```

## 基础组件

### 通用组件

#### Page

容器组件，展示页面信息，放在最外层

```vue
<script lang="ts" setup>
import { Page } from '@vben/common-ui';
</script>
<template>
  <Page></Page>
</template>
```

```ts
export interface PageProps {
  title?: string;
  description?: string;
  contentClass?: string;
  /**
   * 根据content可见高度自适应
   */
  autoContentHeight?: boolean;
  headerClass?: string;
  footerClass?: string;
  /**
   * Custom height offset value (in pixels) to adjust content area sizing
   * when used with autoContentHeight
   * @default 0
   */
  heightOffset?: number;
}
```

### **Vben Form 表单组件**

`Vben-Form` 是一个数据驱动的表单组件，它的核心思想是通过 **Schema** 来定义表单的结构、校验规则和行为，从而让你从繁琐的表单布局和逻辑中解脱出来。

#### **1. 核心用法：`useVbenForm`**

在几乎所有的示例中，我们都能看到这两个核心元素：

- **`useVbenForm`**: 这是一个 Composition API，用于创建一个表单实例。
  - **导入**: `import { useVbenForm } from '#/adapter/form';`
  - **使用**: 它接收一个包含 `schema` 和其他表单配置的选项对象，并返回一个数组 `[Form, formApi]`。
    - `Form`: 一个可以直接在 `<template>` 中渲染的表单组件。
    - `formApi`: 一个包含了所有操作表单方法的控制器。
- **`<Form />`**: 这是由 `useVbenForm` Hook 返回的 UI 组件，直接在模板中使用即可。

**基础示例 (`basic.vue`)**

```vue
<script lang="ts" setup>
import { useVbenForm } from '#/adapter/form';

const schema = [
  {
    component: 'Input',
    fieldName: 'field1',
    label: '字段1',
  },
  {
    component: 'Input',
    fieldName: 'field2',
    label: '字段2',
  },
];

const [Form] = useVbenForm({
  schema,
});
</script>

<template>
  <Form />
</template>
```

#### **2. Schema 配置详解**

`schema` 是一个数组，数组中的每个对象都定义了一个表单项。下面是一个典型的 Schema 对象及其常用属性：

| 属性 | 类型 | 描述 |
| :-- | :-- | :-- | --- |
| `fieldName` | `string` | **必需。** 表单项的字段名，用于和数据对象进行双向绑定。 |
| `label` | `string` | 表单项的标签文本。 |
| `component` | `string` | **必需。** 所使用的组件类型，例如 `'Input'`, `'Select'` 等。 |
| `componentProps` | `object` | `function` | 传递给组件的 `props`。可以是一个对象，也可以是一个返回对象的函数，以实现动态 `props`。 |
| `rules` | `string` | zod 对象 |
| `defaultValue` | `any` | 表单项的默认值。 |
| `ifShow` | `boolean` | `function` | 控制表单项是否显示。可以是一个布尔值，也可以是一个返回布尔值的函数，以实现动态显示/隐藏。 |

#### **3. 常见使用场景**

##### **3.1 表单校验 (`rules.vue`)**

校验规则通过 `rules` 属性来定义，它是一个数组，每个对象代表一条校验规则。

```typescript
// playground/src/views/examples/form/rules.vue
const schema = [
  {
    component: 'InputPassword',
    fieldName: 'password',
    label: '密码',
    rules: z.string().min(1, { message: '最少输入6个字符' }),,
  },
];
```

##### **3.2 动态表单 (`dynamic.vue`)**

通过 `useVbenForm` 返回的 `formApi`，可以动态地更新、添加或删除表单项。

- **`updateSchema`**: 更新指定 `fieldName` 的 `schema`。
- **`appendSchema`**: 在指定 `fieldName` 之后追加一个新的 `schema`。
- **`removeSchema`**: 删除指定的 `schema`。

<!-- end list -->

```typescript
// playground/src/views/examples/form/dynamic.vue
const [Form, formApi] = useVbenForm({
  // ...
});

function changeLabel() {
  formApi.updateSchema({
    fieldName: 'fieldA',
    label: '新的标签',
  });
}

function addField() {
  formApi.appendSchema(
    {
      component: 'Input',
      fieldName: 'newField',
      label: '新增字段',
    },
    'fieldC', // 在 fieldC 后面添加
  );
}
```

##### **3.3 与 API 交互 (`api.vue`)**

在很多场景下，表单的某些字段（如下拉框的选项）需要从后端 API 获取。`Vben-Form` 对此提供了很好的支持。你可以在 `componentProps` 中传入一个返回 `Promise` 的 `api` 函数。

```typescript
// playground/src/views/examples/form/api.vue
import { getProvinceList } from '@/api/examples/form'; // 这是一个返回 Promise 的函数

const schema = [
  {
    component: 'Select',
    fieldName: 'province',
    label: '省份',
    componentProps: {
      // api 函数会自动执行，并将结果填充到 options
      api: getProvinceList,
      // 可选，指定返回数据中作为 options 的字段名
      resultField: 'items',
    },
  },
];
```

##### **3.4 查询表单 (`query.vue`)**

对于查询场景，`useVbenForm` 提供了一些便利的配置项来控制布局和交互。

- **`showCollapseButton`**: 是否显示展开/收起按钮。
- **`submitButtonOptions`**: 操作按钮（查询、重置）的布局配置。
- **`showDefaultActions`**: (默认为`true`) 控制是否显示默认的提交和重置按钮。

#### **4. 自定义与扩展**

- **自定义组件 (`custom.vue`)**: 你可以通过在 `schema` 中定义 `slot` 属性，然后在 `<Form>` 组件上使用同名插槽来自定义渲染。
- **自定义布局 (`custom-layout.vue`)**: 通过 `schema` 中的 `colProps` 属性，可以精细地控制每个表单项的栅格布局。

#### **5. 支持的组件**

`Vben-Form` 的 `schema` 中的 `component` 属性所支持的组件，是根据你当前使用的 UI 框架 (`antd`, `naive`, `element-plus`) 动态适配的。这意味着，同一个组件名称（例如 `'Input'`）在不同的 UI 框架下会渲染成对应框架的输入框组件。

这个映射关系主要在各个 `apps/web-*/src/adapter/form.ts` 文件中定义。以下是 `Vben-Form` 所支持的 **所有内置组件** 的完整列表：

**基础输入组件**

- `'Input'`: 文本输入框
- `'InputNumber'`: 数字输入框
- `'InputPassword'`: 密码输入框
- `'Textarea'`: 多行文本域

**选择类组件**

- `'Select'`: 下拉选择器
- `'TreeSelect'`: 树形选择器
- `'RadioGroup'`: 单选框组
- `'Checkbox'` & `'CheckboxGroup'`: 复选框与复选框组
- `'AutoComplete'`: 自动完成输入框
- `'Cascader'`: 级联选择器
- `'Switch'`: 开关

**日期与时间组件**

- `'DatePicker'`: 日期选择器
- `'TimePicker'`: 时间选择器
- `'RangePicker'`: 日期范围选择器
- `'TimeRangePicker'`: 时间范围选择器

**高级组件**

- `'IconPicker'`: 图标选择器
- `'Upload'`: 上传组件
- `'StrengthMeter'`: 密码强度计 (通常与 `'InputPassword'` 配合使用)
- `'VbenButton'`
- `'VbenDivider'`

**如何自定义和扩展**

1.  **UI 框架原生组件**: 你可以直接使用当前 UI 框架的任何表单相关组件的名称，例如，在 Ant Design Vue 版本中，可以直接使用 `'AInput'` 或 `'ASelect'`。

2.  **插槽 (Slot)**: 对于完全自定义的场景，可以通过在 `schema` 中定义 `slot` 属性，然后在 `<Form>` 组件中使用对应的插槽来自定义渲染。

    ```typescript
    // In your schema
    {
      fieldName: 'customField',
      label: '自定义内容',
      component: 'Input', //  component 字段仍然需要，但会被 slot 覆盖
      slot: 'custom',
    }
    ```

    ```vue
    <Form>
      <template #custom="{ model, fieldName }">
        <YourCustomComponent v-model="model[fieldName]" />
      </template>
    </Form>
    ```

#### **6. 查询和重置**

`Vben-Form` 通过 `useVbenForm` 配置中的 `handleSubmit` 和 `handleReset` 回调来处理表单的提交和重置操作。

##### **1. 通过 `handleSubmit` 和 `handleReset`**

这是最常见的使用方式。当表单内置的“查询”和“重置”按钮被点击时，会分别触发这两个回调。

我们来看 `playground/src/views/examples/form/query.vue` 这个示例：

```vue
<script lang="ts" setup>
import { useVbenForm } from '#/adapter/form';

function handleSubmit(values: Record<string, any>) {
  console.log('submit', values);
  // 在这里执行你的查询逻辑，例如调用 API
}

function handleReset() {
  console.log('reset');
  // 表单会自动清空，你可以在这里执行额外的重置逻辑
}

const [Form] = useVbenForm({
  handleSubmit, // 传入查询回调
  handleReset, // 传入重置回调
  schema: [
    /* ... */
  ],
});
</script>

<template>
  <Form />
</template>
```

**工作流程解析：**

1.  **`handleSubmit`**: 当用户点击表单内置的 “查询” 或 “提交” 按钮时，`Vben-Form` 会首先执行内部的校验逻辑。如果校验通过，它会调用你传入的 `handleSubmit` 函数，并将所有表单项的值作为一个对象 `values` 传递给它。
2.  **`handleReset`**: 当用户点击 “重置” 按钮时，表单会首先将所有字段的值重置为它们的 `defaultValue` 或 `undefined`。然后，它会调用你传入的 `handleReset` 函数。

##### **2. 通过 `formApi` 返回的方法手动操作**

`formApi` 返回的方法让你可以在任何地方手动地与表单进行交互。

| 方法 | 描述 |
| :-- | :-- |
| `getValues()` | 获取所有表单项的值。 |
| `setValues(values)` | 设置一个或多个表单项的值。 |
| `resetFields()` | 将所有表单项的值重置为其初始 `defaultValue`。 |
| `validate()` | 手动触发整个表单的校验。 |
| `validateAndSubmitForm()` | 手动触发表单的提交（会先进行校验，成功后调用`handleSubmit`）。 |

**示例：**

```vue
<script lang="ts" setup>
import { VbenButton } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';

const [Form, formApi] = useVbenForm({
  handleSubmit: (values) => {
    console.log('手动提交成功', values);
  },
  schema: [
    /* ... */
  ],
  showDefaultActions: false, // 隐藏默认按钮
});

async function customSubmit() {
  try {
    await formApi.validateAndSubmitForm();
  } catch (error) {
    console.error('校验失败', error);
  }
}

async function customReset() {
  await formApi.resetFields();
  console.log('表单已重置');
}
</script>

<template>
  <div>
    <Form />
    <VbenButton @click="customSubmit">手动提交</VbenButton>
    <VbenButton @click="customReset">手动重置</VbenButton>
  </div>
</template>
```

好的，通过分析 `views/examples/vxe-table` 文件夹下的示例文件，我为您总结了 `vxe-table` 组件的使用文档。

---

#### 表单联动

```vue
<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      defaultValue: 'hidden value',
      dependencies: {
        show: false,
        // 随意一个字段改变时，都会触发
        triggerFields: ['field1Switch'],
      },
      fieldName: 'hiddenField',
      label: '隐藏字段',
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'field1Switch',
      help: '通过Dom控制销毁',
      label: '显示字段1',
    },
    {
      component: 'Input',
      dependencies: {
        show(values) {
          return !!values.field1Switch;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['field1Switch'],
      },
      // 字段名
      fieldName: 'field1',
      // 界面显示的label
      label: '字段1',
    },
    {
      component: 'Input',
      dependencies: {
        rules(values) {
          if (values.field1 === '123') {
            return 'required';
          }
          return null;
        },
        triggerFields: ['field1'],
      },
      fieldName: 'field5',
      help: '当字段1的值为`123`时，必填',
      label: '动态rules',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption: true,
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      dependencies: {
        componentProps(values) {
          if (values.field2 === '123') {
            return {
              options: [
                {
                  label: '选项1',
                  value: '1',
                },
                {
                  label: '选项2',
                  value: '2',
                },
                {
                  label: '选项3',
                  value: '3',
                },
              ],
            };
          }
          return {};
        },
        triggerFields: ['field2'],
      },
      fieldName: 'field6',
      help: '当字段2的值为`123`时，更改下拉选项',
      label: '动态配置',
    },
  ],
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Form />
</template>
```

### **VxeTable 组件**

`vxe-table` 是一个功能强大的表格组件，经过了二次封装，通过 `useVbenVxeGrid` hook 来简化使用。它支持本地/远程数据加载、单元格/行编辑、树形表格、虚拟滚动等多种高级功能。

#### **1. 基础用法 (`basic.vue`)**

基础表格展示了如何初始化组件、加载本地数据以及处理基本交互。

- **初始化**: 使用 `useVbenVxeGrid` hook，传入 `gridOptions` 来创建表格实例。
- **列配置 (`columns`)**: 在 `gridOptions` 中定义 `columns` 数组，每个对象代表一列。
  - `type: 'seq'`：显示序号列。
  - `field`：对应数据源中的字段名。
  - `title`：列头显示的标题。
  - `sortable: true`：开启该列的排序功能。
- **数据源 (`data`)**: 直接在 `gridOptions` 中提供一个数组作为本地数据源。
- **事件监听 (`gridEvents`)**: 可以传入一个包含事件监听函数的对象，例如 `cellClick`。
- **动态控制**: `useVbenVxeGrid` 返回的 `gridApi` 提供了一系列方法来动态控制表格，如 `setGridOptions` 和 `setLoading`。

**示例代码 (`basic.vue`):**

```vue
<script lang="ts" setup>
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MOCK_TABLE_DATA } from './table-data';

// 表格配置
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'age', sortable: true, title: 'Age' },
    // ...其他列
  ],
  data: MOCK_TABLE_DATA, // 本地数据
  sortConfig: {
    multiple: true, // 开启多列排序
  },
};

// 事件监听
const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    message.info(`cell-click: ${row.name}`);
  },
};

const [Grid, gridApi] = useVbenVxeGrid<RowType>({
  gridEvents,
  gridOptions,
});

// 动态修改表格边框
function changeBorder() {
  gridApi.setGridOptions({
    border: !gridApi.useStore((state) => state.gridOptions?.border).value,
  });
}
</script>

<template>
  <Page>
    <Grid table-title="基础列表" />
  </Page>
</template>
```

#### **2. 远程数据与排序 (`remote.vue`)**

通过配置 `proxyConfig`，表格可以实现远程数据的加载、分页和排序。

- **代理配置 (`proxyConfig`)**:
  - `ajax.query`: 定义一个异步函数，用于请求数据。该函数接收分页和排序参数，并返回一个包含 `items` 和 `total` 的对象。
  - `sort: true`: 启用远程排序。
- **排序配置 (`sortConfig`)**:
  - `remote: true`: 必须设置为 `true` 来启用远程排序。
  - `defaultSort`: 设置默认的排序列和顺序。

**示例代码 (`remote.vue`):**

```vue
<script lang="ts" setup>
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getExampleTableApi } from '#/api';

const gridOptions: VxeGridProps<RowType> = {
  // ... columns 定义 ...
  proxyConfig: {
    ajax: {
      // 异步查询数据
      query: async ({ page, sort }) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          sortBy: sort.field,
          sortOrder: sort.order,
        });
      },
    },
    sort: true, // 开启远程排序
  },
  sortConfig: {
    defaultSort: { field: 'category', order: 'desc' },
    remote: true, // 启用远程排序
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
```

#### **3. 与搜索表单联动 (`form.vue`)**

`useVbenVxeGrid` 支持传入 `formOptions`，可以方便地创建一个与表格联动的搜索表单。

- **表单配置 (`formOptions`)**:
  - `schema`: 定义表单项，语法与 `VbenForm` 一致。
  - `submitOnChange: true`: 当表单项的值改变时，自动触发表格数据查询。
  - `fieldMappingTime`: 用于处理范围选择器的时间字段映射。

**示例代码 (`form.vue`):**

```vue
<script lang="ts" setup>
import { useVbenVxeGrid } from '#/adapter/vxe-table';

// 表单配置
const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]], // 时间范围映射
  schema: [
    { component: 'Input', fieldName: 'category', label: 'Category' },
    { component: 'Input', fieldName: 'productName', label: 'ProductName' },
    // ...其他表单项
  ],
  submitOnChange: true, // 值改变时自动提交
};

// 表格配置
const gridOptions: VxeTableGridOptions<RowType> = {
  // ... columns 定义 ...
  proxyConfig: {
    ajax: {
      // query 函数会接收到 formValues
      query: async ({ page }, formValues) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
</script>
```

#### **4. 编辑功能 (`edit-cell.vue`, `edit-row.vue`)**

表格支持单元格编辑和行编辑两种模式。

- **开启编辑 (`editConfig`)**:
  - `trigger`: 设置触发编辑的方式，如 `'click'`。
  - `mode`: `'cell'` (单元格编辑) 或 `'row'` (行编辑)。
- **可编辑列 (`editRender`)**: 在列配置中，通过 `editRender` 属性指定编辑时使用的组件，例如 `{ name: 'input' }`。
- **行编辑操作**: 在行编辑模式下，通常需要自定义操作列，提供“编辑”、“保存”、“取消”等按钮，并调用 `gridApi` 的方法（如 `setEditRow`, `clearEdit`）来控制编辑状态。

**示例代码 (`edit-row.vue`):**

```vue
<script lang="ts" setup>
// ...
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { editRender: { name: 'input' }, field: 'category', title: 'Category' },
    // ...其他可编辑列
    { slots: { default: 'action' }, title: '操作' }, // 自定义操作列
  ],
  editConfig: {
    mode: 'row', // 行编辑模式
    trigger: 'click',
  },
  // ...
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 进入编辑状态
function editRowEvent(row: RowType) {
  gridApi.grid?.setEditRow(row);
}
// 保存
async function saveRowEvent(row: RowType) {
  await gridApi.grid?.clearEdit();
  // ...后续保存逻辑
}
</script>

<template>
  <Grid>
    <template #action="{ row }"> </template>
  </Grid>
</template>
```

#### **5. 其他高级功能**

- **树形表格 (`tree.vue`)**:
  - 通过 `treeConfig` 开启树形结构。
  - `transform: true`: 自动将列表数据转换为树形结构。
  - `rowField`: 行数据的唯一主键字段。
  - `parentField`: 指向父级节点的字段。
  - 在列配置中设置 `treeNode: true` 的列会显示展开/收起图标。

- **固定列 (`fixed.vue`)**:
  - 在需要固定的列配置中添加 `fixed: 'left'` 或 `fixed: 'right'`。

- **自定义单元格 (`custom-cell.vue`)**:
  - **插槽**: 使用 `#<field>="{ row }"` 的形式自定义单元格内容。
  - **`cellRender`**: 使用预设的渲染器，如 `CellImage`、`CellLink`、`CellTag` 等，简化常见自定义场景。

- **虚拟滚动 (`virtual.vue`)**:
  - 当数据量巨大时，通过 `scrollY: { enabled: true }` 来开启纵向虚拟滚动，提升渲染性能。

好的，通过分析 `views/examples/modal` 文件夹下的示例文件，我为您总结了 `Vben Modal` 组件的使用文档。

---

### **Vben Modal组件**

`Vben Modal` 是一个灵活且功能丰富的弹窗组件，通过 `useVbenModal` 这个 Hook 进行创建和管理。它支持基础展示、动态内容更新、嵌套、拖拽以及与表单组件的深度集成等多种功能。

#### **1. 核心用法 (`index.vue`, `base-demo.vue`)**

- **创建与连接**:
  - 使用 `useVbenModal` Hook 来创建弹窗实例和控制器 (`modalApi`)。
  - 通过 `connectedComponent` 选项，可以将弹窗的逻辑和内容拆分到独立的组件中，使代码更清晰。

- **打开与关闭**:
  - `modalApi.open()`: 打开弹窗。
  - `modalApi.close()`: 关闭弹窗。

- **生命周期事件**:
  - `onConfirm`: 点击确认按钮时的回调。
  - `onCancel`: 点击取消按钮或遮罩层时的回调。
  - `onOpened` / `onClosed`: 弹窗打开/关闭动画结束后的回调。

- **基本配置**:
  - `title`: 设置弹窗标题。
  - `title-tooltip`: 为标题添加提示信息。
  - `class`: 自定义弹窗样式，如宽度 `w-[600px]`。

**示例代码 (`base-demo.vue`):**

```vue
<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

// 创建弹窗实例
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close(); // 点击取消时关闭
  },
  onConfirm() {
    message.info('onConfirm'); // 点击确认时的逻辑
  },
});

// 锁定/解锁弹窗交互
function lockModal() {
  modalApi.lock();
  setTimeout(() => {
    modalApi.unlock();
  }, 3000);
}
</script>

<template>
  <Modal class="w-[600px]" title="基础弹窗示例"> 基础内容 </Modal>
</template>
```

#### **2. 动态与数据交互**

- **动态修改属性 (`dynamic-demo.vue`)**:
  - 使用 `modalApi.setState()` 可以动态地修改弹窗的任意属性（如 `title`, `fullscreen` 等）。这使得在弹窗内部或外部根据条件更新弹窗状态成为可能。

- **内外数据共享 (`shared-data-demo.vue`)**:
  - `modalApi.setData(data)`: 在打开弹窗前，通过此方法将外部数据传递给弹窗。
  - `modalApi.getData()`: 在弹窗内部，通过此方法获取外部传入的数据。

**示例代码 (`dynamic-demo.vue`):**

```vue
<script lang="ts" setup>
// ...
const [Modal, modalApi] = useVbenModal({ title: '动态修改配置示例' });

// 内部更新标题
function handleUpdateTitle() {
  modalApi.setState({ title: '内部动态标题' });
}

// 切换全屏状态
function handleToggleFullscreen() {
  modalApi.setState((prev) => ({ ...prev, fullscreen: !prev.fullscreen }));
}
</script>
```

#### **3. 高级功能**

- **内嵌表单 (`form-modal-demo.vue`)**:
  - 弹窗可以与 `VbenForm` 无缝集成。将表单组件作为 `connectedComponent`，并通过 `setData` 传递表单的初始值 `values`。
  - 在 `onConfirm` 回调中，可以调用表单实例的 `validateAndSubmitForm()` 来执行校验和提交逻辑。

- **内容高度自适应 (`auto-height-demo.vue`)**:
  - 弹窗可以根据其内部内容的高度自动调整自身高度，非常适合展示动态列表或不确定高度的内容。

- **可拖拽 (`drag-demo.vue`)**:
  - 设置 `draggable: true` 即可开启拖拽功能，用户可以通过按住弹窗头部来移动弹窗。

- **遮罩层模糊 (`blur-demo.vue`)**:
  - 通过 `overlayBlur` 属性可以为弹窗的遮罩层添加毛玻璃（模糊）效果，数值越大越模糊。

- **嵌套弹窗 (`nested-demo.vue`)**:
  - 支持在一个弹窗中打开另一个弹窗，实现复杂的交互流程。

#### **4. 轻量级快捷弹窗 (`index.vue`)**

除了使用 `useVbenModal` 创建组件式弹窗外，项目还提供了几个便捷的函数式调用方法，用于快速创建轻量级提示框：

- `alert({ content, icon })`: 显示一个提示框。
- `confirm({ content, icon, beforeClose })`: 显示一个确认框，支持在关闭前执行异步操作。
- `prompt({ content, icon, componentProps })`: 显示一个带输入框的提示，用于获取用户输入。

**示例代码 (`index.vue`):**

```javascript
import { alert, confirm, prompt } from '@vben/common-ui';

// Alert 弹窗
function openAlert() {
  alert({
    content: '这是一个弹窗',
    icon: 'success',
  });
}

// Confirm 弹窗
function openConfirm() {
  confirm({
    content: '这是一个确认弹窗',
    icon: 'question',
  }).then(() => {
    message.success('用户确认了操作');
  });
}

// Prompt 弹窗
async function openPrompt() {
  prompt <
    string >
    {
      content: '中午吃了什么？',
    }.then((res) => {
      message.success(`用户输入了：${res}`);
    });
}
```

#### **5. 内嵌表单示例**

下面是一个关于如何在 Vben Admin 中创建一个内嵌表单的 Modal 弹窗的示例，代码来源于您提供的 `views/examples/modal/form-modal-demo.vue` 和 `views/examples/modal/index.vue` 文件。

这个过程主要分为两部分：

1.  **创建弹窗内容组件**：这个组件包含了 `VbenForm` 和 `VbenModal` 的定义和交互逻辑。
2.  **在父组件中调用弹窗**：通过 `useVbenModal` 创建的 API 来打开弹窗并传递数据。

---

**示例：创建内嵌表单的弹窗**

**第 1 步：创建弹窗内容组件 (`form-modal-demo.vue`)**

这是弹窗的核心，它定义了表单的结构和弹窗的行为。

```vue
<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormModelDemo',
});

// 1. 使用 useVbenForm 创建表单实例
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit, // 绑定提交函数
  schema: [
    {
      component: 'Input',
      fieldName: 'field1',
      label: '字段1',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'field2',
      label: '字段2',
      rules: z.string().min(1, { message: '最少输入1个字符' }),,
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
      fieldName: 'field3',
      label: '字段3',
      rules: 'required',
    },
  ],
  showDefaultActions: false, // 隐藏表单自带的提交和重置按钮
});

// 2. 使用 useVbenModal 创建弹窗实例
const [Modal, modalApi] = useVbenModal({
  title: '内嵌表单示例',
  onCancel() {
    modalApi.close(); // 点击取消按钮时关闭弹窗
  },
  // 点击确认按钮时的回调
  async onConfirm() {
    // 调用表单的验证并提交方法
    await formApi.validateAndSubmitForm();
  },
  // 弹窗打开/关闭状态改变时的回调
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 从 modalApi 获取外部传入的数据
      const { values } = modalApi.getData<Record<string, any>>();
      if (values) {
        // 将数据设置到表单中
        formApi.setValues(values);
      }
    }
  },
});

// 3. 定义表单的提交逻辑
function onSubmit(values: Record<string, any>) {
  message.loading({
    content: '正在提交中...',
    duration: 0,
    key: 'is-form-submitting',
  });
  modalApi.lock(); // 锁定弹窗，防止重复操作
  setTimeout(() => {
    modalApi.close(); // 关闭弹窗
    message.success({
      content: `提交成功：${JSON.stringify(values)}`,
      key: 'is-form-submitting',
    });
  }, 3000);
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
```

**代码解析:**

1.  **创建表单**：使用 `useVbenForm` 创建一个表单实例 `Form` 和其控制器 `formApi`。我们通过 `schema` 定义表单字段，并通过 `handleSubmit` 关联表单的提交函数。
2.  **创建弹窗**：使用 `useVbenModal` 创建弹窗实例 `Modal` 和其控制器 `modalApi`。
3.  **数据交互**：
    - 在 `onOpenChange` 事件中，我们判断弹窗是否为打开状态。如果是，就通过 `modalApi.getData()` 获取从外部传入的数据，并使用 `formApi.setValues()` 将这些数据填充到表单中。
    - 在 `onConfirm` 事件中，我们调用 `formApi.validateAndSubmitForm()`，它会先触发表单验证，如果验证通过，则会执行我们定义的 `onSubmit` 函数。
4.  **提交处理**：`onSubmit` 函数是表单验证成功后执行的逻辑。示例中模拟了一个异步请求，在请求期间锁定了弹窗，请求成功后关闭弹窗并给出提示。

---

**第 2 步：在父组件中调用 (`index.vue`)**

在需要触发这个弹窗的页面（或组件）中，我们同样使用 `useVbenModal` 来连接并控制它。

```vue
<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';
import { Button } from 'ant-design-vue';
import FormModalDemo from './form-modal-demo.vue'; // 引入上一步创建的组件

// 1. 使用 useVbenModal 连接到弹窗组件
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

// 2. 打开弹窗并传递数据
function openFormModal() {
  formModalApi
    // 使用 setData 传递表单的初始值
    .setData({
      values: { field1: '外部传入的值', field2: '123' },
    })
    // 打开弹窗
    .open();
}
</script>

<template>
  <Page title="弹窗组件示例">
    <FormModal />

    <Card title="表单弹窗示例">
      <p>弹窗与表单结合</p>
      <template #actions>
        <Button type="primary" @click="openFormModal"> 打开表单弹窗 </Button>
      </template>
    </Card>
  </Page>
</template>
```

**代码解析:**

1.  **连接组件**：使用 `useVbenModal` 并传入 `connectedComponent: FormModalDemo` 选项，将 `formModalApi` 和我们创建的表单弹窗组件关联起来。
2.  **传递数据并打开**：在 `openFormModal` 函数中，我们链式调用：
    - `setData({ values: { ... } })`: 将一个包含 `values` 属性的对象传递给弹窗。这个 `values` 对象就是表单的初始数据。
    - `.open()`: 打开弹窗。

通过这种方式，我们实现了父组件与弹窗内表单的数据解耦和清晰的逻辑分离。

好的，通过分析 `views/examples/drawer` 文件夹下的示例文件，我为您总结了 `Vben Drawer` (抽屉) 组件的使用文档。

---

### **Vben Drawer组件**

`Vben Drawer` 是一个从屏幕边缘滑出的面板组件，常用于展示详细信息、表单填写等场景。它通过 `useVbenDrawer` Hook 进行创建和管理，具有高度的灵活性和可配置性。

#### **1. 核心用法 (`index.vue`, `base-demo.vue`)**

- **创建与连接**:
  - 使用 `useVbenDrawer` Hook 创建抽屉实例 (`Drawer`) 和其控制器 (`drawerApi`)。
  - 通过 `connectedComponent` 选项，可以将抽屉的内容和逻辑拆分到独立的 `.vue` 文件中，使代码结构更清晰。

- **打开与关闭**:
  - `drawerApi.open()`: 打开抽屉。
  - `drawerApi.close()`: 关闭抽屉。

- **基本配置与事件**:
  - `title`: 设置抽屉标题。
  - `placement`: 设置抽屉滑出的方向，可选值为 `'right'`, `'left'`, `'top'`, `'bottom'`。
  - `onConfirm` / `onCancel`: 点击确认/取消按钮时的回调函数。
  - `onClosed`: 关闭动画结束后的回调。

**示例代码 (`index.vue` 和 `base-demo.vue`):**

```vue
// index.vue - 父组件
<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';
import BaseDemo from './base-demo.vue';

// 1. 连接到抽屉内容组件
const [BaseDrawer, baseDrawerApi] = useVbenDrawer({
  connectedComponent: BaseDemo,
});

// 2. 打开抽屉并指定位置
function openBaseDrawer(placement: DrawerPlacement = 'right') {
  baseDrawerApi.setState({ placement }).open();
}
</script>
<template>
  <BaseDrawer />
  <Button type="primary" @click="openBaseDrawer('right')"> 右侧打开 </Button>
</template>

// base-demo.vue - 抽屉内容组件
<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

// 3. 在内容组件中创建抽屉实例
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  // ... 其他配置
});
</script>
<template>
  <Drawer title="基础抽屉示例"> 抽屉内容 </Drawer>
</template>
```

#### **2. 特性与功能**

- **动态配置 (`dynamic-demo.vue`)**:
  - 使用 `drawerApi.setState()` 方法可以从外部或内部动态修改抽屉的任何属性（如 `title`, `loading` 等）。

- **数据共享 (`shared-data-demo.vue`)**:
  - `drawerApi.setData(data)`: 在打开抽屉前，通过此方法将数据传递到抽屉内部。
  - `drawerApi.getData()`: 在抽屉组件内部，通过此方法获取外部传入的数据。

- **内嵌表单 (`form-drawer-demo.vue`)**:
  - 与 `VbenForm` 组件无缝集成。通过 `setData` 传入表单初始值 `values`。
  - 在 `onConfirm` 回调中调用表单的 `submitForm()` 方法，实现验证和提交一体化。

- **内容高度自适应 (`auto-height-demo.vue`)**:
  - 当抽屉内容高度超过可视区域时，会自动出现滚动条，无需手动计算。
  - 可以通过 `drawerApi.setState({ loading: true })` 来显示加载状态，常用于内容需要异步加载的场景。

- **在指定容器内打开 (`in-content-demo.vue`)**:
  - 默认情况下，抽屉会覆盖整个页面。通过配置可以使其仅在父级内容区域内显示，不遮挡侧边栏和顶部导航。
  - 设置 `destroyOnClose: false` 可以在抽屉关闭后不清空内部状态（如输入框内容），实现类似 `KeepAlive` 的效果。

- **遮罩层模糊 (`index.vue`)**:
  - 通过 `setState({ overlayBlur: 5 })` 可以为抽屉的遮罩层添加毛玻璃（模糊）效果。

#### **3. 内嵌表示例代码 (`form-drawer-demo.vue`)**

```vue
<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';

// 1. 定义表单
const [Form, formApi] = useVbenForm({
  schema: [
    /* ...表单字段定义... */
  ],
  showDefaultActions: false,
});

// 2. 定义抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  title: '内嵌表单示例',
  async onConfirm() {
    // 3. 确认时触发表单提交
    await formApi.submitForm();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 4. 打开时设置表单数据
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
```

### **图标(Icon)使用文档**

Vben Admin 项目深度集成了图标方案，提供了多种灵活的方式来使用图标，主要包括 Iconify、本地 SVG 图标和图标选择器组件。

#### **1. Iconify 图标库 (推荐)**

项目集成了 [Iconify](https://icon-sets.iconify.design/)，它是一个海量的图标库集合，包含了 Material Design Icons (mdi), Ant Design Icons, Font Awesome 等超过200,000个图标。这是最推荐的使用方式。

**用法**:

你可以直接将 Iconify 图标作为 Vue 组件来使用。组件名称遵循 `@vben/icons` 规范。

- **命名**: 组件名由 `[IconSet]` + `[IconName]` 组成，例如 `MdiGithub`、`MdiGoogle`。
- **样式**: 可以像普通 HTML 元素一样，通过 `class` 属性来控制图标的大小、颜色等。

**示例代码 (`index.vue`)**:

```vue
<script lang="ts" setup>
// 从 @vben/icons 导入需要的图标
import { MdiGithub, MdiGoogle, MdiQqchat, MdiWechat } from '@vben/icons';
</script>

<template>
  <Card title="Iconify">
    <div class="flex items-center gap-5">
      <MdiGithub class="size-8" />

      <MdiGoogle class="size-8 text-red-500" />

      <MdiQqchat class="size-8 text-green-500" />
      <MdiWechat class="size-8" />
    </div>
  </Card>
</template>
```

#### **2. 本地 SVG 图标**

对于项目特有或者需要离线使用的图标，可以将其作为 SVG 文件存放在项目中，并像 Iconify 图标一样作为组件导入和使用。

**用法**:

本地 SVG 图标也被封装成了 Vue 组件。

- **命名**: 同样遵循 `@vben/icons` 规范，例如 `SvgAvatar1Icon`、`SvgBellIcon`。
- **存放位置**: 放在 `packages/icons/src/svg/icons` 文件夹， `packages/icons/src/svg/index.ts` 文件中导出。

**示例代码 (`index.vue`)**:

```vue
<script lang="ts" setup>
// 从 @vben/icons 导入本地 SVG 图标
import {
  SvgAvatar1Icon,
  SvgBellIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';
</script>

<template>
  <Card title="Svg Icons">
    <div class="flex items-center gap-5">
      <SvgAvatar1Icon class="size-8" />
      <SvgBellIcon class="size-8" />
      <SvgCardIcon class="size-8" />
      <SvgDownloadIcon class="size-8" />
    </div>
  </Card>
</template>
```

#### **3. Tailwind CSS 类名方式**

可以直接通过 `class` 的方式使用 Iconify 图标，无需在 `<script>` 中导入。

**用法**:

- **格式**: `icon-[<icon-set>--<icon-name>]`。
- **优点**: 非常便捷，适合在模板中快速添加图标。

**示例代码 (`index.vue`)**:

```vue
<template>
  <Card title="Tailwind CSS">
    <div class="flex items-center gap-5 text-3xl">
      <span class="icon-[ant-design--alipay-circle-outlined]"></span>
      <span class="icon-[ant-design--account-book-filled]"></span>
      <span class="icon-[svg-spinners--wind-toy]"></span>
      <span class="icon-[svg-spinners--blocks-wave]"></span>
    </div>
  </Card>
</template>
```

## 基础页面

### 列表页模版

此文档旨在分析角色管理页面的实现方式，并提供一个可复用的模板和最佳实践，用于快速创建其他数据列表管理页面。当需要生成列表页时，可以参照这个模板来构建

#### **一、 核心设计思想**

该页面遵循关注点分离 (SoC) 的原则，将页面结构、配置和业务逻辑拆分到不同的文件中，使得代码更易于维护和复用。

- `index.vue`: 页面主入口，负责组合表格、抽屉和处理用户交互事件。
- `data.ts`: 配置文件，负责定义表格列 (`columns`)、搜索表单 (`GridFormSchema`) 和编辑/新建表单 (`FormSchema`) 的结构。
- `components/form.vue`: 独立的表单组件，用于新建和编辑数据，被 `index.vue` 中的抽屉 (Drawer) 调用。
- `hooks`: hooks 文件夹，负责存放 useXXX 等封装业务逻辑的 hooks 方法

#### **二、 文件结构详解**

##### **1. `data.ts` - 配置文件**

这是创建管理页面的第一步。将所有静态配置（如表单结构、表格列）集中在此，使得主页面 (`index.vue`) 的逻辑更纯粹。

- **`useGridFormSchema()`**: 定义了表格上方的搜索表单的字段。
  - `component`: 指定要渲染的组件类型 (e.g., 'Input', 'Select')。
  - `fieldName`: 字段名，用于数据绑定。
  - `label`: 字段标签。
- **`useColumns()`**: 定义了 `VxeTable` 的列。
  - **自定义渲染**: 使用 `cellRender` 来自定义单元格的显示方式。
    - `name: 'CellSwitch'`: 渲染成一个开关组件，常用于修改状态。通过 `attrs: { beforeChange: onStatusChange }` 可以在状态改变前执行异步确认操作。
    - `name: 'CellOperation'`: 渲染成标准的操作按钮组（如编辑、删除）。通过 `attrs: { onClick: onActionClick }` 将点击事件传递给父组件处理。
- **`useFormSchema()`**: 定义了在抽屉中用于新建/编辑角色的表单字段。

##### **2. `components/form.vue` - 新建/编辑表单组件**

这是一个独立的、可复用的表单组件，被包裹在抽屉中。

- **初始化**:
  - 使用 `useVbenForm` 创建表单实例，并从 `data.ts` 引入 `useFormSchema` 来定义表单结构。
  - 使用 `useVbenDrawer` 创建抽屉实例，并定义其核心逻辑。
- **核心逻辑**:
  - `onOpenChange`: 抽屉打开时触发。通过 `drawerApi.getData()` 获取从列表页传来的数据。
    - 如果 `data` 存在，则为 **编辑模式**，使用 `formApi.setValues(data)` 回填表单数据。
    - 如果 `data` 不存在，则为 **新建模式**，表单为空。
  - `onConfirm`: 点击抽屉的确认按钮时触发。
    - 调用 `formApi.validate()` 进行表单校验。
    - 校验成功后，调用 `createRole` 或 `updateRole` API 提交数据。
    - 成功后，触发 `emits('success')` 事件通知父组件刷新列表，并关闭抽屉。

**示例代码 (`components/form.vue`):**

```vue
<script lang="ts" setup>
// ...
const [Form, formApi] = useVbenForm({
  schema: useFormSchema(), // 从 data.ts 引入
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock(); // 锁定抽屉防止重复提交
    // 根据是否有 ID 判断是更新还是创建
    (id.value ? updateRole(id.value, values) : createRole(values)).then(() => {
      emits('success');
      drawerApi.close();
    });
    // ...
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      if (data) {
        // 编辑模式：回填数据
        formApi.setValues(data);
      }
    }
  },
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
```

##### **3. `index.vue` - 列表页面**

这是页面的主容器，负责将各个部分组合起来。

- **初始化**:
  - `useVbenDrawer`: 创建一个与 `Form` 组件连接的抽屉实例。
  - `useVbenVxeGrid`: 创建表格实例，并整合了搜索表单和表格的配置。
    - `formOptions`: 传入 `useGridFormSchema()` 的配置，并设置 `submitOnChange: true` 使表单值变化时自动刷新表格。
    - `gridOptions`: 传入 `useColumns()` 的配置，并定义数据请求代理 `proxyConfig`。
- **数据请求**:
  - `proxyConfig.ajax.query`: 定义了获取列表数据的异步函数。它会自动接收分页信息 (`page`) 和搜索表单的值 (`formValues`) 作为参数，然后调用 `getRoleList` API。
- **核心交互逻辑**:
  - **新建**: 点击 "新建" 按钮，调用 `formDrawerApi.setData({}).open()` 打开一个空的表单抽屉。
  - **编辑**: `onActionClick` 中，当 `code` 为 `'edit'` 时，调用 `formDrawerApi.setData(row).open()` 打开抽屉并传入当前行的数据。
  - **删除**: `onActionClick` 中，当 `code` 为 `'delete'` 时，显示确认提示，然后调用 `deleteRole` API，成功后调用 `onRefresh` 刷新表格。
  - **刷新**: `onRefresh` 函数调用 `gridApi.query()` 来重新加载表格数据。
  - **监听成功事件**: 在 `<FormDrawer @success="onRefresh" />` 上监听 `success` 事件。当 `form.vue` 成功保存数据后，会触发此事件来刷新列表。

**示例代码 (`index.vue`):**

```vue
<script lang="ts" setup>
// ...
// 1. 创建与 Form.vue 连接的抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 2. 创建表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  // 搜索表单配置
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  // 表格配置
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getRoleList({
            /* ...params */
          });
        },
      },
    },
    // ...
  } as VxeTableGridOptions<SystemRoleApi.SystemRole>,
});

// 3. 处理表格操作列的点击事件
function onActionClick(e: OnActionClickParams<SystemRoleApi.SystemRole>) {
  switch (e.code) {
    case 'delete':
      onDelete(e.row);
      break;
    case 'edit':
      onEdit(e.row);
      break;
  }
}

// 4. 编辑操作
function onEdit(row: SystemRoleApi.SystemRole) {
  formDrawerApi.setData(row).open(); // 打开抽屉并传入数据
}

// 5. 刷新表格
function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid :table-title="$t('system.role.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.role.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
```
