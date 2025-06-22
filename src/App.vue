<template>
  <div class="h-[100vh] overflow-auto page" @scroll="handleScroll">
    <pageHeader
      v-if="!hideHeader"
      :scrollPosition="scrollPosition"
    ></pageHeader>
    <router-view :key="$route.fullPath"></router-view>
    <pagefooter v-if="!hideFooter"></pagefooter>
    <cookies></cookies>
    <loading></loading>
  </div>
</template>

<script setup lang="ts">
//#region Import
import { computed, onMounted, ref } from "vue";
import pageHeader from "#/components/common/pageHeader.vue";
import pagefooter from "#/components/common/footer.vue";
import { useRoute, useRouter } from "vue-router";
import loading from "#/components/common/loading.vue";
//#endregion

//#region definitions
const route = useRoute();
const router = useRouter();
const scrollPosition = ref(0);
//#endregion

//#region hooks
const hideHeader = computed(() => {
  return route.meta.hideHeader;
});

const hideFooter = computed(() => {
  return route.meta.hideFooter;
});


//#endregion

//#region functions
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const currentScrollPosition = target.scrollTop;

  scrollPosition.value = currentScrollPosition;
};

const scrollToTop = () => {
  const scrollableContainer = document.querySelector(".page");
  if (scrollableContainer) {
    scrollableContainer.scrollTo({ top: 0, behavior: "smooth" });
  }
};
//#endregion
</script>

<style scoped>
.background {
  background-color: white;
}
</style>
