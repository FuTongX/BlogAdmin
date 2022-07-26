<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  beforeMount() {
    this.$store.dispatch("GetTagList");
    this.$store.dispatch("GetCategoryList");
    this.$store.dispatch("GetCategoryListNoLeaf");
  },
};
</script>

<style lang="scss" scoped>
</style> 