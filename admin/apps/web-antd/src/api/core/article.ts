import { requestClient } from '#/api/request';

export interface ArticleTag {
  _id?: string;
  id?: string;
  title: string;
  color: string;
  state: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  intro: string;
  content: string;
  tagid: string;
  tag?: Pick<ArticleTag, 'title' | 'color' | 'state'>;
  top: number;
  watch: number;
  likes: number;
  state: number;
  img?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleListResponse {
  list: ArticleItem[];
  total: number;
}

export interface ArticleQuery {
  page?: number;
  limit?: number;
}

export interface CreateArticlePayload {
  title: string;
  intro: string;
  content: string;
  tagid: string;
  img?: string;
}

export type UpdateArticlePayload = Partial<CreateArticlePayload>;

export interface UpdateArticleTopPayload {
  id: string;
  top: number;
}

export interface CreateTagPayload {
  title: string;
  color: string;
}

export interface CommentItem {
  id: string;
  name: string;
  content: string;
  aid: string;
  createdAt?: string;
}

export function fetchArticleListApi(params: ArticleQuery) {
  return requestClient.get<ArticleListResponse>('/article', { params });
}

export function fetchArticleDetailApi(id: string) {
  return requestClient.get<ArticleItem>(`/article/${id}`);
}

export function createArticleApi(data: CreateArticlePayload) {
  return requestClient.post<ArticleItem>('/article', data);
}

export function updateArticleApi(id: string, data: UpdateArticlePayload) {
  return requestClient.patch<ArticleItem>(`/article/${id}`, data);
}

export function deleteArticleApi(id: string) {
  return requestClient.delete(`/article/${id}`);
}

export function updateArticleTopApi(data: UpdateArticleTopPayload) {
  return requestClient.post<ArticleItem>('/article/top', data);
}

export function fetchArticleTagsApi() {
  return requestClient.get<ArticleTag[]>('/article/tag');
}

export function createArticleTagApi(data: CreateTagPayload) {
  return requestClient.post<ArticleTag>('/article/tag', data);
}

export function deleteArticleTagApi(id: string) {
  return requestClient.delete('/article/tag', { data: { id } });
}

export function fetchArticleCommentsApi(id: string) {
  return requestClient.get<CommentItem[]>(`/article/${id}/comment`);
}
