import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'react-bootstrap';
import addUs from './img/new.svg';
import wave from './img/wavev.png';
import { Helmet } from 'react-helmet';
import { getUserDetails, sendVerificationCode, verifyCode } from '../actions/userActions';
import { IoIosArrowDown } from 'react-icons/io';
import HashLoader from "react-spinners/HashLoader";
import axios from 'axios';
import { logout } from '../actions/userActions'
const VerifyScreen = ({ location, history }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerificationInput, setShowVerificationInput] = useState(false); // State to manage input field visibility

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);
    const { error, user } = userDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const logoutHandler = () => {
        dispatch(logout())
    }

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user.name) {
                dispatch(getUserDetails('profile'));
            }
        }
    }, [dispatch, history, userInfo, user]);


    const handleSendVerificationCode = async (event) => {
        event.preventDefault();
        try {
            await dispatch(sendVerificationCode(user.email));
            alert("Validation Code Sent to Email");
            setShowVerificationInput(true);
        } catch (err) {
            alert(
                err.response && err.response.data
                    ? err.response.data
                    : "Failed to send code"
            );
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            await dispatch(verifyCode(user.email, verificationCode));
            alert("Email Verified Successfully!");
            logoutHandler()
            history.push("/");
        } catch (error) {
            alert(
                error.response && error.response.data !== "Invalid verification code"
                    ? error.response.data
                    : "Can not verify code at this moment"
            );
        }
    };

    return (
        <div className="registerSc">
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <Image className="wave" src={wave} />
            <div className="containera">
                <div className="imga">
                    <Image src={addUs} />
                </div>
                <div className='rightinfos'>
                    {!showVerificationInput ? (
                        <div className='showbtn' style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button
                                onClick={handleSendVerificationCode}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '14px 20px',
                                    margin: '8px 0',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                Send Verification Code
                            </button>
                        </div>

                    ) : (
                        <div className='showbtn'>
                            Enter Verification Code that is sent to your email
                        </div>
                    )}
                    {showVerificationInput && (
                        <div className='login-content'>
                            <form onSubmit={submitHandler}>
                                {error && <h4>{error}</h4>}
                                <div className="input-div verification">
                                    <div className="i">
                                        <i className="fas fa-key"></i>
                                    </div>
                                    <div className="div">
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            className="inputa"
                                            placeholder="Enter verification code"
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btna2" >Submit</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyScreen;
