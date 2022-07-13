<template>
  <v-text-field
    label="パスワード"
    variant="underlined"
    prepend-icon="mdi-lock"
    :append-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
    :type="isPasswordShown ? 'text' : 'password'"
    @click:append="isPasswordShown = !isPasswordShown"
  />
</template>

<script setup lang="ts">
const isPasswordShown = useState<Boolean>('isPasswordShown', () => false)
</script>
