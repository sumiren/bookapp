<template>
  <default-layout>
    <template v-slot:add-ui>
      <v-btn
        color="accent"
        size="x-large"
        icon="mdi-plus"
        v-if="isMobile"
        class="mobileBookAddButton"
        @click="showBookAddDialog"
      />

      <v-btn
        color="accent"
        size="large"
        prepend-icon="mdi-plus"
        @click="showBookAddDialog"
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
      v-model="selectedTabItem"
      :fixed-tabs="isMobile"
      background-color="thin"
      color="primary"
      class="mb-6"
    >
      <v-tab
        v-for="tabItem in tabItems"
        :key="tabItem.id"
        :value="tabItem"
        selected-class="bg-accent"
      >
        {{ tabItem.label }}
      </v-tab>
    </v-tabs>

    <v-table
      fixed-header
      class="border-sm border-opacity"
    >
      <thead>
      <tr>
        <th style="width: 16em">書籍名</th>
        <th style="width: 4em">ステータス</th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="book of books"
        :key="book.id"
      >
        <td>{{ book.name }}</td>
        <td><v-chip>つんどく</v-chip></td>
      </tr>
      </tbody>
    </v-table>

    <!-- 書籍追加ダイアログ -->
    <client-only>
      <v-dialog v-model="isBookAddDialogShown">
        <v-card>
          <v-card-text class="pa-8 pa-sm-10">
            <v-text-field
              v-model="textToAddBook"
              label="書籍名を入力してください"
              variant="outlined"
              prepend-inner-icon="mdi-pencil"
              clearable
              clear-icon="mdi-close"
              hide-details
              autofocus
              density="comfortable"
              class="bookAddTextField mb-9"
            />

            <!-- 書籍追加・キャンセルボタン -->
            <main-and-sub-buttons-grid>
              <template v-slot:main>
                <v-btn
                  color="accent"
                  size="large"
                  prepend-icon="mdi-plus"
                  class="px-sm-6"
                  @click="addBook"
                >
                  追加
                </v-btn>
              </template>

              <template v-slot:sub>
                <cancel-button @click="closeBookAddDialog" />
              </template>
            </main-and-sub-buttons-grid>
            <!-- /書籍追加・キャンセルボタン -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </client-only>
    <!-- /書籍追加ダイアログ -->
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '~/layouts/default.vue'
import * as ReadModelBook from '../../backend/src/domain/readmodel/book'
import { bffUrl } from '~/lib/bffClient'

definePageMeta({
  middleware: 'auth'
})

const { isMobile } = useBreakpoint()

// タブの制御
type tabItem = {
  id: number;
  label: string;
}
const tabItems: tabItem[] = [
  { id: 1, label: 'すべて' },
  { id: 2, label: 'つんどく' },
  { id: 3, label: '読みかけ' },
  { id: 4, label: '読了' }
]
const selectedTabItem = useState<string | null>('selectedTabItem', () => null)

// 書籍検索に使用する文字列
const textToSearch = useState<string>('textToSearch', () => '')

// 書籍追加に使用する文字列
const textToAddBook = useState<string>('textToAddBook', () => '')

// 書籍追加ダイアログの表示・非表示
const isBookAddDialogShown = ref(false)

const showBookAddDialog = () => {
  isBookAddDialogShown.value = true
  textToAddBook.value = ''
}

const closeBookAddDialog = () => {
  isBookAddDialogShown.value = false
  textToAddBook.value = ''
}

// 書籍一覧を取得
const result = await useFetch(bffUrl('/books'), {
  method: 'GET',
  credentials: 'include',
  server: true,
  headers: {
    cookie: useRequestHeaders(['cookie'])['cookie']
  }
})

const booksResponse = result.data
const updateBooks = result.refresh

// 書籍を追加
const addBook = async () => {
  await useFetch(bffUrl('/books'), {
    method: 'POST',
    credentials: 'include',
    body: {
      name: textToAddBook.value
    }
  })
  closeBookAddDialog()
  updateBooks()
}

// レスポンスを描画用に整形
const books = computed(() => {
  if (!booksResponse.value) {
    return []
  }

  return booksResponse.value.books.map(o => ({
    name: o.name,
    id: o.id
  }))
})
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

::v-deep(.mobileBookAddButton i) {
  font-size: 2.4rem;
}

.bookAddTextField {
  @media (min-width: 375px) {
    width: 260px;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    width: 480px;
  }
}

.v-tabs {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    margin-right: calc(50% - 50vw);
    margin-left: calc(50% - 50vw);
  }
}
</style>
