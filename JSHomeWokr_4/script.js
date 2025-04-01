document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Очистити попередні помилки
        usernameError.classList.add('hidden');
        emailError.classList.add('hidden');
        passwordError.classList.add('hidden');

        const username = registrationForm.username.value;
        const email = registrationForm.email.value;
        const password = registrationForm.password.value;

        const user = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('https://goose.itstep.click/api/Account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400) {
                    if (errorData.errors) {
                        if (errorData.errors.Username) {
                            usernameError.textContent = errorData.errors.Username.join(', ');
                            usernameError.classList.remove('hidden');
                        }
                        if (errorData.errors.Email) {
                            emailError.textContent = errorData.errors.Email.join(', ');
                            emailError.classList.remove('hidden');
                        }
                        if (errorData.errors.Password) {
                            passwordError.textContent = errorData.errors.Password.join(', ');
                            passwordError.classList.remove('hidden');
                        }
                    }
                } else {
                    alert('Сталася помилка. Спробуйте ще раз.');
                }
            } else {
                alert('Реєстрація успішна!');
                registrationForm.reset();
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка. Спробуйте ще раз.');
        }
    });
});
