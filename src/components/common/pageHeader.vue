<template>
  <!--Region desktop view-->
  <div class="desktop">
    <!--Region no scroll detected-->
    <div class="" v-if="props.scrollPosition == 0">
      
     
      <div
        class="container-fluid py-4 text-[17px] grid text-[#606060] justify-between"
        style="
          grid-template-columns: repeat(2, auto);
          border-bottom: 1px solid #e4e4e4;
        "
      >
        <div class="flex items-center">
          <headerItem
            v-for="(item, index) in headerTabs"
            :key="index"
            :header-tab="item.name"
            :redirect-to="item.redirectTo"
          ></headerItem>
          
        </div>
        <div class="flex items-center">
          
          <div
        class="container-fluid py-5"
       
      >
        <div
          class="grid justify-between items-center"
          style="
            grid-template-columns: repeat(3, auto);
            justify-content: space-between;
          "
        >
         
        
          
        </div>
      </div>
        </div>
      </div>
    </div>
    <!--End region-->
  </div>

  <!--Region Mobile view-->
  <div class="mobile">

   

    <!--Region Side Navbar share view-->
    <div
      class="container-fluid grid py-4 text-[17px] justify-between items-center w-full shared"
      style="
        grid-template-columns: repeat(3, auto);
        border-bottom: 1px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      "
    >
      <div class="" @click="sidenav = true">
        <font-awesome-icon
          icon="fa-solid fa-bars"
          class="h-[25px] w-[35px] ps-2"
        />
      </div>
      
    </div>
    <!--End region-->

    <!--Region Tab Footer-->
    <div class="fixed bottom-0 w-full" style="z-index: 100">
      <div
        class="flex pt-3 text-[12px] font-bold justify-between px-2 bg-[white]"
        style="
          border-bottom: 1px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        "
      >
    
      </div>
    </div>
    <!--End Region-->
  </div>

  <!--Region drawer for search bar-->
  <el-drawer
    v-model="searchDrawer"
    :direction="'ttb'"
    size="157"
    :with-header="false"
    class="text-center text-[30px] relative"
  >
    <div
      class="cursor-pointer"
      @click="searchDrawer = false"
      style="cursor: pointer"
    >
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="h-[25px] w-[25px] top-[20px] right-[20px] absolute z-10"
      />
    </div>
   
  </el-drawer>
  <!--End region-->

  <!--Region drawer for side navbar-->
  <div class="">
    <el-drawer
      v-model="sidenav"
      :direction="'ltr'"
      size="335"
      :withHeader="false"
      class="text-center text-[30px]"
    >
      <div class="h-full overflow-hidden flex flex-col pt-5 relative">
       
        <div class="cursor-pointer" @click="sidenav = false">
          <font-awesome-icon
            icon="fa-solid fa-xmark"
            class="h-[25px] w-[25px] absolute top-[20px] right-[20px] w-[15px]"
          />
        </div>
        <div class="flex flex-col uppercase">
          <headerItem
            v-for="(item, index) in mobileTabs"
            :key="index"
            :header-tab="item.name"
            :redirect-to="item.redirectTo"
            :style="'font-size:17px;margin-end:auto;padding:10px 0 0 0; width:100%; text-align:start;'"
            :tabStyle="'padding-left: 15px; padding-bottom: 10px'"
            :border="'border-bottom: 1px solid #e4e4e4;'"
            @click="sidenav = false"
          ></headerItem>
        </div>

      

        <div class="" style="border-bottom: 1px solid #e4e4e4"></div>

        
        <div
          class="absolute bottom-[30px] text-[15px] font-bold px-3 flex w-full z-1"
          v-if="!langExpand"
        >
          <div class="flex items-center ms-auto">
            <div
              class="text-center border border-1 bg-[black] rounded-[50%] inline-flex p-1 flex-col me-2"
            >
              <font-awesome-icon
                icon="fa-regular fa-user"
                class="h-[20px] w-[20px]"
                style="color: white"
              />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
  <!--End Region-->

  
</template>

<script setup lang="ts">
//#region imports
import { ref, computed, onMounted } from "vue";
import headerItem from "#/components/common/headerItem.vue";
import { useRouter } from "vue-router";

//#endregion

//#region definitions
const router = useRouter();




const language = [
  { name: "English", path: "us", value: "en" },
  { name: "简体中文", path: "simplified", value: "zh-CN" },
  { name: "ไทย", path: "thailand", value: "th" },
];
const customerServiceLink = ref();

const redirect = {
  Home: "/home",
  Product: "/productlist",
  Login: "/login",
  Task: "/Logs",
  Rule: "/rules",
  Model: "/model",
};

const headerTabs = [
  {
    name: "Home Page",
    redirectTo: redirect.Home,
  },
  {
    name: "Logs Page",
    redirectTo: redirect.Task,
  },
  {
     name: "Rules Page",
    redirectTo: redirect.Rule,
  },

    {
     name: "Model Page",
    redirectTo: redirect.Model,
  },
];

const mobileTabs = [
{
    name: "Home Page",
    redirectTo: redirect.Home,
  },
  {
     name: "Logs Page",
    redirectTo: redirect.Task,
  },
    {
     name: "Rules Page",
    redirectTo: redirect.Rule,
  },

    {
     name: "Model Page",
    redirectTo: redirect.Model,
  },


];

const mobileSubTabs = [
{
    name: "common.home_page",
    redirectTo: redirect.Home,
  },
  {
    name: "Task",
    redirectTo: redirect.Task,
  },
];

const props = defineProps<{
  scrollPosition: number;
}>();
const searchQuery = ref("");
const searchDrawer = ref(false);
const sidenav = ref(false);
const langExpand = ref(false);
//#endregion





</script>

<style scoped>
.mobile {
  display: none;
}

.shared {
  display: none;
}

/* Custom styles */
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

@media (max-width: 1280px) {
  .container-fluid {
    --offset-fluid: 1.5rem !important;
  }
}

@media (max-width: 1024px) {
  .container-fluid {
    --offset-fluid: 0.5rem !important;
  }
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
  .shared {
    display: flex;
  }
}

@media (max-width: 768px) {
  .medium {
    display: none;
  }
}

.container-fluid {
  --offset-fluid: 11.7rem;
  padding-right: var(--offset-fluid);
  padding-left: var(--offset-fluid);
}

.supportMail:hover {
  cursor: pointer;
  color: darkgray;
  transition: color 0.5s ease;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  background-color: black !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px black inset !important;
  border-right: none !important;
}

:deep(.el-input__wrapper) {
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  border-right-color: transparent !important;
}

.search-btn:hover {
  background-color: rgb(58, 58, 58);
}

.custom-drawer .el-drawer__header {
  font-size: 30px;
}

:deep(.el-drawer__body) {
  padding: 0 0 0 0 !important;
}

.selection:hover {
  background-color: #606266 !important;
  color: white !important;
}
.no-focus:focus {
  outline: none; /* Removes the default focus outline */
  box-shadow: none; /* Prevents any focus shadow */
}

.cursor {
  cursor: pointer;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: black; /* Change the background color when checked */
  border-color: black; /* Change the border color when checked */
}

:deep(.el-checkbox__inner:hover) {
  border-color: black; /* Change the border color on hover */
}

.signout {
  cursor: pointer;
}

.signout:hover {
  opacity: 0.7;
}
</style>
