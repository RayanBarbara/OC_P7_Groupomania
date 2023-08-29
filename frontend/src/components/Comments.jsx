import { useState } from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function Comments({ renderOnQuery, props_comment_id, props_comment_content, props_comment_user_id, props_comment_user_firstName, props_comment_user_lastName, props_comment_user_pictureURL, props_comment_icons }) {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    const [open, setOpen] = useState(false);
    const [commentContent, setCommentContent] = useState(props_comment_content);
    const [postID, setPostID] = useState();

    const handleOpen = (event) => {
        event.preventDefault();
        setPostID(event.target.getAttribute("data-comment_id"));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCommentDeletion = (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete this comment? This action is irreversible!")) {
            const body = { comment_id: event.target.getAttribute("data-comment_id") };
            const formBody = Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');
            deleteComment(formBody);
        }
    };

    const handleCommentUpdate = (event) => {
        event.preventDefault();
        const body = {
            comment_id: postID,
            comment_content: commentContent
        };
        const formBody = Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');
        updateComment(formBody);
    };

    const deleteComment = async (formBody) => {
        await fetch(`http://localhost:8080/api/comments/${userId}`, {
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

    const updateComment = async (formBody) => {
        await fetch(`http://localhost:8080/api/comments/${userId}`, {
            method: "PUT",
            body: formBody,
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    handleClose();
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
        <div id="comments" className="comments">

            <div className="comments__basics">

                <div className="comments__basics-userData">
                    <img className="comments__basics-userData-picture" src={props_comment_user_pictureURL} alt="Avatar of the user" />
                    <p className="comments__basics-userData-name">{props_comment_user_firstName} {props_comment_user_lastName}</p>
                </div>

                {props_comment_icons ? (
                    <div className="comments__settings">
                        <svg data-comment_id={props_comment_id} data-comment_user_id={props_comment_user_id} onClick={handleOpen} className="comments__settings-penIcon" viewBox="0 0 24 24">
                            <path data-comment_id={props_comment_id} data-comment_user_id={props_comment_user_id} d="M12.014 6.54s2.147-3.969 3.475-6.54l8.511 8.511c-2.583 1.321-6.556 3.459-6.556 3.459l-5.43-5.43zm-8.517 6.423s-1.339 5.254-3.497 8.604l.827.826 3.967-3.967c.348-.348.569-.801.629-1.288.034-.27.153-.532.361-.74.498-.498 1.306-.498 1.803 0 .498.499.498 1.305 0 1.803-.208.209-.469.328-.74.361-.488.061-.94.281-1.288.63l-3.967 3.968.826.84c3.314-2.133 8.604-3.511 8.604-3.511l4.262-7.837-3.951-3.951-7.836 4.262z" />
                        </svg>
                        <svg data-comment_id={props_comment_id} data-comment_user_id={props_comment_user_id} onClick={handleCommentDeletion} className="comments__settings-binIcon" viewBox="0 0 24 24">
                            <path data-comment_id={props_comment_id} data-comment_user_id={props_comment_user_id} d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z" fillRule="nonzero" />
                        </svg>
                    </div>
                ) : (
                    <span></span>
                )}

            </div>
            <p className="comments__text">{props_comment_content}</p>



            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        Update your  <b>comment</b> and click on <b>confirm</b> !
                    </DialogContentText>
                    <TextField
                        id="updateCommentContent"
                        type="text"
                        name="comment_content"
                        placeholder="Write your new comment here!"
                        aria-labelledby="updateCommentContent"
                        aria-describedby="Please enter your new comment in this field."
                        value={commentContent}
                        onChange={(event) => setCommentContent(event.target.value)}
                        fullWidth
                        multiline
                        maxRows={6}
                        inputProps={{
                            maxLength: 199,
                            minLength: 2
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <button className="btn btn--blue btn--big" aria-label="Close" onClick={handleClose}>Cancel</button>
                    <button className="btn btn--blue btn--big" aria-label="Confirm" onClick={handleCommentUpdate}>Confirm</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Comments;
