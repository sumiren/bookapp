<template>
  <div>
    <div class="flex items-center justify-between mb-10 px-3 md:justify-flex-start">
      <PlusIcon class="addButton" style="display:block"></PlusIcon>
      <SearchInput v-bind:input-handler="handleSearchInput" place-holder="書籍を探す"></SearchInput>
    </div>
    <nav class="tab-nav">
      <ul class="flex w-full bg-slate-100" ref="tabList">
        <li class="w-1/3 md:w-32">
          <button @click="showBooks" class="tabItemButton h-full w-full p-3" v-bind:class="{'is-active': bookStatusToShow === 'tsundoku'}" data-bookstatus="tsundoku">つんどく
          </button>
        </li>
        <li class="w-1/3 md:w-32">
          <button @click="showBooks" class="tabItemButton h-full w-full p-3" v-bind:class="{'is-active': bookStatusToShow === 'doing'}" data-bookstatus="doing">読みかけ
          </button>
        </li>
        <li class="w-1/3 md:w-32">
          <button @click="showBooks" class="tabItemButton h-full w-full p-3" v-bind:class="{'is-active': bookStatusToShow === 'done'}" data-bookstatus="done">読了
          </button>
        </li>
      </ul>
    </nav>
    <div class="pain">
      <ul class="books">
        <li v-for="item in books" :key="item.id" class="border-b  border-slate-200 pl-5 py-5">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="tabs-and-pain">

    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/solid';
import SearchInput, { SearchInputEvent } from '../components/SearchInput.vue';

navigateTo('/login')
</script>

<style lang="scss" scoped>
.addButton {
  @apply bg-yellow-200 w-16 h-16 p-3 mr-3;
  border-radius: 50%;
  box-shadow: 0 3px 3px 0 rgba(#000, 0.161);
}

.tabItemButton{
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  color: theme("colors.slate.300");
  &.is-active{
    background-color: theme("colors.yellow.200");
    color: theme("colors.slate.500");
  }
}

</style>


