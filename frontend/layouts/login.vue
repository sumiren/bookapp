<template>
  <v-app>
    <Header
      :title="`✨ ${$C.TITLE} 🚀`"
      simple
    />

    <v-main>
      <v-container class="pa-8 px-md-10 py-md-16">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.v-container {
  max-width: 800px;
}
</style>
