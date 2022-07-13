<template>
  <login-layout>
    <!-- メールアドレス -->
    <email-field
      v-model="loginData.email"
      @keydown.enter="login"
      class="mb-n3"
    />
    <!-- /メールアドレス -->

    <!-- パスワード -->
    <password-field
      v-model="loginData.password"
      @keydown.enter="login"
      class="mb-4"
    />
    <!-- /パスワード -->

    <!-- ログイン・新規登録ボタン -->
    <main-and-sub-buttons-grid>
      <template v-slot:main>
        <v-btn
          color="accent"
          size="large"
          prepend-icon="mdi-login"
          @click="login"
          class="px-sm-6"
        >
          ログイン
        </v-btn>
      </template>

      <template v-slot:sub>
        <text-button @click="openDialog">
          新規登録
        </text-button>
      </template>
    </main-and-sub-buttons-grid>
    <!-- /ログイン・新規登録ボタン -->

    <!-- ユーザ登録ダイアログ -->
    <client-only>
      <v-dialog v-model="isDialogOpened">
        <v-card>
          <v-card-text class="pt-6 pb-8 px-sm-10">
            <!-- メールアドレス -->
            <email-field
              v-model="signupData.email"
              autofocus
              @keydown.enter="signup"
              class="mb-n3"
            />
            <!-- /メールアドレス -->

            <!-- パスワード -->
            <password-field
              v-model="signupData.password"
              @keydown.enter="signup"
              class="mb-4"
            />
            <!-- /パスワード -->

            <!-- 新規登録・キャンセルボタン -->
            <main-and-sub-buttons-grid>
              <template v-slot:main>
                <v-btn
                  color="accent"
                  size="large"
                  prepend-icon="mdi-account-plus"
                  @click="signup"
                  class="px-sm-6"
                >
                  新規登録
                </v-btn>
              </template>

              <template v-slot:sub>
                <cancel-button @click="closeDialog" />
              </template>
            </main-and-sub-buttons-grid>
            <!-- /新規登録・キャンセルボタン -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </client-only>
    <!-- /ユーザ登録ダイアログ -->
  </login-layout>
</template>

<script setup lang="ts">
import LoginLayout from '~/layouts/login.vue'
import { Auth, LoginResult } from '~/lib/auth'

const auth = Auth.getAuth()
type emailAndPassword = {
  email: '',
  password: ''
}

// ログイン
const loginData = useState<emailAndPassword>('loginData', () => ({
  email: '',
  password: ''
}))

async function login() {
  console.log(loginData.value.email)
  console.log('password length...' + loginData.value.password.length)

  try {
    let frontendLoginResult: LoginResult
    frontendLoginResult = await auth.signInWithEmailAndPassword(loginData.value.email, loginData.value.password)
    await auth.loginToServer(frontendLoginResult)
    navigateTo('/book')
  } catch (e) {
    console.log(JSON.stringify(e))
    alert(JSON.stringify(e))
  }
}

// ユーザを登録
const signupData = useState<emailAndPassword>('signupData', () => ({
  email: '',
  password: ''
}))

const signup = async () => {
  console.log(signupData.value.email)
  console.log('password length...' + signupData.value.password.length)

  try {
    let result: LoginResult
    result = await auth.createUserWithEmailAndPassword(signupData.value.email, signupData.value.password)
    await auth.loginToServer(result)
    navigateTo('/book')
  } catch (e) {
    console.log(JSON.stringify(e))
    alert(JSON.stringify(e))
  }
}

// ユーザ登録ダイアログの表示・非表示を制御
const isDialogOpened = useState<Boolean>('isDialogOpened', () => false)
const openDialog = () => {
  isDialogOpened.value = true
}
const closeDialog = () => {
  isDialogOpened.value = false
}
</script>
