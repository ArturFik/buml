import { defineEventHandler } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const templatesDir = path.join(process.cwd(), "public/templates/");

    // Ищем файл шаблона
    const templateFiles = ["template.doc"];
    let templatePath = "";

    for (const file of templateFiles) {
      const testPath = path.join(templatesDir, file);
      if (fs.existsSync(testPath)) {
        templatePath = testPath;
        break;
      }
    }

    if (!templatePath) {
      return {
        status: 404,
        body: { error: "Файл шаблона не найден" },
      };
    }

    const fileBuffer = fs.readFileSync(templatePath);

    // Используем английское имя для заголовка
    event.res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
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
