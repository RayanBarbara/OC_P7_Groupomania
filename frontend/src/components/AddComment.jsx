import { useState } from "react";

function AddComment({renderOnQuery, props_post_id}) {
  const [commentContent, setCommentContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    //Create object that will be send to the back-end via fetch API
    const body = {
      post_id: event.target.getAttribute("data-post_id"),
      comment_content: commentContent
    };
    const formBody = Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');
    addComment(formBody);
  };

  const addComment = async (formBody) => {
    await fetch(`http://localhost:8080/api/comments/${sessionStorage.getItem("userId")}`, {
      method: "POST",
      body: formBody,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCommentContent('');
          // Sent back to the Feed component a random number so a new render (UseEffect) can take place
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
    <form data-post_id={props_post_id} id="addCommentForm" className="addCommentForm" aria-label="Add a comment to a post" onSubmit={handleSubmit}>
      <input
        className="addCommentForm__ipt"
        name="comment_content"
        type="text"
        placeholder="Your comment must be 2-99 characters long!"
        aria-labelledby="comment_content"
        aria-describedby="Please enter your comment in this field"
        onChange={(event) => setCommentContent(event.target.value)}
        minLength={2}
        maxLength={99}
        value={commentContent}
        required
      />
      <button className="btn btn--blue btn--small btn--round btn--ripple" aria-label="Comment" type="submit">Send</button>
    </form>
  );
}

export default AddComment;
