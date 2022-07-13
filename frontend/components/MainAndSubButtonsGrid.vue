<!--
以下のような、メインとサブの2つのボタンを横並びにする
・実行する ... メイン
・キャンセル ... サブ

使用例:
<main-and-sub-buttons-grid>
  <template v-slot:main>
    <v-btn>実行する</v-btn>
  </template>
  <template v-slot:sub>
    <v-btn flat>キャンセル</v-btn>
  </template>
</main-and-sub-buttons-grid>
-->

<template>
  <v-row
    justify="space-between"
    justify-md="end"
    align="center"
    class="flex-md-row-reverse flex-nowrap"
  >
    <v-col cols="auto">
      <slot name="sub" />
    </v-col>

    <v-col cols="auto" class="mr-md-4">
      <slot name="main" />
    </v-col>
  </v-row>
</template>
