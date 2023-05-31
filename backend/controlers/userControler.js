import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import sendVerificationCodeToMail from '../middleware/email.js';
import generateVerificationCode from './verification.js';
import LoginAttempt from '../models/LoginAttemptSchema.js';
import audit from '../log.js';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user and previous login attempts
    const user = await User.findOne({ email });
    const loginAttempts = await LoginAttempt.find({ email }).sort({ timestamp: -1 });

    // Check if the user exists
    if (!user) {
        const customMessage = 'USER EXISTS SO LOGGING IN PROCESS ONGOING';
        audit.log(req, res, customMessage);
        res.status(401);
        throw new Error('Email is incorrect');
    }

    const maxFailedAttempts = 5; // Define the maximum allowed failed attempts
    const lockoutDurationInMinutes = 1; // Define the lockout duration in minutes
    const currentTime = new Date();
    const failedAttemptsWithinLockoutDuration = loginAttempts
        .filter(attempt => !attempt.isSuccess
            && (currentTime - attempt.timestamp) / (1000 * 60) < lockoutDurationInMinutes);

    if (failedAttemptsWithinLockoutDuration.length >= maxFailedAttempts) {
        const customMessage = 'ACCOUNT IS RESTRICTED SO LOGIN UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        return res.status(401).json({
            message: `Account is locked due to too many failed login attempts. Try again after 1 minute.`,
        });
        
    }
    // If the user is verified and the password is correct
    if (await user.matchPassword(password)) {
        // Check if the password is older than 5 minutes
        const currentDate = new Date();
        const timeDifferenceInDays = (currentDate - user.passwordLastUpdated) / (1000 * 60);

        if (timeDifferenceInDays > 300) {
            const message = "User's password is Outdated. Please update it.";
            const customMessage = 'PASSWORD IS OUTDATED BUT LOGIN SUCCESFUL';
            audit.log(req, res, customMessage);
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                verificationCode: user.verificationCode,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
                updatedAt: user.updatedAt,
                passwordLastUpdated: user.passwordLastUpdated,
                token: generateToken(user._id),
                message: message,
            });
        }

        // Check if the user's email matches the admin email
        const isAdminUser = user.email === 'bijay.gautam1501@gmail.com';

        // If the user's email matches the admin email and the user is verified, set isAdmin to true
        if (isAdminUser) {
            const customMessage = 'ADMIN LOGGING IN GOING ON';
            audit.log(req, res, customMessage);
            user.isAdmin = true;
            await user.save();
        }

        // If login is successful, reset failed login attempts
        await LoginAttempt.deleteMany({ email });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            verificationCode: user.verificationCode,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            passwordLastUpdated: user.passwordLastUpdated,
            updatedAt: user.updatedAt,
            token: generateToken(user._id),
        });
        const customMessage = 'ADMIN LOGGED IN SUCCESSFULLY';
        audit.log(req, res, customMessage);
    } else {
        // If login fails, record the failed attempt
        await LoginAttempt.create({ email, isSuccess: false });
        res.status(401).json({ message: 'Password is incorrect' });
        const customMessage = 'ADMIN LOGGING UNSUCCESSFUL';
        audit.log(req, res, customMessage);
    }
});



// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const customMessage = 'REGISTRATION PROCESS STARTED';
    audit.log(req, res, customMessage);
    const { name, email, password } = req.body;

    // name validation regular expression
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!name.match(nameRegex)) {
        const customMessage = 'NAME REGEX MISMATCH';
        audit.log(req, res, customMessage);
        res.status(400);
        throw new Error('Invalid name');
    }
     // Email validation regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailRegex)) {
        const customMessage = 'EMAIL REGEX MISMATCH SO REGISTRATION UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        res.status(400);
        throw new Error('Invalid email address');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        const customMessage = 'USER IS ALREADY IN THE SYSTEM SO REGISTRATION UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        res.status(400);
        throw new Error('User already exists');
    }
    // Password validation regular expression
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
        const customMessage = 'PASSWORD REGEX MISMATCH SO REGISTRATION UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        res.status(400);
        throw new Error('Password must be 8-12 digit alphanumeric bicase including special characters');
    }
    // Convert both the password and personal information to lowercase
    const lowerCasePassword = password.toLowerCase();
    const lowerCaseName = name.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();

    // Check if the password contains the user's name or email
    if (lowerCasePassword.includes(lowerCaseName) || lowerCasePassword.includes(lowerCaseEmail)) {
        const customMessage = 'PASSWORD CONTAINS PERSONAL INFORMATION SO REGISTRATION UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        res.status(400);
        throw new Error('Password cannot contain your name or email');
    }

    // Check if the password contains any individual word from the user's name
    const nameWords = lowerCaseName.split(' ');
    for (const word of nameWords) {
        if (lowerCasePassword.includes(word)) {
            const customMessage = 'PASSWORD REGEX MISMATCH SO REGISTRATION UNSUCCESSFUL';
            audit.log(req, res, customMessage);
            res.status(400);
            throw new Error('Password cannot contain your name or email');
        }
    }

    // Check for white spaces in the password
    if (lowerCasePassword.includes(' ')) {
        const customMessage = 'PASSWORD CONTAINS WHITE SPACES SO REGISTRATION UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        res.status(400);
        throw new Error('Password cannot contain white spaces');
    }

    const user = await User.create({
        name,
        email,
        password,
        isAdmin: false,
    });

    if (user) {
        const customMessage = 'USER CREATED SUCCESSFULLY';
        audit.log(req, res, customMessage);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        const customMessage = 'USER REGISTERING UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        throw new Error('Invalid user data');
    }
});




// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {
        const customMessage = 'USER PROFILE ACCESSED';
        audit.log(req, res, customMessage);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,

        })
    } else {
        const customMessage = 'USER PROFILE NOT FOUND';
        audit.log(req, res, customMessage);
        res.status(404)
        throw new Error('User not found')
    }


})


// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        const customMessage = 'USER NOT FOUND';
        audit.log(req, res, customMessage);
        res.status(404);
        throw new Error('User not found');
    }

    // Check if the user is verified
    if (!user.isVerified) {
        res.status(400);
        const customMessage = 'USER TRIED TO UPDATE PROFILE WITHOUT VERYFYING SO FAILED';
        audit.log(req, res, customMessage);
        throw new Error('Please verify your account to update your profile.');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
        // Password validation regular expression
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(req.body.password)) {
            res.status(400);
            const customMessage = 'PASSWORD REGEX MISMATCH SO UPDATE UNSUCCESSFUL';
            audit.log(req, res, customMessage);

            throw new Error('Password must contain at least 8 characters including uppercase, lowercase, digit, and special characters.');
        }

        // Convert both the password and personal information to lowercase
        const lowerCasePassword = req.body.password.toLowerCase();
        const lowerCaseName = user.name.toLowerCase();
        const lowerCaseEmail = user.email.toLowerCase();

        // Check if the password contains the user's name or email
        if (lowerCasePassword.includes(lowerCaseName) || lowerCasePassword.includes(lowerCaseEmail)) {
            res.status(400);
            const customMessage = 'PASSWORD CANNOT CONTAIN PERSONAL INFO SO UPDATE UNSUCCESSFUL';
            audit.log(req, res, customMessage);
            console.log('Password cannot contain your name or email')
            throw new Error('Password cannot contain your name or email');
        }

        // Check if the password contains any individual word from the user's name
        const nameWords = lowerCaseName.split(' ');
        for (const word of nameWords) {
            if (lowerCasePassword.includes(word)) {
                const customMessage = 'PASSWORD CANNOT CONTAIN PERSONAL INFO SO UPDATE UNSUCCESSFUL';
                audit.log(req, res, customMessage);
                res.status(400);
                throw new Error('Password cannot contain your name or email');
            }
        }

        // Check for white spaces in the password
        if (lowerCasePassword.includes(' ')) {
            const customMessage = 'PASSWORD CANNOT CONTAIN WHITE SPACE INFO SO UPDATE UNSUCCESSFUL';
            audit.log(req, res, customMessage);
            res.status(400);
            throw new Error('Password cannot contain white spaces');
        }

        user.password = req.body.password;
        user.passwordLastUpdated = Date.now();
    }

    const updatedUser = await user.save();
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
    });
    const customMessage = 'PROFILE UPDATE SUCCESSFUL';
    audit.log(req, res, customMessage);
});



// @desc Update user user
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,

        })
        const customMessage = 'USER ROLE CHANGE SUCCESSFUL';
        audit.log(req, res, customMessage);
    } else {
        const customMessage = 'USER ROLE CHANGE UNSUCCESSFUL';
        audit.log(req, res, customMessage);
        res.status(404)
        throw new Error('User not found')
    }


})

// @desc Get All users
// @route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find({})
    res.json(users)



})
// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/admin
const getUserByID = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
        console.log(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }



})
// @desc Delete User
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }


})

const sendVerificationCode = async (req, res, next) => {
    const { email } = req.body;
    console.log(email)
    try {
        // Generate a verification code
        const verificationCode = generateVerificationCode();

        // Save the verification code in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json('User not found');
        }
        user.verificationCode = verificationCode;
        await user.save();

        // Send the verification code to the user's mail
        sendVerificationCodeToMail(email, verificationCode);

        // console.log("Generated verification code:", verificationCode);
        return res.status(200).json({ message: 'Verification code sent successfully', verificationCode });
    } catch (error) {
        console.log(error)
        next(error);
    }
};



const verifyCode = (req, res, next) => {
    const { email } = req.body;
    const { verificationCode } = req.body;
    console.log("this is user email", email);

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json('User not found');
            }

            console.log("user found", user);

            if (user.verificationCode !== verificationCode) {
                console.log(user.verificationCode, verificationCode);
                return res.status(400).json('Invalid verification code');
            }

            // If the verification code is correct, update user.isVerified to true
            user.isVerified = true;
            user.save() // Save the updated user object
                .then(() => {
                    res.status(200).json({ message: 'Code is correct', verificationCode: user.verificationCode });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json('Failed to verify code');
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json('Failed to verify code');
        });
};

export { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserByID, updateUser, sendVerificationCode, verifyCode }
