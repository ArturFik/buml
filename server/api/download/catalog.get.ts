import { defineEventHandler } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const templatesDir = path.join(process.cwd(), "templates");

    // Ищем файл каталога
    const catalogFiles = ["каталог_товаров.doc", "catalog.doc", "каталог.doc"];
    let catalogPath = "";
    let catalogName = "";

    for (const file of catalogFiles) {
      const testPath = path.join(templatesDir, file);
      if (fs.existsSync(testPath)) {
        catalogPath = testPath;
        catalogName = file;
        break;
      }
    }

    if (!catalogPath) {
      return {
        status: 404,
        body: { error: "Файл каталога не найден" },
      };
    }

    const fileBuffer = fs.readFileSync(catalogPath);

    // Используем английское имя для заголовка (без русских букв)
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
