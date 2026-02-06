import { defineEventHandler } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    // Пробуем разные пути
    const possiblePaths = [
      path.join(process.cwd(), "public", "templates", "catalog.doc"),
      path.join(process.cwd(), ".output", "public", "templates", "catalog.doc"),
      path.join(process.cwd(), "templates", "catalog.doc"),
      "/tmp/templates/catalog.doc", // для Vercel
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
        body: { error: "Файл каталога не найден" },
      };
    }

    const fileBuffer = fs.readFileSync(filePath);

    event.res.setHeader("Content-Type", "application/msword");
    event.res.setHeader(
      "Content-Disposition",
      'attachment; filename="catalog.doc"'
    );

    return fileBuffer;
  } catch (error) {
    console.error("Error serving catalog:", error);
    return {
      status: 500,
      body: { error: "Ошибка при скачивании каталога" },
    };
  }
});
