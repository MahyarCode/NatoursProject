import { showAlert } from './alert.js';
import axios from './axios.min.js';

export const updateUserDataInProfile = async function (data, type = 'profile') {
    try {
        const url =
            type === 'password'
                ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
                : 'http://127.0.0.1:3000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url: url,
            data: data,
        });
        if (res.data.status === 'success') {
            showAlert(
                'success',
                `${type === 'password' ? 'Password' : 'Profile'} is updated`,
            );
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};
