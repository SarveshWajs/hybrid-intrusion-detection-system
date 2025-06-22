<template>
  <div
    class="w-full h-full bg-[white] fixed top-0"
    style="z-index: 99999"
    v-if="isLoading"
  >
    <div class="w-full h-full mx-auto flex items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <div class="spinner"></div>
        <div class="font-bold text-[40px] mt-5">LOADING</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const isLoading = ref(false);

const router = useRouter();
router.beforeEach(() => {
  isLoading.value = true;
});

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style scoped>
.spinner {
  border: 4px solid lightgray;
  border-radius: 50%;
  border-top: 4px solid black;
  width: 140px;
  height: 140px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
