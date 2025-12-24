import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
