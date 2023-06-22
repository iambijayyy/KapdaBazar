import axios from "axios"
import Cookies from 'js-cookie';

import {
    USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_LIST_RESET, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_DETAILS_RESET, USER_LIST_REQUEST, USER_LIST_FAIL, USER_LIST_SUCCESS, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_SEND_VERIFICATION_CODE_REQUEST,
    USER_SEND_VERIFICATION_CODE_SUCCESS,
    USER_SEND_VERIFICATION_CODE_FAIL,
    USER_VERIFY_CODE_REQUEST,
    USER_VERIFY_CODE_SUCCESS,
    USER_VERIFY_CODE_FAIL,
} from "../constants/userConstants"
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';
export const login = (email, password) => async (dispatch) => {
    // Check if user info cookie exists
    const userInfoCookie = Cookies.get('userInfo');
    if (userInfoCookie) {
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: JSON.parse(userInfoCookie),
        });
        return;
    }

    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/users/login', { email, password }, config);

        const passwordLastUpdated = new Date(data.passwordLastUpdated);
        const currentDate = new Date();
        const timeDifferenceInMinutes = (currentDate - passwordLastUpdated) / (1000 * 60);
        const passwordMessage = timeDifferenceInMinutes > 300 ? "Update Your Password" : '';

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: { ...data, passwordMessage },
        });

        localStorage.setItem('userInfo', JSON.stringify(data)); // Save user info to local storage

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logoutAfterInactivity = (dispatch) => {
    const inactivityTimeout = 100 * 60 * 1000; // 2 minute in milliseconds

    let inactivityTimer;

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            dispatch(logout());
            alert("Inactivity for long time")

        }, inactivityTimeout);
    };

    const handleUserActivity = () => {
        resetInactivityTimer();
    };

    // Attach event listeners to reset the timer on user activity
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Call the resetInactivityTimer initially to start the timer
    resetInactivityTimer();
};

export const logout = () => (dispatch) => {
    // Cookies.remove('userInfo'); // remove cookie
    localStorage.removeItem('userInfo'); // Remove user info from local storage

    dispatch({
        type: USER_LOGOUT
    })
    dispatch({
        type: USER_DETAILS_RESET
    })
    dispatch({
        type: ORDER_LIST_MY_RESET
    })
    dispatch({ type: USER_LIST_RESET })
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/users', { name, email, password }, config)
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })


        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })



        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })

    }
}


export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/users/${id}`, config);
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};




export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/users/profile`, user, config)
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })



    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })

    }
}

export const ListUsers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/users`, config)
        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })



    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })

    }
}
export const DeleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.delete(`/api/users/${id}`, config)
        dispatch({
            type: USER_DELETE_SUCCESS,
        })



    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })

    }
}

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/users/${user._id}`, user, config)
        dispatch({
            type: USER_UPDATE_SUCCESS,
        })
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })



    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })

    }
}
// Action to send the verification code
export const sendVerificationCode = (email) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_SEND_VERIFICATION_CODE_REQUEST,
        });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        await axios.post("/api/users/send-code", { email }, config);

        dispatch({
            type: USER_SEND_VERIFICATION_CODE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: USER_SEND_VERIFICATION_CODE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Action to verify the entered code
export const verifyCode = (email, verificationCode) => async (
    dispatch,
    getState
) => {
    try {
        dispatch({
            type: USER_VERIFY_CODE_REQUEST,
        });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/users/verify-code",
            { email, verificationCode },
            config
        );

        if (data.message === "Code is correct") {
            dispatch({
                type: USER_VERIFY_CODE_SUCCESS,
            });
        } else {
            dispatch({
                type: USER_VERIFY_CODE_FAIL,
                payload: "Unable to verify account",
            });
        }
    } catch (error) {
        dispatch({
            type: USER_VERIFY_CODE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : "Failed to verify code",
        });
    }
};
export default login
