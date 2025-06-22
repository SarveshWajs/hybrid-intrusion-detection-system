<template>

  <div class="container-fluid">
    <div class="mx-auto px-10" style="border-top: 1px solid lightgray"></div>
    <div class="flex justify-between items-center desktop pb-5">
      <div class="lg:pt-7 text-[15px]">
        Copyright &#169; 2025 SarveshWajs
      </div>
      
    </div>
  </div>

  <div class="flex justify-between items-center mobile pb-20 pt-7">
    

    <div class="p-7 text-[15px] mx-auto text-center">
      Copyright &#169; 2025 SarveshWajs
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";



const footerTab = ref("1");
</script>

<style scoped>
.line {
  border-bottom: 1px solid black;
  width: 28%;
  font-weight: bold;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  border: none !important;
}

:deep(.el-collapse-item__content) {
  font-size: 16px;
  border: none !important;
}

:deep(.el-collapse) {
  font-size: 16px;
  border: none !important;
}

.mobile {
  display: none;
}

@media (max-width: 640px) {
  .mobile {
    display: block;
  }

  .desktop {
    display: none;
  }
}

@media (min-width: 1800px) {
  .container-fluid {
    --offset-fluid: 11.7rem !important;
  }
}

@media (max-width: 1800px) {
  .container-fluid {
    --offset-fluid: 4.5rem !important;
  }
}

@media (max-width: 1536px) {
  .container-fluid {
    --offset-fluid: 3rem !important;
  }
}

@media (max-width: 1536px) {
  .container-fluid {
    --offset-fluid: 3rem !important;
  }
}

@media (max-width: 1024px) {
  .container-fluid {
    --offset-fluid: 1.5rem !important;
  }
}

.container-fluid {
  padding-right: var(--offset-fluid);
  padding-left: var(--offset-fluid);
}
</style>
