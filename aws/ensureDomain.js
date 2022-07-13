if (!process.env.PARENT_DOMAIN) {
  console.log('環境変数エラー：PARENT_DOMAINを指定してください')
  process.exit(1)
}
process.exit(0)
