import request from "../utils/request";

// 登录验证接口
export function Login(data) {
  return request({ url: "/login", method: "post", data });
}

export function editUserInfo(data) {
  return request({ url: "/user", method: "put", data });
}

//谚语
export function createOneProverb(data) {
  return request({ url: "/proverb", method: "post", data });
}

export function deleteProverbById(id) {
  return request({ url: "/proverb", method: "delete", data: { id } });
}

export function getProverbList() {
  return request({ url: "/proverb", method: "get" });
}

export function editOneProverb(data) {
  return request({ url: "/proverb", method: "put", data });
}

//文章相关
export function addArticle(dataObj) {
  return request({ url: "/article", method: "post", data: dataObj });
}

export function deleteArticle(id) {
  return request({ url: "/article", method: "delete", data: { id } });
}

export function getArticleList(queryObj) {
  return request({ url: "/article", method: "get", params: queryObj });
}

export function editArticle(dataObj) {
  return request({ url: "/article", method: "put", data: dataObj });
}

export function editArticlePublic(dataObj) {
  return request({ url: "/articlepublic", method: "put", data: dataObj });
}

//分类相关
export function getCategoryList(hasLeaf) {
  return request({ url: "/category", method: "get", params: { hasLeaf } });
}

/**
 * @param  { {"name":"技术111", "level":2,"parentId":17} } dataObj
 * @returns { {  "meta": {  "msg": "已有此标签",  "status": 400 }} }
 */
export function setCategory(dataObj) {
  return request({ url: "/category", method: "post", data: dataObj });
}

export function deleteCategory(dataObj) {
  return request({ url: "/category", method: "delete", data: dataObj });
}
export function editCategory(dataObj) {
  return request({ url: "/category", method: "put", data: dataObj });
}

//标签相关

export function getTagList() {
  return request({ url: "/tag", method: "get" });
}

export function setTag(dataObj) {
  return request({ url: "/tag", method: "post", data: dataObj });
}

export function deleteTag(dataObj) {
  return request({ url: "/tag", method: "delete", data: dataObj });
}

export function editTag(dataObj) {
  return request({ url: "/tag", method: "put", data: dataObj });
}

export function getCommentList(dataObj) {
  return request({ url: "/comment", method: "get", params: dataObj });
}

export function deleteCommentById(id) {
  return request({ url: "/comment", method: "delete", data: { id } });
}

export function editCommentState(id, state) {
  return request({ url: "/comment", method: "put", data: { id, state } });
}

export function getStatisticsData() {
  return request({ url: "/statistics", method: "get" });
}

export function getLastViewsArticletTop() {
  return request({ url: "/lastviewsarticle", method: "get" });
}

export function getLastCommentTop() {
  return request({ url: "/lastcomment", method: "get" });
}

export function getLastCreatedArticletTop() {
  return request({ url: "/lastcreatearticle", method: "get" });
}

export function getArticleCategory() {
  return request({ url: "/articlecategory", method: "get" });
}

export function getVisitor() {
  return request({ url: "/visitor", method: "get" });
}
