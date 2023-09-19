import { useState } from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Comment from "../components/Comments";
import AddComment from "../components/AddComment";

function Posts({ props_isAdmin, renderOnQuery, props_post_id, props_post_content, props_post_pictureURL, props_post_createdAt, props_post_user_id, props_post_user_firstName, props_post_user_lastName,
                props_post_user_pictureURL, props_post_comments, props_post_voted, props_post_numberOfVotes, props_posts_icons, props_posts_notification }) {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    const [open, setOpen] = useState(false);
    const [postContent, setPostContent] = useState(props_post_content);
    const [pictureFile, setPictureFile] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [postID, setPostID] = useState();

    const handleOpen = (event) => {
        event.preventDefault();
        setPostID(event.target.getAttribute("data-post_id"));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updatePostPicture = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setPictureFile(event.target.files[0]);
        }
    };

    const handlePostDeletion = (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete this post? This action is irreversible!")) {
            const body = { post_id: event.target.getAttribute("data-post_id") };
            const formBody = Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');
            deletePost(formBody);
        }
    };

    const deletePost = async (formBody) => {
        await fetch(`http://localhost:8080/api/posts/${userId}`, {
            method: "DELETE",
            body: formBody,
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    renderOnQuery(Math.random());
                } else {
                    alert(`${data.message}`);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handlePostUpdate = (event) => {
        event.preventDefault();
        const newPostData = new FormData();
        newPostData.append("post_id", postID);
        newPostData.append("post_content", postContent);
        if (pictureFile) {
            newPostData.append("image", pictureFile);
        }
        updatePost(newPostData);
    };

    const updatePost = async (formBody) => {
        await fetch(`http://localhost:8080/api/posts/${userId}`, {
            method: "PUT",
            body: formBody,
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    handleClose();
                    renderOnQuery(Math.random());
                    // Empty pictureFile state so the post writer/admin can make it disappear when updating it
                    setPictureFile(false);
                } else {
                    alert(`${data.message}`);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleVote = (event) => {
        event.preventDefault();
        const body = { post_id: event.target.getAttribute("data-post_id") };
        const formBody = Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');
        votePost(formBody);
    };

    const votePost = async (formBody) => {
        await fetch(`http://localhost:8080/api/votes/${userId}`, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    renderOnQuery(Math.random());
                } else {
                    alert(`${data.message}`);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <div className="posts">

            {props_posts_notification ? <span className="posts__notification"></span> : null}

            <div className="posts__basics">
                <div className="posts__basics-userData">
                    <img className="posts__basics-userData-picture" src={props_post_user_pictureURL} alt="Avatar of the user" />
                    <p className="posts__basics-userData-name">{props_post_user_firstName} {props_post_user_lastName}</p>
                </div>
                <p className="posts__basics-date">{props_post_createdAt}</p>
            </div>

            <div className="posts__content">
                <p className="posts__content-text">{props_post_content}</p>
                {props_post_pictureURL ? <img className="posts__content-picture" src={props_post_pictureURL} alt="A pic uploaded by an user" /> : null}
            </div>

            <div className="posts__settings">
                <div data-post_id={props_post_id} className="posts__settings-postData">
                    {props_post_voted ? (
                        <svg data-post_id={props_post_id} onClick={handleVote} className="posts__settings-postData-heartIcon" clipRule="evenodd" viewBox="0 0 24 24">
                            <path data-post_id={props_post_id} d="m12 5.72c-2.624-4.517-10-3.198-10 2.461 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-5.678-7.396-6.944-10-2.461z" fillRule="nonzero" fill="#ff4500" />
                        </svg>
                    ) : (
                        <svg data-post_id={props_post_id} onClick={handleVote} className="posts__settings-postData-heartIcon" clipRule="evenodd" viewBox="0 0 24 24">
                            <path data-post_id={props_post_id} d="m12 5.72c-2.624-4.517-10-3.198-10 2.461 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-5.678-7.396-6.944-10-2.461z" fillRule="nonzero" />
                        </svg>
                    )}
                    <p className="posts__settings-postData-likeNumber">{props_post_numberOfVotes}</p>
                </div>
                {(props_posts_icons || props_isAdmin) ? (
                    <div className="posts__settings-postData-manipulation">
                        <svg data-post_id={props_post_id} data-post_user_id={props_post_user_id} onClick={handleOpen} className="posts__settings-postData-manipulation-penIcon" viewBox="0 0 24 24">
                            <path data-post_id={props_post_id} data-post_user_id={props_post_user_id} d="M12.014 6.54s2.147-3.969 3.475-6.54l8.511 8.511c-2.583 1.321-6.556 3.459-6.556 3.459l-5.43-5.43zm-8.517 6.423s-1.339 5.254-3.497 8.604l.827.826 3.967-3.967c.348-.348.569-.801.629-1.288.034-.27.153-.532.361-.74.498-.498 1.306-.498 1.803 0 .498.499.498 1.305 0 1.803-.208.209-.469.328-.74.361-.488.061-.94.281-1.288.63l-3.967 3.968.826.84c3.314-2.133 8.604-3.511 8.604-3.511l4.262-7.837-3.951-3.951-7.836 4.262z" />
                        </svg>
                        <svg data-post_id={props_post_id} data-post_user_id={props_post_user_id} onClick={handlePostDeletion} className="posts__settings-postData-manipulation-binIcon" viewBox="0 0 24 24">
                            <path data-post_id={props_post_id} data-post_user_id={props_post_user_id} d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z" fillRule="nonzero" />
                        </svg>
                    </div>
                ) : null}
            </div>

            <div className="centerButton centerButton--hzl">
                <button className="btn btn--whiteBG btn--borderless collapsible" aria-describedby="See comments of this posts" type="button" onClick={() => setExpanded(!expanded)}>See comments</button>
            </div>

            {expanded ? (
                <div className="commentsList">
                    {props_post_comments.map(comment => {
                        if (comment.user.user_pictureURL === "BasicFrontEndAvatar") {
                            comment.user.user_pictureURL = require("../assets/images/avatar.png");
                        }
                        if (comment.user.user_id === Number(userId) || props_isAdmin) {
                            comment.icons = true;
                        } else {
                            comment.icons = false;
                        }
                        return (
                            <Comment
                                key={comment.comment_id}
                                props_comment_id={comment.comment_id}
                                props_comment_content={comment.comment_content}
                                props_comment_user_id={comment.user.user_id}
                                props_comment_user_firstName={comment.user.firstName}
                                props_comment_user_lastName={comment.user.lastName}
                                props_comment_user_pictureURL={comment.user.user_pictureURL}
                                props_comment_icons={comment.icons}
                                renderOnQuery={renderOnQuery}
                            />
                        );
                    })}
                </div>

            ) : null}
            <AddComment
                props_post_id={props_post_id}
                renderOnQuery={renderOnQuery}
            />



            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        Update your  <b>post</b> and click on <b>confirm</b> !
                    </DialogContentText>
                    <TextField
                        name="post_content"
                        type="text"
                        label="Post content"
                        placeholder="Write your new post here!"
                        aria-labelledby="updatePostContent"
                        aria-describedby="Please enter your new post in this field."
                        value={postContent}
                        onChange={(event) => setPostContent(event.target.value)}
                        fullWidth
                        multiline
                        maxRows={6}
                        inputProps={{
                            maxLength: 199,
                            minLength: 2
                        }}
                    />
                    <input
                        id="fileUpload"
                        name="post_pictureURL"
                        aria-labelledby="post_pictureURL"
                        aria-describedby="Please add your post picture"
                        type="file"
                        accept=".png, .jpeg, .jpg, .gif"
                        onChange={updatePostPicture}
                        onClick={event => event.target.value = null}
                    />
                </DialogContent>
                <DialogActions>
                    <button className="btn btn--blue btn--big" aria-label="Close" onClick={handleClose}>Cancel</button>
                    <button className="btn btn--blue btn--big" aria-label="Confirm" onClick={handlePostUpdate}>Confirm</button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Posts;
