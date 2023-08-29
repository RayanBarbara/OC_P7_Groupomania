const fs = require("fs");

exports.validNames = async (req, res, next) => {
    try {
        const namesRegex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

        if (namesRegex.test(req.body.firstName)) {

            if (namesRegex.test(req.body.lastName)) {
                next();
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Only letters are allowed for the last name, and the first letter must be an upper case!"
                });
            }

        } else {
            return res.status(401).json({
                success: false,
                message: "Only letters are allowed for the first name, and the first letter must be an upper case!"
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

exports.validEmail = async (req, res, next) => {
    try {
        const emailRegex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g);

        if (emailRegex.test(req.body.email)) {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "The email format is invalid!"
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

exports.validPassword = async (req, res, next) => {
    try {
        const passwordRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/);

        if (passwordRegex.test(req.body.password)) {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long!"
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

exports.validUserDescription = async (req, res, next) => {
    try {
        const contentRegex = new RegExp(/^.{2,199}$/);

        if (contentRegex.test(req.body.user_description)) {
            next();
        } else {
            // In case the middleware doesn't pass the request, it directly deletes the uploaded file
            if (req.file) {
                fs.unlink('images/' + req.file.filename, () => { });
            }
            return res.status(401).json({
                success: false,
                message: "The user's description must be 2-199 characters long!"
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

exports.validPostContent = async (req, res, next) => {
    try {
        const contentRegex = new RegExp(/^.{2,199}$/);

        if (contentRegex.test(req.body.post_content)) {
            next();
        } else {
            if (req.file) {
                fs.unlink('images/' + req.file.filename, () => { });
            }
            return res.status(401).json({
                success: false,
                message: "The post's content must be 2-199 characters long!"
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

exports.validCommentContent = async (req, res, next) => {
    try {
        const contentRegex = new RegExp(/^.{2,99}$/);

        if (contentRegex.test(req.body.comment_content)) {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "The comment's content must be 2-99 characters long!"
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        });
    }
};