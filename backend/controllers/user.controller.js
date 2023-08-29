const { user } = require("../models");
const bcrypt = require('bcrypt');
const fs = require('fs');

let self = {};

/**
 * @description Get a specified User
 * @type GET 
 * @path /api/users/:id
 * @param {*} req 
 * @param {*} res 
 * @param {Number} - id: user_id
 *  
 * @returns JSON
*/
self.getUser = async (req, res) => {
    try {
        const userData = await user.findOne({ where: { user_id: req.params.id } });

        return res.status(200).json({
            success: true,
            data: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @description Update the data of a specified User
 * @type PUT
 * @path /api/users/:id
 * @param {*} req
 * @param {*} res
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.updateUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const userExist = await user.findOne({ where: { user_id: userID } });

        if (userExist) {
            const userObject = req.file
                ? {
                    ...fs.unlink('images/' + userExist.user_pictureURL.split('/images/')[1], () => { }),
                    user_pictureURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                    user_description: req.body.user_description,
                    updatedAt: Date.now()
                }
                : {
                    user_description: req.body.user_description,
                    updatedAt: Date.now()
                };

            const updatedUser = await user.update({ ...userObject }, { where: { user_id: userID } });

            if (updatedUser[0] === 1) {
                return res.status(200).json({
                    success: true,
                    message: "User updated!"
                });
            } else {
                // In case the user's data can't be updated, it directly deletes the uploaded file
                if (req.file) {
                    fs.unlink('images/' + req.file.filename, () => { });
                }
                return res.status(500).json({
                    success: false,
                    message: `The user with the id=${userID} has not been updated!`
                });
            }

        } else {
            if (req.file) {
                fs.unlink('images/' + req.file.filename, () => { });
            }

            return res.status(404).json({
                success: false,
                message: `User with the id=${userID} does not exist!`
            });
        }

    } catch (error) {
        if (req.file) {
            fs.unlink('images/' + req.file.filename, () => { });
        }

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @description Delete a specified User
 * @type DELETE 
 * @path /api/users/:id
 * @param {*} req 
 * @param {*} res
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.deleteUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const userExist = await user.findOne({ where: { user_id: userID } });

        const checkPassword = bcrypt.compareSync(req.body.password, userExist.password);

        if (checkPassword) {
            const destroyedUser = await user.destroy({ where: { user_id: userID } });

            if (destroyedUser === 1) {
                // Only delete the picture when the user deletion has been confirmed
                fs.unlink('images/' + userExist.user_pictureURL.split('/images/')[1], () => { });
                return res.status(200).json({
                    success: true,
                    message: "User deleted!"
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: `The user with the id=${userID} has not been deleted!`
                });
            }

        } else {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect!"
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