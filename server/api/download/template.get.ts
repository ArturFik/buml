import { defineEventHandler } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    // Пробуем разные пути (для локальной разработки и для Vercel)
    const possiblePaths = [
      path.join(process.cwd(), "public", "templates", "template.doc"),
      path.join(
        process.cwd(),
        ".output",
        "public",
        "templates",
        "template.doc"
      ),
      path.join(process.cwd(), "templates", "template.doc"),
      "/tmp/templates/template.doc", // для Vercel
    ];

    let filePath = "";

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        console.log("Найден файл по пути:", p);
        break;
      }
    }

    if (!filePath) {
      console.log("Файл не найден по путям:", possiblePaths);
      return {
        status: 404,
        body: { error: "Файл шаблона не найден" },
      };
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Правильный Content-Type для .doc файла
    event.res.setHeader("Content-Type", "application/msword");
    event.res.setHeader(
      "Content-Disposition",
      'attachment; filename="template.doc"'
    );

    return fileBuffer;
  } catch (error) {
    console.error("Error serving template:", error);
    return {
      status: 500,
      body: { error: "Ошибка при скачивании шаблона" },
    };
  }
});
