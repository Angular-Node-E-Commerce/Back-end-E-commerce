const User =require("../models/usersModel");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");

const {promisify}=require('util');
const jwtSign = promisify(jwt.sign);

const AppError = require("../utils/AppError");
const logger = require("../utils/logger");



exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        logger.error(`Error getting users: ${err.message}`);
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role, profile } = req.body;
        const { firstName, lastName, address } = profile;
        const { country, city, street } = address;
        const hashingpassword = await bcrypt.hash(password, 12);
        const user = new User({ username, email, password: hashingpassword,
            profile:{firstName,lastName,
                address:{country,city,street}}
            });
        await user.save();
        res.send("User signup done");
    } catch (err) {
        logger.error(`Error during signup: ${err.message}`);
        next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(404).send("Invalid email or password");

        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
            const token = await jwtSign({ userId: user._id }, "secret", { expiresIn: "5d" });
            res.send({ message: "User logged in", token });
        } else {
            res.status(404).send("Invalid email or password");
        }
    } catch (err) {
        logger.error(`Error during login: ${err.message}`);
        next(err);
    }
};

// error i dont know it //////////////////////////////////////
exports.getCurrentUser = async (req, res, next) => {
    try {
        
        const currentUser = req.user;
        
        if (!currentUser) {
            res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(currentUser);
    } catch (err) {
        logger.error(`Error getting current user: ${err.message}`);
        next(err);
    }
};
exports.updateCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user._id; 
        const updateData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData);

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        logger.error(`Error updating user: ${err.message}`);
        next(err);
    }
};

// exports.deleteUser = async (req, res, next) => {
//     try {
//         const deleteduser = req.params.email;
//         await User.deleteOne({ email: deleteduser });
//         res.send("Deleted user done");
//     } catch (err) {
//         logger.error(`Error deleting user: ${err.message}`);
//         next(err);
//     }
// };