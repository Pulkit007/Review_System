const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (user.isLocked) {
            const timeRemainingInLock = new Date().getTime() - user.lastLoginAttempt;
            if (timeRemainingInLock > 60000) {
                user.invalidLoginAttempts = 0;
                user.isLocked = false;
                await user.save();
            }
            else {
                return res.status(400).json({ message: 'User is locked' });
            }
        }

        user.lastLoginAttempt = new Date().getTime();
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            user.invalidLoginAttempts += 1;
            if (user.invalidLoginAttempts >= 4) {
                user.isLocked = true;
            }
            await user.save();
            return res.status(400).json({ message: "Invalid credentials." });
        }
        user.invalidLoginAttempts = 0;
        user.isLocked = false;
        await user.save();
        const token = jwt.sign(
            { email: user.email, id: user._id },
            "test",
            { expiresIn: "1h" }
        );
        res.status(200).json({ result: user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashPassword
        });
        await newUser.save();
        res.status(200).json({ result: newUser });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signIn, signUp };