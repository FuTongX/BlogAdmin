import Vuex from "vuex";
import Vue from "vue";
import {
  getTagList,
  getCategoryList,
  getArticleList,
  getCommentList,
  getStatisticsData,
  getLastViewsArticletTop,
  getLastCommentTop,
  getLastCreatedArticletTop,
} from "../api";
// import { cloneDeep } from "lodash";
Vue.use(Vuex);

//该文件用于创建 vuex中的store
//响应动作，发送请求 里面函数(context,value)
//组件中可以直接commit越过 action
const actions = {
  async GetTagList(context) {
    let { data } = await getTagList();
    context.commit("GETTAGLIST", data.list);
  },
  async GetCategoryList(context) {
    let { data } = await getCategoryList();
    context.commit("CATAGORYLIST", data.list);
  },
  async GetCategoryListNoLeaf(context) {
    let { data } = await getCategoryList(false);
    context.commit("CATAGORYLISTNOLEAF", data.list);
  },
  async GetArticleList(context, queryObj) {
    let { data } = await getArticleList(queryObj);
    context.commit("GETARTICLELIST", data);
  },

  async getCommentList(context, queryObj) {
    let { data } = await getCommentList(queryObj);
    context.commit("COMMENTLIST", data);
  },
  async getStatisticsData(context) {
    let { data } = await getStatisticsData();
    context.commit("STATISTICDATA", data);
  },
  async getLastViewsArticletTop(context) {
    let { data } = await getLastViewsArticletTop();
    context.commit("LASTVIEWSARTICLE", data.list);
  },
  async getLastCommentTop(context) {
    let { data } = await getLastCommentTop();
    context.commit("LASTCOMMENT", data.list);
  },
  async getLastCreatedArticletTop(context) {
    let { data } = await getLastCreatedArticletTop();
    context.commit("LASTCREATEARTICLE", data.list);
  },
};

//操作数据 里面函数(state,value)
const mutations = {
  GETTAGLIST(state, value) {
    state.tagsList = value;
  },
  CATAGORYLIST(state, value) {
    state.categoryList = value;
  },
  CATAGORYLISTNOLEAF(state, value) {
    state.categoryListNoLeaf = value;
  },
  GETARTICLELIST(state, value) {
    state.articleList = value;
  },
  COMMENTLIST(state, value) {
    state.commentList = value;
  },
  STATISTICDATA(state, value) {
    state.statisticsData = value;
  },
  LASTCREATEARTICLE(state, value) {
    state.lastCreateArticle = value;
  },
  LASTCOMMENT(state, value) {
    state.lastComment = value;
  },
  LASTVIEWSARTICLE(state, value) {
    state.lastViewsArticle = value;
  },
};

//存储数据
const state = {
  tagsList: [],
  categoryList: [],
  categoryListNoLeaf: [],
  articleList: {},
  commentList: {},
  statisticsData: {},
  lastViewsArticle: [],
  lastComment: [],
  lastCreateArticle: [],
};

//将state中的数据加工 里面的函数(state)
//有些像计算属性
//方便复用
const getters = {
  categoryListNoLeaf(state) {
    return [...state.categoryListNoLeaf];
  },
};

export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters,
});
