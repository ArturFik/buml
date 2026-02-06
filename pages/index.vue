<template>
  <div class="container">
    <!-- Шапка -->
    <header class="header">
      <img src="/public/logo.JPG" alt="logo" class="logo" />

      <div class="header-right">
        <div class="header-phone">+7 917 349 41 11</div>

        <button
          class="burger-menu"
          @click="toggleMenu"
          :class="{ active: isMenuOpen }"
          aria-label="Меню"
        >
          <span class="burger-line"></span>
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </button>

        <nav class="nav" :class="{ active: isMenuOpen }">
          <a href="#about" class="nav-link" @click="closeMenu">О компании</a>
          <a href="#contacts" class="nav-link" @click="closeMenu">Контакты</a>
          <a href="#order" class="nav-link" @click="closeMenu">Заказ</a>
        </nav>
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
import { ref, reactive, onMounted, onUnmounted } from "vue";

// Refs
const fileInput = ref(null);
const uploadedFile = ref(null);
const isSubmitting = ref(false);
const isMenuOpen = ref(false);

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
    const validTypes = [".doc", ".doc"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      showMessage("Только файлы Excel (.xlsx, .xls)", "error");
      fileInput.value.value = "";
      return;
    }

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
const submitOrder = async () => {
  if (!uploadedFile.value) {
    showMessage("Пожалуйста, загрузите файл с заказом", "error");
    return;
  }

  isSubmitting.value = true;
  showMessage("", "");

  try {
    const formDataToSend = new FormData();

    formDataToSend.append("file", uploadedFile.value);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append("comment", formData.comment || "");

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

// Бургер-меню методы
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleClickOutside = (event) => {
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger-menu");

  if (
    nav &&
    burger &&
    !nav.contains(event.target) &&
    !burger.contains(event.target)
  ) {
    closeMenu();
  }
};

const handleResize = () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});
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
  padding: 15px 0;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  height: 50px;
  width: auto;
  margin-left: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 40px;
  position: relative;
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
  font-size: 16px;
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
  white-space: nowrap;
}

/* Бургер-меню */
.burger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.burger-line {
  display: block;
  width: 100%;
  height: 3px;
  background: #1e40af;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}

.burger-menu.active .burger-line:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}

.burger-menu.active .burger-line:nth-child(2) {
  opacity: 0;
}

.burger-menu.active .burger-line:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .header-right {
    gap: 20px;
  }

  .nav {
    display: none;
    position: fixed;
    top: 70px;
    right: 20px;
    background: white;
    flex-direction: column;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    z-index: 999;
    min-width: 200px;
    gap: 15px;
  }

  .nav.active {
    display: flex;
  }

  .nav-link {
    padding: 10px 15px;
    border-bottom: 1px solid #f1f5f9;
  }

  .nav-link:last-child {
    border-bottom: none;
  }

  .nav-link:hover::after {
    display: none;
  }

  .burger-menu {
    display: flex;
    margin-right: 20px;
  }

  .header-phone {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .logo {
    height: 40px;
    margin-left: 10px;
  }

  .header {
    padding: 10px 0;
  }

  .header-phone {
    display: none;
  }

  .nav {
    top: 60px;
    right: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }
}

@media (max-width: 480px) {
  .logo {
    height: 35px;
  }
}

/* Герой */
.hero {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  padding: 80px 0;
  border-radius: 0 0 20px 20px;
  margin-bottom: 60px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.hero h1 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Кнопки */
.btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 180px;
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

@media (max-width: 600px) {
  .hero h1 {
    font-size: 28px;
  }

  .hero p {
    font-size: 16px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }
}

/* Секции */
.section {
  padding: 60px 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
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

@media (max-width: 768px) {
  .section {
    padding: 40px 0;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 30px;
  }
}

/* О компании */
.about-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.about-card h3 {
  font-size: 22px;
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

@media (max-width: 600px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .about-card {
    padding: 20px;
  }

  .about-card h3 {
    font-size: 20px;
  }
}

/* Контакты */
.contacts-section {
  background: white;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.contact-card {
  background: #f1f5f9;
  padding: 25px;
  border-radius: 10px;
  border-left: 4px solid #1e40af;
}

.contact-card h3 {
  color: #1e40af;
  margin-bottom: 15px;
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
  padding: 0 20px;
}

.step {
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: #1e40af;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 22px;
  color: #1e40af;
  margin-bottom: 20px;
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
  font-size: 28px;
  color: #1e40af;
}

.file-card h4 {
  color: #1e293b;
  margin-bottom: 5px;
  font-size: 18px;
}

.file-card p {
  color: #64748b;
  font-size: 14px;
}

.download-btn {
  margin-left: auto;
  padding: 8px 16px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 14px;
  white-space: nowrap;
}

.download-btn:hover {
  background: #1e3a8a;
}

@media (max-width: 768px) {
  .step {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .step-number {
    align-self: flex-start;
  }

  .file-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .download-btn {
    margin: 10px 0 0 0;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .step-content h3 {
    font-size: 20px;
  }

  .file-card h4 {
    font-size: 16px;
  }
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
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 15px;
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
  padding: 30px 20px;
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
  font-size: 40px;
  margin-bottom: 15px;
  color: #94a3b8;
}

.file-upload-area.has-file .upload-icon {
  color: #10b981;
}

.upload-text {
  color: #64748b;
  font-size: 15px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.file-info strong {
  color: #1e293b;
  font-size: 16px;
}

.file-info span {
  font-size: 14px;
  color: #94a3b8;
}

/* Чекбокс */
.form-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 25px 0;
}

.form-check input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #cbd5e1;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.form-check label {
  color: #475569;
  cursor: pointer;
  user-select: none;
  font-size: 15px;
  line-height: 1.4;
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
  font-size: 15px;
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
  padding: 0 20px;
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

@media (max-width: 768px) {
  .footer {
    padding: 30px 0;
    margin-top: 40px;
  }

  .footer-logo {
    font-size: 18px;
  }
}

/* Дополнительные медиа-запросы */
@media (max-width: 480px) {
  .container {
    padding: 0px;
  }

  .hero {
    padding: 60px 0;
  }

  .hero h1 {
    font-size: 24px;
  }

  .section-title {
    font-size: 24px;
  }

  .about-card h3,
  .step-content h3,
  .contact-card h3 {
    font-size: 18px;
  }

  .submit-btn {
    font-size: 16px;
    padding: 14px;
  }
}
</style>
