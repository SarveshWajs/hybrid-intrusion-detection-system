<template>
  <router-link
    :to="redirectTo"
    :class="[{ isActive: isActive }]"
    :style="style"
    v-if="redirectTo !== '/contact'"
    @click="handleRouteChange"
  >
    <div class="pe-[33px]" :style="tabStyle">
      {{ $t(headerTab) }}
    </div>
    <div class="" :style="border"></div>
  </router-link>
  <div class="" v-else>
    <div
      class="pe-[33px] cursor-pointer"
      :style="tabStyle"
      @click="redirectCustomerService"
    >
      {{ $t(headerTab) }}
    </div>
    <div class="" :style="border"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Define the props passed from the parent component
const props = defineProps<{
  headerTab: string;
  redirectTo: string;
  style?: string;
  tabStyle?: string;
  border?: string;
}>();
const key = ref(Date.now())
const route = useRoute();
const router = useRouter(); // Access the router instance

const customerServiceLink = ref();
const isActive = computed(() => {
  if (route.path == props.redirectTo) {
    return true;
  } else {
    return false;
  }
});





const redirectCustomerService = async () => {
  window.location.href = customerServiceLink.value;
};
function handleRouteChange() {
  // Manually force a refresh of the current route if it's the same route
  if (route.path === props.redirectTo) {
   router.replace('').then(()=> {
    router.go(0)
   })
  }
}
</script>

<style scoped>
.isActive {
  @apply font-bold text-[black];
}
</style>
