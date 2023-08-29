const { post, user, vote, comment } = require("../models");
const fs = require('fs');
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

let self = {};

/**
 * @description Get all Posts
 * @type GET 
 * @path /api/posts
 * @param {*} req 
 * @param {*} res 
 *  
 * @returns JSON
 */
self.getAllPosts = async (req, res) => {
    try {
        const postList = await post.findAll({
            attributes: ["post_id", "post_content", "post_pictureURL", "createdAt"],
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: user,
                    attributes: ["user_id", "firstName", "lastName", "user_pictureURL"]
                },
                {
                    model: vote,
                    attributes: ["user_id"]
                },
                {
                    model: comment,
                    attributes: ["comment_id", "comment_content", "createdAt"],
                    order: [["createdAt", "DESC"]],
                    include: [
                        {
                            model: user,
                            attributes: ["user_id", "firstName", "lastName", "user_pictureURL"]
                        }
                    ]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            count: postList.length,
            data: postList
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @description Create a new Post
 * @type POST 
 * @path /api/posts/:id
 * @param {*} req 
 * @param {*} res 
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.createPost = async (req, res) => {
    try {
        const userID = req.params.id;
        const userExist = await user.findOne({ where: { user_id: userID } });

        if (userExist) {
            const newPost = req.file
                ? {
                    user_id: userID,
                    post_content: req.body.post_content,
                    post_pictureURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }
                : {
                    user_id: userID,
                    post_content: req.body.post_content
                };

            await post.create(newPost);

            return res.status(201).json({
                success: true,
                data: newPost
            });

        } else {
            // In case the post can't be created, it directly deletes the uploaded file
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
 * @description Update the data of a specified Post
 * @type PUT 
 * @path /api/posts/:id
 * @param {*} req 
 * @param {*} res 
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.updatePost = async (req, res) => {
    try {
        const userID = req.params.id;
        const userExist = await user.findOne({ where: { user_id: userID } });

        if (userExist) {
            const postID = req.body.post_id;
            const postExist = await post.findOne({ where: { post_id: postID } });

            if (postExist) {
                const token = req.headers.authorization.split(' ')[1];

                // Check if the user is the post's writer or has admin rights
                if ((postExist.user_id == jwt.verify(token, process.env.TOKEN).userId) || userExist.isAdmin) {

                    // Check if the user removed picture from his post and did not added a new one
                    if (!req.file && postExist.post_pictureURL !== null) {
                        // Delete the picture removed by the user
                        fs.unlink('images/' + postExist.post_pictureURL.split('/images/')[1], () => { });
                        // Update the recorded post data in the database
                        const emptyPictureURL = {
                            post_pictureURL: "No picture"
                        };
                        await post.update({ ...emptyPictureURL }, { where: { post_id: postID } });
                    }

                    const postObject = req.file
                        ? {
                            ...fs.unlink('images/' + postExist.post_pictureURL.split('/images/')[1], () => { }),
                            post_content: req.body.post_content,
                            post_pictureURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                            updatedAt: Date.now()
                        }
                        : {
                            post_content: req.body.post_content,
                            updatedAt: Date.now()
                        };

                    await post.update({ ...postObject }, { where: { post_id: postID } });

                    return res.status(200).json({
                        success: true,
                        message: "Post updated!"
                    });

                } else {
                    // In case the post's data can't be updated, it directly deletes the uploaded file
                    if (req.file) {
                        fs.unlink('images/' + req.file.filename, () => { });
                    }

                    return res.status(401).json({
                        success: false,
                        message: "Request denied! You are neither the writer of this post or an admin!"
                    });
                }

            } else {
                if (req.file) {
                    fs.unlink('images/' + req.file.filename, () => { });
                }

                return res.status(404).json({
                    success: false,
                    message: `Post with the id=${postID} does not exist!`
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
 * @description Delete a specified Post
 * @type DELETE 
 * @path /api/posts/:id
 * @param {*} req 
 * @param {*} res
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.deletePost = async (req, res) => {
    try {
        const postID = req.body.post_id;
        const postExist = await post.findOne({ where: { post_id: postID } });

        if (postExist) {
            const token = req.headers.authorization.split(' ')[1];
            const tokenUserID = jwt.verify(token, process.env.TOKEN).userId;

            const userExist = await user.findOne({ where: { user_id: tokenUserID } });

            if ((postExist.user_id == tokenUserID) || userExist.isAdmin) {
                const destroyedPost = await post.destroy({ where: { post_id: postID } });

                if (destroyedPost === 1) {
                    // Only delete the picture when the user deletion has been confirmed
                    fs.unlink('images/' + postExist.post_pictureURL.split('/images/')[1], () => { });
                    return res.status(200).json({
                        success: true,
                        message: `Post deleted!`
                    });
                } else {
                    return res.status(500).json({
                        success: true,
                        message: `Post with the id=${postID} has not been deleted!`
                    });
                }

            } else {
                return res.status(401).json({
                    success: false,
                    message: "Request denied! You are neither the writer of this post or an admin!"
                });
            }

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

module.exports = self;