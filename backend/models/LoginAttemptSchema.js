import mongoose from 'mongoose'

const loginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  isSuccess: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

export default LoginAttempt
