const { comment, post, user } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

let self = {};

/**
 * @description Create a new Comment
 * @type POST 
 * @path /api/comments/:id
 * @param {*} req 
 * @param {*} res 
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.createComment = async (req, res) => {
    try {
        const postID = req.body.post_id;
        const postExist = await post.findOne({ where: { post_id: postID } });

        if (postExist) {
            const newComment = {
                user_id: req.params.id,
                post_id: postID,
                comment_content: req.body.comment_content
            };

            await comment.create(newComment);

            return res.status(201).json({
                success: true,
                data: newComment
            });

        } else {
            return res.status(404).json({
                success: false,
                message: `Post with the id=${postID} does not exist!`
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
 * @description Update the data of a specified Comment
 * @type PUT 
 * @path /api/comments/:id
 * @param {*} req 
 * @param {*} res 
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.updateComment = async (req, res) => {
    try {
        const commentID = req.body.comment_id;
        const commentExist = await comment.findOne({ where: { comment_id: commentID } });

        if (commentExist) {
            const token = req.headers.authorization.split(' ')[1];

            const userExist = await user.findOne({ where: { user_id: req.params.id } });
            const userPosition = userExist.isAdmin;

            if ((commentExist.user_id == jwt.verify(token, process.env.TOKEN).userId) || userPosition) {
                const newComment = {
                    comment_content: req.body.comment_content
                };

                await comment.update({ ...newComment }, { where: { comment_id: commentID } });

                return res.status(200).json({
                    success: true,
                    message: "Comment updated!"
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: "Request denied! You are neither the writer of this comment or an admin!"
                });
            }

        } else {
            return res.status(404).json({
                success: false,
                message: `Comment with the id=${commentID} does not exist!`
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
 * @description Delete a specified Comment
 * @type DELETE 
 * @path /api/comments/:id
 * @param {*} req 
 * @param {*} res
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.deleteComment = async (req, res) => {
    try {
        const commentID = req.body.comment_id;
        const commentExist = await comment.findOne({ where: { comment_id: commentID } });

        const token = req.headers.authorization.split(' ')[1];
        const tokenUserID = jwt.verify(token, process.env.TOKEN).userId;

        const userExist = await user.findOne({ where: { user_id: tokenUserID } });
        const userPosition = userExist.isAdmin;

        if (commentExist) {

            if ((commentExist.user_id == tokenUserID) || userPosition) {
                const destroyedComment = await comment.destroy({ where: { comment_id: commentID } });

                if (destroyedComment === 1) {
                    return res.status(200).json({
                        success: true,
                        message: "Comment deleted!"
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: `Comment with the id=${commentID} has not been deleted!`
                    });
                }

            } else {
                return res.status(401).json({
                    success: false,
                    message: "Request denied! You are neither the writer of this comment or an admin!"
                });
            }

        } else {
            return res.status(404).json({
                success: false,
                message: `Comment with the id=${commentID} does not exist!`
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