const { user } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../config/.env" });

let self = {};

/**
 * @description Register a new User
 * @type POST 
 * @path /api/signup
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns JSON
 */
self.signUp = async (req, res) => {
    try {
        const emailSend = req.body.email;
        const checkEmail = await user.findOne({ where: { email: emailSend } });

        if (!checkEmail) {
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: emailSend,
                password: bcrypt.hashSync(req.body.password, 12)
            };

            await user.create(newUser);

            return res.status(201).json({
                success: true,
                message: "The user has been successfully registered!"
            });

        } else {
            return res.status(401).json({
                success: false,
                message: `A user with the email=${emailSend} already exist!`
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @description Login a registered User
 * @type POST 
 * @path /api/login
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns JSON
 */
self.login = async (req, res) => {
    try {
        const emailSend = req.body.email;
        const checkUserEmail = await user.findOne({ where: { email: emailSend } });

        if (checkUserEmail) {
            const checkPassword = bcrypt.compareSync(req.body.password, checkUserEmail.password);

            if (checkPassword) {
                // Create a JWT token
                const token = jwt.sign({ userId: checkUserEmail.user_id }, process.env.TOKEN, { expiresIn: '12h' });

                return res.status(200).json({
                    success: true,
                    userId: checkUserEmail.user_id,
                    token: token
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: "The password is incorrect!"
                });
            }

        } else {
            return res.status(401).json({
                success: false,
                message: `A user with the email=${emailSend} does not exist!`
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = self;