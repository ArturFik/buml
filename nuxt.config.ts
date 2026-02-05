export default defineNuxtConfig({
  modules: [],
  runtimeConfig: {
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailTo: process.env.EMAIL_TO || "arturnasyr0v@yandex.ru",
    public: {
      siteName: "ПОЛИГРАФИЯ УСПУГИ ТИПОГРАФИИ",
    },
  },
});
