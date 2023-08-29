import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import { handleErrorMessage } from "../App";

function Login() {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(loginFormData);
  };

  const login = async (body) => {
    await fetch("http://localhost:8080/api/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => navigate("/settings", { replace: true }), 500);
          sessionStorage.setItem("userId", data.userId);
          sessionStorage.setItem("token", data.token);
        } else {
          alert(`${data.message}`);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // Check if inputted data respect the given format
  document.querySelectorAll("input").forEach((inputs) => {
    inputs.addEventListener("input", () => {
      if (inputs.value.trim().length === 0) {
        handleErrorMessage(true, inputs.id, "Please fill the field!");
      } else {
        handleErrorMessage(false, inputs.id, "");
        const emailRegEx = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        const passwordRegEx = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/);

        if (emailRegEx.test(inputs.value) === false && inputs.id === "email") {
          handleErrorMessage(true, inputs.id, "The email format is invalid!");
        } else if (emailRegEx.test(inputs.value) === true && inputs.id === "email") {
          handleErrorMessage(false, inputs.id, "");
        }

        if (passwordRegEx.test(inputs.value) === false && inputs.id === "password") {
          handleErrorMessage(true, inputs.id, "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long!");
        } else if (passwordRegEx.test(inputs.value) === true && inputs.id === "password") {
          handleErrorMessage(false, inputs.id, "");
        }
      }
    });
  });

  return (
    <div id="loginContainer">

      <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="This is the page where the user can login to his Groupomania account." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <form className="connectionForm" aria-label="Login to an existing account" onSubmit={handleSubmit}>
        <input
          id="email"
          className="connectionForm__ipt"
          name="email"
          type="email"
          placeholder="Email"
          aria-labelledby="email"
          aria-describedby="Please enter your email in this field."
          autoComplete="email"
          value={loginFormData.email}
          onChange={handleChange}
          required
        />
        <p id="emailErrorMsg" aria-labelledby="emailErrorMsg"></p>

        <input
          id="password"
          className="connectionForm__ipt"
          name="password"
          type="password"
          placeholder="Password"
          aria-labelledby="password"
          aria-describedby="Please enter your password in this field."
          autoComplete="current-password"
          value={loginFormData.password}
          onChange={handleChange}
          minLength="8"
          required
        />
        <p id="passwordErrorMsg" aria-labelledby="passwordErrorMsg"></p>

        <div className="centerButton centerButton--hzl">
          <button className="btn btn--blue btn--big" aria-label="Login" type="submit">Login</button>
        </div>

        <p className="connectionForm__txt">
          You don't have an account? Click{" "} <Link className="links" rel="follow" aria-current="page" to="/signup">here</Link> !
        </p>
      </form>

    </div>
  );
}

export default Login;
