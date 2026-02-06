import { defineEventHandler } from "h3";
import { readFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  try {
    // На Vercel нужно использовать process.cwd() с путем к public
    const filePath = join(process.cwd(), "public", "templates", "template.doc");

    // Проверяем, существует ли файл
    const fs = await import("fs");
    if (!fs.existsSync(filePath)) {
      // Альтернатива: отдаем ссылку для скачивания
      return {
        status: 200,
        body: {
          downloadUrl: "/templates/template.doc",
          message: "Скачайте файл по ссылке",
        },
      };
    }

    const fileBuffer = await readFile(filePath);

    event.res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    event.res.setHeader(
      "Content-Disposition",
      'attachment; filename="template.xlsx"'
    );

    return fileBuffer;
  } catch (error) {
    console.error("Error serving template:", error);
    return {
      status: 404,
      body: { error: "Файл шаблона не найден" },
    };
  }
});
