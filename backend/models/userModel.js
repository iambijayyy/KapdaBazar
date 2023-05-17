import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    verificationCode: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    passwordLastUpdated: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Update the passwordLastUpdated field before saving a new password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.passwordLastUpdated = Date.now(); // Update the passwordLastUpdated field
})

const User = mongoose.model('User', userSchema);
export default User;