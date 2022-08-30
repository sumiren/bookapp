<template>
  <v-list bg-color="thin" class="py-8">
    <v-list-item
      v-for="item in $C.NAVIGATION_ITEMS"
      :to="item.path"
      active-class="bg-accent"
      :prepend-icon="item.icon"
      :title="item.title"
      class="font-weight-bold px-8 py-4"
    />
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
    width: 50%;
  }
}

::v-deep(.v-list-item-title) {
  font-weight: 500;
}

::v-deep(.v-list-item__prepend .v-icon) {
  opacity: 1;
  margin-right: 20px;
}

::v-deep(.v-list-item__overlay) {
  display: none;
}
</style>
