const { vote, post } = require("../models");
require("dotenv").config({ path: "../config/.env" });

let self = {};

/**
 * @description Update a Vote
 * @type POST 
 * @path /api/votes/:id
 * @param {*} req 
 * @param {*} res
 * @param {Number} - id: user_id
 * 
 * @returns JSON
 */
self.vote = async (req, res) => {
    try {
        const postID = req.body.post_id;
        const postExist = await post.findOne({ where: { post_id: postID } });

        if (postExist) {
            const userID = req.params.id;
            const likeExist = await vote.findOne({ where: { post_id: postID, user_id: userID } });

            if (!likeExist) {
                await vote.create({
                    post_id: postID,
                    user_id: userID,
                    vote: true
                });

                return res.status(201).json({
                    success: true,
                    message: `A like from the user with the id=${userID} has been added to the post with the id=${postID}!`
                });

            } else {
                await vote.destroy({
                    where: {
                        post_id: postID,
                        user_id: userID
                    },
                });

                return res.status(200).json({
                    success: true,
                    message: `A like from the user with the id=${userID} has been removed to the post with the id=${postID}!`
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