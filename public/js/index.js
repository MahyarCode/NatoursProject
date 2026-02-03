import { login } from './login.js';
import { logout } from './login.js';
import { updateUserDataInProfile } from './updateUserData.js';
// import { bookTour } from './stripe.js';

const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userData = document.querySelector('.form-user-data');
const userPassword = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (userData) {
    userData.addEventListener('submit', async function (e) {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        console.log(form);

        await updateUserDataInProfile(form);
    });
}

if (userPassword) {
    userPassword.addEventListener('submit', async function (e) {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        const password = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const newPasswordConfirm =
            document.getElementById('password-confirm').value;

        await updateUserDataInProfile(
            {
                password,
                newPassword,
                newPasswordConfirm,
            },
            'password',
        );
        document.querySelector('.btn--save-password').textContent =
            'Save password';

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

// if (bookBtn) {
//     bookBtn.addEventListener('click', function (e) {
//         e.target.textContent = 'Processing';
//         const tourID = e.target.dataset.tourId;
//         bookTour(tourID);
//     });
// }
