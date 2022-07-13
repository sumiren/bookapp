<template>
  <v-btn
    variant="text"
    size="large"
    color="primary"
  >
    <span class="label">
      <slot />
    </span>
  </v-btn>
</template>

<style scoped lang="scss">
.v-btn {
  margin: 0 -8px;
}

.label {
  position: relative;
  display: inline-block;
  padding-bottom: 0.25em;

  &::after {
    content: '';
    pointer-events: none;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    margin: auto;
    background-color: currentColor;
    transition: 0.2s;

    @at-root {
      .v-btn:hover &,
      .v-btn:active & {
        width: 60%;
      }
    }
  }
}

</style>
