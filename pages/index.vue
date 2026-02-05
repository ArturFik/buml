<template>
  <div class="container">
    <!-- Шапка -->
    <header class="header">
      <div class="logo">
        <img src="/public/logo.JPG" alt="logo" />
      </div>
      <div class="header-right">
        <nav class="nav">
          <a href="#about" class="nav-link">О компании</a>
          <a href="#contacts" class="nav-link">Контакты</a>
          <a href="#order" class="nav-link">Заказ</a>
        </nav>
        <div class="header-phone">+7 917 349 41 11</div>
      </div>
    </header>

    <!-- Герой -->
    <section class="hero">
      <div class="hero-content">
        <h1>Профессиональная полиграфия и бумажная продукция</h1>
        <p>
          Печать, бланки, бумага всех типов с доставкой по Уфе и Республике
          Башкортостан
        </p>
        <div class="hero-buttons">
          <button @click="scrollToOrder" class="btn btn-primary">
            Оформить заказ
          </button>
          <button @click="downloadCatalog" class="btn btn-secondary">
            Скачать каталог
          </button>
        </div>
      </div>
    </section>

    <!-- О компании -->
    <section id="about" class="section">
      <h2 class="section-title">О компании</h2>
      <div class="about-content">
        <div class="about-card">
          <h3>Наша деятельность</h3>
          <p>
            Производство печатной и бланочной продукции. Широкий ассортимент
            бумаги для различных нужд.
          </p>
          <p class="note">*Здесь будет подробное описание компании и услуг</p>
        </div>
        <div class="about-card">
          <h3>Наши преимущества</h3>
          <ul>
            <li>Современное оборудование</li>
            <li>Оперативная доставка</li>
            <li>Гарантия качества</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Контакты -->
    <section id="contacts" class="section contacts-section">
      <h2 class="section-title">Контакты</h2>
      <div class="contacts-grid">
        <div class="contact-card">
          <h3>Телефоны</h3>
          <p>+7 917 349 41 11</p>
        </div>
        <div class="contact-card">
          <h3>Контакты</h3>
          <p><strong>Email:</strong> 3494111@mail.ru</p>
        </div>
        <div class="contact-card">
          <h3>Сотрудники</h3>
        </div>
      </div>
    </section>

    <!-- Заказ -->
    <section id="order" class="section order-section">
      <h2 class="section-title">Оформление заказа</h2>

      <div class="order-steps">
        <!-- Шаг 1 -->
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Скачайте файлы</h3>
            <div class="files">
              <div class="file-card" @click="downloadFile('template')">
                <div class="file-icon">📋</div>
                <div>
                  <h4>Шаблон заказа</h4>
                  <p>Excel-файл для оформления заказа</p>
                </div>
                <button class="download-btn">Скачать</button>
              </div>
              <div class="file-card" @click="downloadFile('catalog')">
                <div class="file-icon">📚</div>
                <div>
                  <h4>Каталог товаров</h4>
                  <p>Весь ассортимент в Excel формате</p>
                </div>
                <button class="download-btn">Скачать</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 2 -->
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Заполните и отправьте</h3>

            <form @submit.prevent="submitOrder" class="order-form">
              <div class="form-row">
                <div class="form-group">
                  <label>ФИО *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div class="form-group">
                  <label>Телефон *</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    required
                    placeholder="8 (900) 123-45-67"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="example@mail.ru"
                />
              </div>

              <div class="form-group">
                <label>Файл с заказом *</label>
                <div
                  class="file-upload-area"
                  :class="{ 'has-file': uploadedFile }"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".xlsx,.xls"
                    @change="handleFileUpload"
                    style="display: none"
                  />
                  <div class="upload-icon">
                    {{ uploadedFile ? "📎" : "📤" }}
                  </div>
                  <div class="upload-text">
                    <div v-if="uploadedFile" class="file-info">
                      <strong>{{ uploadedFile.name }}</strong>
                      <span>{{ formatFileSize(uploadedFile.size) }}</span>
                    </div>
                    <div v-else>
                      Нажмите для загрузки файла Excel
                      <small>.xlsx или .xls, до 10MB</small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Комментарий к заказу</label>
                <textarea
                  v-model="formData.comment"
                  rows="3"
                  placeholder="Дополнительные пожелания или примечания..."
                ></textarea>
              </div>

              <div class="form-check">
                <input
                  type="checkbox"
                  id="agreement"
                  v-model="formData.agreement"
                  required
                />
                <label for="agreement"
                  >Согласен на обработку персональных данных</label
                >
              </div>

              <button
                type="submit"
                class="submit-btn"
                :disabled="isSubmitting || !uploadedFile"
              >
                <span v-if="isSubmitting">Отправка...</span>
                <span v-else>Отправить заказ</span>
              </button>

              <div v-if="message.text" class="alert" :class="message.type">
                {{ message.text }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Футер -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">ПОЛИГРАФИЯ УСПУГИ ТИПОГРАФИИ</div>
        <div class="footer-info">
          <p>© 2024 Все права защищены</p>
          <p>3494111@mail.ru | +7 917 349 41 11</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

// Refs
const fileInput = ref(null);
const uploadedFile = ref(null);
const isSubmitting = ref(false);

// Данные формы
const formData = reactive({
  name: "",
  phone: "",
  email: "",
  comment: "",
  agreement: false,
});

// Сообщения
const message = reactive({
  text: "",
  type: "",
});

// Методы
const scrollToOrder = () => {
  const orderSection = document.getElementById("order");
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Проверка типа файла
    const validTypes = [".xlsx", ".xls"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      showMessage("Только файлы Excel (.xlsx, .xls)", "error");
      fileInput.value.value = "";
      return;
    }

    // Проверка размера
    if (file.size > 10 * 1024 * 1024) {
      showMessage("Файл слишком большой (максимум 10MB)", "error");
      fileInput.value.value = "";
      return;
    }

    uploadedFile.value = file;
    showMessage("Файл успешно загружен", "success");
  }
};

const showMessage = (text, type) => {
  message.text = text;
  message.type = type;
  setTimeout(() => {
    message.text = "";
    message.type = "";
  }, 5000);
};

// Скачивание файлов через API
const downloadFile = async (type) => {
  try {
    const response = await fetch(`/api/download/${type}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка скачивания");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Используем английские имена
    if (type === "template") {
      a.download = "template.doc";
    } else {
      a.download = "catalog.doc";
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showMessage("Файл начал скачивание", "success");
  } catch (error) {
    console.error("Download error:", error);
    showMessage(error.message || "Ошибка при скачивании файла", "error");
  }
};

const downloadCatalog = () => downloadFile("catalog");

// Отправка заказа
// В методе submitOrder в index.vue
const submitOrder = async () => {
  if (!uploadedFile.value) {
    showMessage("Пожалуйста, загрузите файл с заказом", "error");
    return;
  }

  isSubmitting.value = true;
  showMessage("", "");

  try {
    const formDataToSend = new FormData();

    // Добавляем файл пользователя
    formDataToSend.append("file", uploadedFile.value);

    // Добавляем данные формы
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append("comment", formData.comment || "");

    // Отправляем на сервер
    const response = await fetch("/api/send-order", {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();

    if (response.ok) {
      showMessage(
        "✅ Заказ успешно отправлен! Файл прикреплен к письму.",
        "success"
      );

      // Сброс формы
      formData.name = "";
      formData.phone = "";
      formData.email = "";
      formData.comment = "";
      formData.agreement = false;
      uploadedFile.value = null;
      if (fileInput.value) fileInput.value.value = "";
    } else {
      throw new Error(result.error || "Ошибка отправки");
    }
  } catch (error) {
    console.error("Order submission error:", error);
    showMessage(
      "❌ Ошибка при отправке заказа. Пожалуйста, позвоните нам: +7 917 349 41 11",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
/* Базовые сбросы */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Шапка */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
  letter-spacing: 1px;
  > img {
    margin-left: 55px;
    width: 75px;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #1e40af;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #1e40af;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.header-phone {
  font-weight: 600;
  color: #1e40af;
  font-size: 18px;
}

/* Герой */
.hero {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  padding: 100px 0;
  border-radius: 0 0 20px 20px;
  margin-bottom: 60px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* Кнопки */
.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: white;
  color: #1e40af;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Секции */
.section {
  padding: 80px 0;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  color: #1e293b;
  position: relative;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #1e40af;
  border-radius: 2px;
}

/* О компании */
.about-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.about-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.about-card h3 {
  font-size: 24px;
  color: #1e40af;
  margin-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}

.about-card p {
  color: #475569;
  margin-bottom: 15px;
}

.about-card ul {
  list-style: none;
}

.about-card li {
  padding: 8px 0;
  color: #475569;
  position: relative;
  padding-left: 25px;
}

.about-card li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #1e40af;
  font-weight: bold;
}

.note {
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
  border-left: 3px solid #cbd5e1;
  padding-left: 15px;
  margin-top: 20px;
}

/* Контакты */
.contacts-section {
  background: white;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-card {
  background: #f1f5f9;
  padding: 30px;
  border-radius: 10px;
  border-left: 4px solid #1e40af;
}

.contact-card h3 {
  color: #1e40af;
  margin-bottom: 20px;
  font-size: 20px;
}

.contact-card p {
  margin-bottom: 10px;
  color: #475569;
}

.contact-card strong {
  color: #334155;
}

/* Заказ */
.order-section {
  background: #f8fafc;
}

.order-steps {
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.step-number {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: #1e40af;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 24px;
  color: #1e40af;
  margin-bottom: 25px;
}

.files {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.file-card:hover {
  border-color: #1e40af;
  background: #e0e7ff;
  transform: translateY(-2px);
}

.file-icon {
  font-size: 32px;
  color: #1e40af;
}

.file-card h4 {
  color: #1e293b;
  margin-bottom: 5px;
}

.file-card p {
  color: #64748b;
  font-size: 14px;
}

.download-btn {
  margin-left: auto;
  padding: 8px 20px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.download-btn:hover {
  background: #1e3a8a;
}

/* Форма */
.order-form {
  margin-top: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #475569;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Загрузка файла */
.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8fafc;
}

.file-upload-area:hover {
  border-color: #1e40af;
  background: #e0e7ff;
}

.file-upload-area.has-file {
  border-color: #10b981;
  background: #d1fae5;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #94a3b8;
}

.file-upload-area.has-file .upload-icon {
  color: #10b981;
}

.upload-text {
  color: #64748b;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.file-info strong {
  color: #1e293b;
}

.file-info span {
  font-size: 14px;
  color: #94a3b8;
}

/* Чекбокс */
.form-check {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0;
}

.form-check input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #cbd5e1;
  cursor: pointer;
}

.form-check label {
  color: #475569;
  cursor: pointer;
  user-select: none;
}

/* Кнопка отправки */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Сообщения */
.alert {
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
}

.alert.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.alert.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* Футер */
.footer {
  background: #1e293b;
  color: white;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #60a5fa;
}

.footer-info {
  color: #94a3b8;
  font-size: 14px;
}

.footer-info p {
  margin-bottom: 5px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header-right {
    flex-direction: column;
    gap: 20px;
  }

  .nav {
    gap: 15px;
  }

  .hero {
    padding: 60px 20px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .hero p {
    font-size: 18px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .section {
    padding: 40px 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .step {
    flex-direction: column;
    padding: 25px;
  }

  .step-number {
    align-self: flex-start;
  }

  .file-card {
    flex-direction: column;
    text-align: center;
  }

  .download-btn {
    margin: 10px 0 0 0;
  }
}
</style>
