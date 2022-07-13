<template>
  <v-list bg-color="thin" class="py-8">
    <v-list-item
      v-for="item in $C.NAVIGATION_ITEMS"
      :to="item.path"
      active-class="bg-accent"
      class="px-8 py-4"
    >
      <v-list-item-action class="mr-4">
        <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-title
        class="font-weight-medium"
        v-text="item.title"
      />
    </v-list-item>
  </v-list>
</template>

<style lang="scss" scoped>
@import 'vuetify/lib/styles/settings/_variables';

.v-list {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    display: flex;
    padding: 0 !important;
  }
}

.v-list-item {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
  }
}

::v-deep(.v-list-item__overlay) {
  display: none;
}
</style>
