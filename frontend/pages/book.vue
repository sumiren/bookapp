<template>
  <default-layout>
    <template v-slot:add-ui>
      <v-btn
        color="accent"
        size="x-large"
        icon="mdi-plus"
        @click="addBook"
        v-if="isMobile"
        class="mobileBookAddButton"
      />

      <v-btn
        color="accent"
        size="large"
        prepend-icon="mdi-plus"
        @click="addBook"
        v-else
      >
        書籍を追加する
      </v-btn>
    </template>

    <template v-slot:search-ui>
      <v-text-field
        v-model="textToSearch"
        label="書籍を探す"
        variant="filled"
        prepend-inner-icon="mdi-magnify"
        clearable
        clear-icon="mdi-close"
        hide-details
        density="comfortable"
      />
    </template>

    <v-tabs
      v-model="currentTab"
      :fixed-tabs="isMobile"
      background-color="thin"
      color="primary"
      class="mb-6"
    >
      <v-tab
        v-for="item in tabItems"
        :key="item"
        :value="item"
        selected-class="bg-accent"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-window v-model="currentTab">
      <v-window-item
        v-for="item in tabItems"
        :key="item"
        :value="item"
      >
        <p>Hello! {{ item }}</p>
      </v-window-item>
    </v-window>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '~/layouts/default.vue'

const { isMobile } = useBreakpoint()

const textToSearch = useState<string>('textToSearch', () => '')
const tabItems = ['つんどく', '読みかけ', '読了']
const currentTab = useState<string | null>('currentTab', () => null)

const addBook = () => {
  alert('本を追加したい 🚀🚀')
}
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

::v-deep(.mobileBookAddButton i) {
  font-size: 2.4rem;
}

.v-tabs {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    margin-right: calc(50% - 50vw);
    margin-left: calc(50% - 50vw);
  }
}
</style>
