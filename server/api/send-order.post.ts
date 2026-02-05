import { defineEventHandler, readMultipartFormData } from "h3";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    console.log("=== НАЧАЛО ОБРАБОТКИ ЗАКАЗА ===");

    // Получаем данные формы
    const formData = await readMultipartFormData(event);

    if (!formData) {
      console.log("ОШИБКА: Нет данных формы");
      return {
        status: 400,
        body: { error: "Нет данных формы" },
      };
    }

    let fileData: any;
    const orderData: any = {};

    // Обрабатываем данные формы
    for (const data of formData) {
      if (data.name === "file" && data.filename) {
        fileData = data;
        console.log("Получен файл:", data.filename);
      } else if (data.name) {
        orderData[data.name] = data.data.toString("utf-8");
        console.log(`${data.name}:`, data.data.toString("utf-8"));
      }
    }

    if (!fileData) {
      console.log("ОШИБКА: Файл не найден");
      return {
        status: 400,
        body: { error: "Файл не найден" },
      };
    }

    // Проверяем переменные окружения
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log("EMAIL_USER:", emailUser ? "установлен" : "НЕ УСТАНОВЛЕН!");
    console.log("EMAIL_PASS:", emailPass ? "установлен" : "НЕ УСТАНОВЛЕН!");

    if (!emailUser || !emailPass) {
      console.log("ОШИБКА: Не настроены переменные окружения для почты");
      return {
        status: 500,
        body: {
          error: "Не настроена отправка почты",
          details: "Проверьте файл .env и переменные EMAIL_USER, EMAIL_PASS",
        },
      };
    }

    // Сохраняем файл временно
    const uploadDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileData.filename!);
    fs.writeFileSync(filePath, fileData.data);
    console.log("Файл сохранен во временную папку:", filePath);

    // Настройка транспортера для Яндекс.Почты
    console.log("Настраиваем nodemailer...");
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true, // true для 465 порта
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false, // для разработки
      },
    });

    // Проверяем соединение
    console.log("Проверяем соединение с Яндекс...");
    try {
      await transporter.verify();
      console.log("Соединение с Яндекс установлено");
    } catch (verifyError) {
      console.error("ОШИБКА ПОДКЛЮЧЕНИЯ К ЯНДЕКС:", verifyError);
      // Удаляем временный файл
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return {
        status: 500,
        body: {
          error: "Ошибка подключения к Яндекс.Почте",
          details: "Проверьте логин, пароль и интернет-соединение",
        },
      };
    }

    const emailTo = process.env.EMAIL_TO || "poligraf14@mail.ru";
    console.log("Отправляем письмо на:", emailTo);

    // Отправка письма
    const mailOptions = {
      from: `"Полиграфия Заказ" <${emailUser}>`,
      to: emailTo,
      subject: `Новый заказ от ${orderData.name || "Клиента"}`,
      text: `
НОВЫЙ ЗАКАЗ

ФИО: ${orderData.name}
Телефон: ${orderData.phone}
Email: ${orderData.email || "Не указан"}
Комментарий: ${orderData.comment || "Не указан"}

Дата: ${new Date().toLocaleString("ru-RU")}

Файл с заказом прикреплен к письму.
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { background: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px; }
        .field { margin-bottom: 10px; }
        .field strong { color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Новый заказ с сайта</h2>
    </div>
    <div class="content">
        <div class="field"><strong>ФИО:</strong> ${orderData.name}</div>
        <div class="field"><strong>Телефон:</strong> ${orderData.phone}</div>
        <div class="field"><strong>Email:</strong> ${
          orderData.email || "Не указан"
        }</div>
        <div class="field"><strong>Комментарий:</strong> ${
          orderData.comment || "Не указан"
        }</div>
    </div>
    <div class="footer">
        <p><strong>Внимание:</strong> Файл с заказом прикреплен к этому письму.</p>
        <p>Дата получения: ${new Date().toLocaleString("ru-RU")}</p>
    </div>
</body>
</html>
      `,
      attachments: [
        {
          filename: fileData.filename,
          path: filePath,
          contentType: fileData.filename.endsWith(".xlsx")
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : fileData.filename.endsWith(".xls")
            ? "application/vnd.ms-excel"
            : "application/octet-stream",
        },
      ],
    };

    console.log("Отправляем письмо...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Письмо отправлено! ID:", info.messageId);

    // Удаляем временный файл
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Временный файл удален");
    }

    console.log("=== УСПЕШНО ОТПРАВЛЕНО ===");

    return {
      status: 200,
      body: {
        success: true,
        message: "Заказ успешно отправлен на почту",
        messageId: info.messageId,
      },
    };
  } catch (error: any) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА:", error);

    // Пытаемся удалить временный файл если он есть
    try {
      const uploadDir = path.join(process.cwd(), "tmp");
      const files = fs.readdirSync(uploadDir);
      files.forEach((file) => {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
      });
    } catch (cleanupError) {
      console.error("Ошибка при очистке временных файлов:", cleanupError);
    }

    return {
      status: 500,
      body: {
        error: "Ошибка при отправке заказа",
        details: error.message,
        tip: "Проверьте настройки почты в .env файле",
      },
    };
  }
});
