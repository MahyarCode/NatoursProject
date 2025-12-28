import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter your name.'],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'The email is invalid'],
        required: [true, 'Please enter your email.'],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please enter your password.'],
        minlength: [8, 'The password should be more than 8 characters'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        // the custom validator only works on CREATE & SAVE!!! not on update or edit
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same',
        },
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now(),
    },

    passwordResetToken: {
        type: String,
    },

    passwordResetExpires: {
        type: Date,
    },

    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre('save', async function (next) {
    // only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    // hash the password
    this.password = await bcrypt.hash(this.password, 12);
    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedPassword = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        return JWTTimestamp < changedPassword;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
