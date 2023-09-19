import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function Settings() {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [password, setPassword] = useState("");
  const [userPictureURL, setUserPictureURL] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [pictureFile, setPictureFile] = useState(false);
  const [render, setRender] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [myModals, setMyModals] = useState({
    deleteAccountModal: false,
    updateDescriptionModal: false,
    uploadFileModal: false,
  });

  const getModalHandler = (modalName) => {
    return {
      isOpen: myModals[modalName],
      open: () => setMyModals((state) => ({ ...state, [modalName]: true })),
      close: () => setMyModals((state) => ({ ...state, [modalName]: false })),
    };
  };

  const deleteAccountModal = getModalHandler("deleteAccountModal");
  const updateDescriptionModal = getModalHandler("updateDescriptionModal");
  const uploadFileModal = getModalHandler("uploadFileModal");

  const updateAvatar = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setPictureFile(event.target.files[0]);
    }
  };

  const handleUserDeletion = (event) => {
    event.preventDefault();
    deleteUser(password);
  };

  const handleUserUpdate = (event) => {
    event.preventDefault();
    const newUserData = new FormData();
    newUserData.append("user_description", userDescription);
    if (pictureFile) {
      newUserData.append("image", pictureFile)
    }
    updateUser(newUserData);
  };

  const updateUser = async (body) => {
    await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      body: body,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRender(Math.random());
          uploadFileModal.close();
          updateDescriptionModal.close();
        } else {
          alert(`${data.message}`);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const deleteUser = async (bodyPassword) => {
    await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({
        password: bodyPassword,
      }),
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.clear();
          setTimeout(() => navigate("/login", { replace: true }), 500);
        } else {
          alert(`${data.message}`);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
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
            sessionStorage.setItem("lastName", data.data.lastName);
            sessionStorage.setItem("firstName", data.data.firstName);
            sessionStorage.setItem("lastVisit", new Date(data.data.lastVisitDate).valueOf());
            setUserDescription(data.data.user_description);
            setIsAdmin(data.data.isAdmin);
            let picture = data.data.user_pictureURL;

            if (picture === "BasicFrontEndAvatar") {
              sessionStorage.setItem("userPictureURL", require("../assets/images/avatar.png"));
            } else {
              sessionStorage.setItem("userPictureURL", picture);
            }

            setUserPictureURL(sessionStorage.getItem("userPictureURL"));
          } else {
            alert(`${data.message}`);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    if (token !== null) {
      getUserData();
    }
  }, [render, token, userId]);


  if (token === null) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div id="settingsContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Settings</title>
          <link rel="canonical" href={window.location.href} />
          <meta name="description" content="This is the settings page where the user can change his profile picture, email and personal description." />
          <meta name="robots" content="index, follow" />
        </Helmet>

        <div className="profile">
          <h1 className="profile__names">
            {sessionStorage.getItem("firstName")}{" "}
            {sessionStorage.getItem("lastName")}
          </h1>
          <div className="profile__content">
            <img className="profile__content-picture" src={userPictureURL} alt="Avatar of the user" />
            <svg className="profile__content-plusIcon" alt="A plus icon that you can click on to open a modal, which allows you to upload a new avatar!" onClick={uploadFileModal.open} viewBox="0 0 24 24">
              <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
            </svg>
          </div>
        </div>

        <div className="description">
          <h2 className="description__title">
            Current description{" "}
            <svg className="description__title-penIcon" alt="A pen icon that you can click on to open a modal, which allows you to modify your description!" aria-label="Open" onClick={updateDescriptionModal.open} viewBox="0 0 24 24">
              <path d="M12.014 6.54s2.147-3.969 3.475-6.54l8.511 8.511c-2.583 1.321-6.556 3.459-6.556 3.459l-5.43-5.43zm-8.517 6.423s-1.339 5.254-3.497 8.604l.827.826 3.967-3.967c.348-.348.569-.801.629-1.288.034-.27.153-.532.361-.74.498-.498 1.306-.498 1.803 0 .498.499.498 1.305 0 1.803-.208.209-.469.328-.74.361-.488.061-.94.281-1.288.63l-3.967 3.968.826.84c3.314-2.133 8.604-3.511 8.604-3.511l4.262-7.837-3.951-3.951-7.836 4.262z" />
            </svg>
          </h2>
          <p className="description__content">{userDescription}</p>
        </div>

        {isAdmin ? (
          <span></span>
        ) : (
          <button className="btn btn--blue btn--big" aria-label="Open" onClick={deleteAccountModal.open}>Delete account</button>
        )}



        <Dialog open={myModals.uploadFileModal}>
          <DialogContent>
            <DialogContentText className="modal__text">
              Upload your <b>new avatar picture</b> here and click on <b>confirm</b>!
            </DialogContentText>
            <input
              id="fileUpload"
              name="user_pictureURL"
              aria-labelledby="user_pictureURL"
              aria-describedby="Please add your new user picture in this field."
              type="file"
              accept=".png, .jpeg, .jpg, .gif"
              onChange={updateAvatar}
              onClick={event => event.target.value = null}
            />
          </DialogContent>
          <DialogActions>
            <button className="btn btn--blue btn--big" aria-label="Close" onClick={uploadFileModal.close}>Cancel</button>
            <button className="btn btn--blue btn--big" aria-label="Confirm" onClick={handleUserUpdate}>Confirm</button>
          </DialogActions>
        </Dialog>

        <Dialog open={myModals.updateDescriptionModal}>
          <DialogContent>
            <DialogContentText className="modal__text">
              Write your <b>new description</b> here and click on <b>confirm</b>!
            </DialogContentText>
            <TextField
              id="updateUserDescription"
              className="modal__textField"
              type="text"
              name="userDescription"
              placeholder="Your user description must be 2-199 characters long!"
              aria-labelledby="updateUserDescription"
              aria-describedby="Please enter your description in this field."
              fullWidth
              multiline
              maxRows={6}
              inputProps={{
                maxLength: 199,
                minLength: 2
              }}
              value={userDescription}
              onChange={(event) => setUserDescription(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <button className="btn btn--blue btn--big" aria-label="Close" onClick={updateDescriptionModal.close}>Cancel</button>
            <button className="btn btn--blue btn--big" aria-label="Confirm" onClick={handleUserUpdate}>Confirm</button>
          </DialogActions>
        </Dialog>

        <Dialog open={myModals.deleteAccountModal}>
          <DialogContent>
            <DialogContentText>
              Enter your <b>password</b> and click on <b>confirm</b>!
            </DialogContentText>
            <input
              id="deleteAccountPassword"
              className="connectionForm__ipt"
              name="password"
              type="password"
              placeholder="Password"
              aria-labelledby="deleteAccountPassword"
              aria-describedby="Please enter your password in this field."
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength="12"
              required
            />
          </DialogContent>
          <DialogActions>
            <button className="btn btn--blue btn--big" aria-label="Close" onClick={deleteAccountModal.close}>Cancel</button>
            <button className="btn btn--blue btn--big" aria-label="Confirm" onClick={handleUserDeletion}>Confirm</button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

export default Settings;