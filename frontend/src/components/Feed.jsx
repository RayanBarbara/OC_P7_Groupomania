import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import AddPost from "../components/AddPost";
import Posts from "../components/Posts";

function Feed() {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [render, setRender] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Function which check for a given user (ID) if he liked a particular post
  const checkIfUserLiked = (votersList) => {
    var hasVoted = false;
    for (var i = 0; i < votersList.length; i++) {
      if (votersList[i].user_id === Number(userId)) {
        hasVoted = true;
      }
    }
    return hasVoted;
  };

  useEffect(() => {
    const updateUserLastVisitDate = async () => {
      await fetch(`http://localhost:8080/api/users/lastVisit/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            alert(`${data.message}`);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    const getUserData = async () => {
      await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setIsAdmin(data.data.isAdmin);
            let lastVisitDate = new Date(data.data.lastVisitDate).valueOf();
            sessionStorage.setItem("lastVisit", lastVisitDate);
          } else {
            alert(`${data.message}`);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    const getAllPostsData = async () => {
      await fetch(`http://localhost:8080/api/posts`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPosts(posts => []);
            let numberOfPosts = data.count;
            let lastVisitDate = sessionStorage.getItem("lastVisit");

            // Re-write some data to make it easier to use
            for (let i = 0; i < numberOfPosts; i++) {
              let postCreationDate = new Date(data.data[i].createdAt).valueOf();

              if (data.data[i].post_pictureURL === "No picture") {
                data.data[i].post_pictureURL = null;
              }

              if (data.data[i].user.user_pictureURL === "BasicFrontEndAvatar") {
                data.data[i].user.user_pictureURL = require("../assets/images/avatar.png");
              }

              if (data.data[i].user.user_id === Number(userId)) {
                data.data[i].icons = true;
              } else {
                data.data[i].icons = false;
              }

              // Check if the post was not written by the user and if it was created after his last visit
              if (data.data[i].user.user_id !== Number(userId)) {
                if (postCreationDate > lastVisitDate) {
                  data.data[i].notification = true;
                } else {
                  data.data[i].notification = false;
                }
              } else {
                data.data[i].notification = false;
              }

              data.data[i].createdAt = new Date(data.data[i].createdAt).toLocaleString('en-GB', { timeZone: 'Europe/Paris' });

              setPosts(posts => [...posts, data.data[i]]);
            }

          } else {
            alert(`${data.message}`);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    if (token !== null) {
      updateUserLastVisitDate();
      getUserData();
      getAllPostsData();
    }
  }, [render, token, userId]);

  if (token === null) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div id="FeedContainer">

        <Helmet>
          <meta charSet="utf-8" />
          <title>Publications</title>
          <link rel="canonical" href={window.location.href} />
          <meta
            name="description"
            content="This is the feed page of Groupomania, here the user can share to other coworkers about anything and everything he wants!"
          />
          <meta name="robots" content="index, follow" />
        </Helmet>

        <AddPost
          renderOnQuery={setRender}
        />

        {posts.map(post => {
          const postID = post.post_id;

          return (
            <Posts
              key={postID}
              props_isAdmin={isAdmin}
              props_post_id={postID}
              props_post_content={post.post_content}
              props_post_pictureURL={post.post_pictureURL}
              props_post_createdAt={post.createdAt}
              props_post_user_id={post.user.user_id}
              props_post_user_firstName={post.user.firstName}
              props_post_user_lastName={post.user.lastName}
              props_post_user_pictureURL={post.user.user_pictureURL}
              props_post_comments={post.comments}
              props_post_voted={checkIfUserLiked(post.votes)}
              props_post_numberOfVotes={post.votes.length}
              props_posts_icons={post.icons}
              props_posts_notification={post.notification}
              renderOnQuery={setRender}
            />);
        })}

      </div>
    );
  }
}

export default Feed;
