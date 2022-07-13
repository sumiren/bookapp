<template>
  <v-app>
    <Header :title="title" />

    <!-- ナビゲーション (タブレット・PC) -->
    <div v-if="!isMobile">
      <v-navigation-drawer
        v-model="isNavigationShown"
        app
        clipped
        floating
        permanent
        color="thin"
        width="180"
      >
        <navigation-list />
      </v-navigation-drawer>
    </div>
    <!-- /ナビゲーション (タブレット・PC) -->

    <!-- ナビゲーション (モバイル) -->
    <transition name="mobileNavigation">
      <div class="mobileNavigation" v-if="isMobile && isNavigationShown">
        <!-- 追加 UI の slot -->
        <div class="d-flex justify-end pa-3">
          <slot name="add-ui" class="ml-auto" />
        </div>
        <!-- /追加 UI の slot -->

        <v-bottom-navigation
          app
          elevation="0"
        >
          <div class="w-100">
            <navigation-list />
          </div>
        </v-bottom-navigation>
      </div>
    </transition>
    <!-- /ナビゲーション (モバイル) -->

    <v-main>
      <v-container class="pa-4 px-md-12 py-md-10">
        <!-- 検索 UI の slot -->
        <div class="mb-4" v-if="isMobile">
          <slot name="search-ui"></slot>
        </div>
        <!-- /検索 UI の slot -->

        <v-row
          justify="end"
          align="center"
          class="mb-4"
          v-if="!isMobile"
        >
          <!-- 追加 UI の slot -->
          <v-col cols="auto" class="mr-2">
            <slot name="add-ui"></slot>
          </v-col>
          <!-- /追加 UI の slot -->

          <!-- 検索 UI の slot -->
          <v-col cols="6">
            <slot name="search-ui"></slot>
          </v-col>
          <!-- /検索 UI の slot -->
        </v-row>

        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const { $C } = useNuxtApp()
import { NAVIGATION_ITEM } from '~/common/constants'
const route = useRoute()
const { isNavigationShown } = useNavigation()
const { isMobile } = useBreakpoint()

const title = computed(() => {
  const currentPage = $C.NAVIGATION_ITEMS.find((o: NAVIGATION_ITEM) => {
    return o.path === '/' + (route?.name as string)
  })
  return currentPage ? currentPage.title : ''
})
</script>

<style lang="scss" scoped>
.v-bottom-navigation {
  height: auto !important;
  position: relative !important
}

.mobileNavigation {
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.mobileNavigation-enter-active,
.mobileNavigation-leave-active {
  transition: 0.3s ease;
}

.mobileNavigation-enter-from,
.mobileNavigation-leave-to {
  transform: translateY(100%);
}
</style>
