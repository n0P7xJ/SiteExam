document.addEventListener('DOMContentLoaded', function () {
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const registrationForm = document.getElementById('registrationForm');
  
    function loadUsers() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      userTable.innerHTML = '';
  
      users.forEach(function (user, index) {
        let row = userTable.insertRow();
  
        let photoCell = row.insertCell();
        let nameCell = row.insertCell();
        let emailCell = row.insertCell();
        let actionsCell = row.insertCell();
  
        photoCell.innerHTML = `<img src="${user.photo}" width="50">`;
        nameCell.textContent = user.name;
        emailCell.textContent = user.email;
        actionsCell.innerHTML = `
          <button onclick="editUser(${index})">Редагувати</button>
          <button onclick="deleteUser(${index})">Видалити</button>
        `;
      });
    }
  
    window.editUser = function (index) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users[index];
  
      const newName = prompt("Введіть нове ім'я:", user.name);
      const newEmail = prompt("Введіть новий email:", user.email);
  
      if (!newName || !newEmail) {
        alert("Ім'я та email не можуть бути порожніми!");
        return;
      }
  
      if (newEmail !== user.email && isEmailRegistered(newEmail)) {
        alert('Користувач з таким email вже існує!');
        return;
      }
  
      users[index].name = newName;
      users[index].email = newEmail;
      localStorage.setItem('users', JSON.stringify(users));
      loadUsers();
    };
  
    window.deleteUser = function (index) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      loadUsers();
    };
  
    registrationForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const photo = document.getElementById('photo').files[0];
  
      if (!photo) {
        alert('Будь ласка, завантажте фото.');
        return;
      }
  
      if (isEmailRegistered(email)) {
        alert('Користувач з таким email вже зареєстрований.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function (e) {
        const photoDataURL = e.target.result;
  
        const user = {
          name: name,
          email: email,
          password: btoa(password),
          photo: photoDataURL
        };
  
        saveUser(user);
        alert('Реєстрація успішна!');
        registrationForm.reset();
        loadUsers();
      };
      reader.readAsDataURL(photo);
    });
  
    function isEmailRegistered(email) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      return users.some(user => user.email === email);
    }
  
    function saveUser(user) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    loadUsers();
  });
  