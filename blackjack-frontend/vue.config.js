module.exports = {
  transpileDependencies: [
    'vuetify',
  ],

  pwa: {
    name: "Blackjack",
    manifestOptions: {
      display: "standalone",
      themeColor: "#42b983",
      start_url: "./index.html",
      background_color: "#42b983",
      short_name: "BJ",
    }
  }
}
