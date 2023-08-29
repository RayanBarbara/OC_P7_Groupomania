import { useState } from "react";

import avatar from "../assets/images/avatar.png";

function AddPost({renderOnQuery}) {
  const [postContent, setPostContent] = useState("");
  const [pictureFile, setPictureFile] = useState(false);

  // Function that allow to load pictures
  const updateAvatar = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setPictureFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create a particular data form that can be read by the back-end (multer) since a picture is potentially present inside
    const newPost = new FormData();
    newPost.append("post_content", postContent);
    if (pictureFile) {
      newPost.append("image", pictureFile);
    }
    addPost(newPost);
  };

  
  const addPost = async (body) => {
    await fetch(`http://localhost:8080/api/posts/${sessionStorage.getItem("userId")}`, {
      method: "POST",
      body: body,
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("addPostForm").reset();
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
    <div id="addPostContainer">

      <img id="postProfilePicture" src={sessionStorage.getItem("userPictureURL") ? sessionStorage.getItem("userPictureURL") : avatar} alt="Avatar of the user" />

      <form id="addPostForm" className="addPostForm" aria-label="Write a post" onSubmit={handleSubmit}>
        <textarea
          id="post_content"
          className="addPostForm__content"
          name="post_content"
          type="text"
          placeholder="Your post must be 2-199 characters long!"
          aria-labelledby="post_content"
          aria-describedby="Please enter your post content in this field."
          rows="5"
          cols="45"
          onChange={(event) => setPostContent(event.target.value)}
          minLength={2}
          maxLength={199}
          required
        />

        <input
          id="post_pictureURL"
          className="addPostForm__picture"
          name="post_pictureURL"
          aria-labelledby="post_pictureURL"
          aria-describedby="Please add your post picture in this field."
          type="file"
          accept=".png, .jpeg, .jpg, .gif"
          onChange={updateAvatar}
          onClick={event => event.target.value = null}
        />

        <div className="centerButton centerButton--hzl">
          <button className="btn btn--blue btn--big" type="submit">Publish your post</button>
        </div>

      </form>

    </div>
  );
}

export default AddPost;