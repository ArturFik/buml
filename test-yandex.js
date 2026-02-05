import nodemailer from "nodemailer";

async function test() {
  console.log("Тест Яндекс SMTP...");

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: "arturnasyr0v@yandex.ru", // ← полный email
      pass: "attbtgcbjqnbvbgr",
    },
  });

  try {
    console.log("1. Проверяем соединение...");
    await transporter.verify();
    console.log("✅ Соединение OK!");

    console.log("2. Отправляем тестовое письмо...");
    const info = await transporter.sendMail({
      from: '"Тест" <arturnasyr0v@yandex.ru>',
      to: "arturnasyr0v@yandex.ru", // или poligraf14@mail.ru
      subject: "Тест из Node.js",
      text: "Если ты это видишь, значит почта работает!",
    });

    console.log("✅ Письмо отправлено! ID:", info.messageId);
    console.log("✅ Проверь папку Входящие и СПАМ!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);

    if (error.message.includes("Invalid login")) {
      console.log("\n🔥 ВОЗМОЖНЫЕ ПРИЧИНЫ:");
      console.log("1. Неправильный email (должен быть arturnasyr0v@yandex.ru)");
      console.log("2. Неправильный пароль приложения");
      console.log("3. Не включена двухфакторная аутентификация");
      console.log("4. Почта заблокирована");
    }
  }
}

test();
