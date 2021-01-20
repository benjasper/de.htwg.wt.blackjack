const path = require("path");

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  outputDir: path.resolve(__dirname, "../public"),

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
