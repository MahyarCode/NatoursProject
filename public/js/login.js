import axios from './axios.min.js';
// import axios from 'axios';
import { showAlert } from './alert.js';

export const login = async function (email, password) {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/overview');
            }, 500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

export const logout = async function () {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });

        if ((res.data.status = 'success')) {
            window.setTimeout(() => {
                location.assign('/overview');
                // location.reload(true);
            }, 500);
        }
    } catch (error) {
        console.log(error.response);
        showAlert('error', 'Error logging out! try again');
    }
};
