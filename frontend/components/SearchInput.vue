<script setup lang="ts">
export type SearchInputEvent = {
  value: string
}

const props = defineProps<{
  inputHandler: (e: SearchInputEvent) => unknown,
  placeHolder: string
}>()

const handler = function(event: Event){
  if (event.target instanceof HTMLInputElement) {
    props.inputHandler({value: event.target.value})
  }
}
</script>

<template>
  <input @input="handler" v-bind:placeholder="placeHolder" class="w-70 bg-white text-gray-800 border rounded px-3 py-2 focus:ring focus:ring-slate-200 ring-slate-100 outline-none transition duration-100" />
</template>


