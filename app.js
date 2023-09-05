// Получение элементов со страницы
const addPasswordButton = document.getElementById('add-button');
const passwordInput = document.getElementById('password-input');
const passwordList = document.getElementById('passwords');
const filterInput = document.getElementById('filter-input');
const generateButton = document.getElementById('generate-button');

// Массив для хранения паролей
let passwords = [];

// Функция для добавления нового пароля
function addPassword() {
  const passwordName = passwordInput.value;

  // Проверка на пустое значение
  if (passwordName === '') {
    alert('Введите пароль!');
    return;
  }

  // Генерация уникального id для пароля
  const id = Date.now().toString();

  // Создание нового объекта пароля
  const newPassword = {
    id: id,
    name: passwordName
  };

  // Добавление пароля в массив
  passwords.push(newPassword);

  // Очистка поля ввода
  passwordInput.value = '';

  // Отображение пароля на странице
  displayPassword(newPassword);

  // Сохранение паролей в локальном хранилище
  savePasswords();
}

// Функция для отображения пароля на странице
function displayPassword(password) {
  const listItem = document.createElement('li');
  
  listItem.innerHTML = `
    <span>${password.name}</span>
    <button class="copy-button" data-id="${password.id}">Скопировать</button>
    <button class="delete-button" data-id="${password.id}">Удалить</button> 
  `;
  
  // Добавление обработчика события для кнопки копирования
  const copyButton = listItem.querySelector('.copy-button');
  copyButton.addEventListener('click', copyPassword);
  // Добавление обработчика события для кнопки удаления
  const deleteButton = listItem.querySelector('.delete-button');
  deleteButton.addEventListener('click', deletePassword);
  // Добавление элемента на страницу
  passwordList.appendChild(listItem);
}

// Функция для копирования пароля в буфер обмена
function copyPassword(event) {
  const passwordId = event.target.getAttribute('data-id');
  const password = passwords.find(p => p.id === passwordId);

  // Скопировать пароль в буфер обмена
  navigator.clipboard.writeText(password.name)
    .then(() => {
      alert('Пароль скопирован!');
    })
    .catch(() => {
      alert('Ошибка при копировании пароля!');
    });
}
// Функция для удаления пароля
function deletePassword(event) {
    const passwordId = event.target.getAttribute("data-id");
    passwords = passwords.filter((password) => password.id !== passwordId);
    savePasswords();
    filterPasswords();
} 
// Функция для фильтрации паролей
function filterPasswords() {
  const filterValue = filterInput.value.toLowerCase();

  // Очистка списка паролей
  passwordList.innerHTML = '';

  // Фильтрация паролей
  const filteredPasswords = passwords.filter(password => password.name.toLowerCase().includes(filterValue));

  // Отображение отфильтрованных паролей на странице
  filteredPasswords.forEach(displayPassword);
}

// Функция для генерации случайного пароля
function generatePassword() {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&%';
  let newPassword = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset[randomIndex];
  }

  // Создание нового объекта пароля
  const generatedPassword = {
    id: Date.now().toString(),
    name: newPassword
  };

  // Добавление сгенерированного пароля в массив
  passwords.push(generatedPassword);

  // Отображение сгенерированного пароля на странице
  displayPassword(generatedPassword);

  // Сохранение паролей в локальном хранилище
  savePasswords();
}

// Функция для сохранения паролей в локальном хранилище
function savePasswords() {
  localStorage.setItem('passwords', JSON.stringify(passwords));
}

// Функция для загрузки паролей из локального хранилища
function loadPasswords() {
  const storedPasswords = localStorage.getItem('passwords');

  if (storedPasswords) {
    passwords = JSON.parse(storedPasswords);
    passwords.forEach(displayPassword);
  }
}

// Обработчики событий
addPasswordButton.addEventListener('click', addPassword);
filterInput.addEventListener('input', filterPasswords);
generateButton.addEventListener('click', generatePassword);

// Загрузка сохраненных паролей при запуске приложения
loadPasswords();
