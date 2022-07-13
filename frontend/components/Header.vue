<template>
  <v-app-bar
    app
    flat
    class="px-4 px-sm-6"
    :absolute="isMobile"
  >
    <v-app-bar-nav-icon
      v-if="!simple"
      @click="switchNavigationDisplay"
    />
    <v-app-bar-title class="pl-2 pl-sm-4">
      {{ title }}
    </v-app-bar-title>

    <v-spacer v-if="!simple" />

    <template v-if="!simple">
      <v-icon icon="mdi-account" class="mr-1" />
      <p class="font-weight-medium">demo.user</p>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const { switchNavigationDisplay } = useNavigation()
const { isMobile } = useBreakpoint()

interface Props {
  title: string;
  simple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  simple: false
})
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';
@import 'vuetify/lib/styles/tools/_functions';

.v-app-bar {
  border-bottom: 2px solid rgb(var(--v-theme-thin));
}

.v-toolbar-title {
  font-weight: bold;
  letter-spacing: 0.04em !important;
  transform-origin: left;
  transform: scaleX(0.94);

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    font-size: map-deep-get($typography, h5, size);
  }
}
</style>
