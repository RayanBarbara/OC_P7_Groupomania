import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import { handleErrorMessage } from "../App";

function SignUp() {
  const navigate = useNavigate();

  const [signUpFormData, setSignUpFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignUpFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signUp(signUpFormData);
  };

  const signUp = async (body) => {
    await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => navigate("/login", { replace: true }), 500);
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
        const namesRegEx = new RegExp(/^[A-Z][a-z]{1,99}$/g);
        const emailRegEx = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        const passwordRegEx = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/);

        if (namesRegEx.test(inputs.value) === false && (inputs.id === "firstName" || inputs.id === "lastName")) {
          handleErrorMessage(true, inputs.id, "Only letters are allowed for the name! And the first one must be an upper case!");
        } else if (namesRegEx.test(inputs.value) === true && (inputs.id === "firstName" || inputs.id === "lastName")) {
          handleErrorMessage(false, inputs.id, "");
        }

        if (emailRegEx.test(inputs.value) === false && inputs.id === "email") {
          handleErrorMessage(true, inputs.id, "The email format is invalid!");
        } else if (emailRegEx.test(inputs.value) === true && inputs.id === "email") {
          handleErrorMessage(false, inputs.id, "");
        }

        if (passwordRegEx.test(inputs.value) === false && inputs.id === "password") {
          handleErrorMessage(true, inputs.id, "The password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long!");
        } else if (emailRegEx.test(inputs.value) === true && inputs.id === "password"
        ) {
          handleErrorMessage(false, inputs.id, "");
        }
      }
    });
  });

  return (
    <div id="signupContainer">

      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign up</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="This is the page where the user can sign up for an account in Groupomania." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <form className="connectionForm" aria-label="Create an account" onSubmit={handleSubmit}>
        <input
          id="firstName"
          className="connectionForm__ipt"
          name="firstName"
          type="text"
          placeholder="First Name"
          aria-labelledby="firstName"
          aria-describedby="Please enter your first name in this field."
          autoComplete="given-name"
          value={signUpFormData.firstName}
          onChange={handleChange}
          minLength="2"
          required
        />
        <p id="firstNameErrorMsg" aria-labelledby="firstNameErrorMsg"></p>

        <input
          id="lastName"
          className="connectionForm__ipt"
          name="lastName"
          type="text"
          placeholder="Last Name"
          aria-labelledby="lastName"
          aria-describedby="Please enter your last name in this field."
          autoComplete="family-name"
          value={signUpFormData.lastName}
          onChange={handleChange}
          minLength="2"
          required
        />
        <p id="lastNameErrorMsg" aria-labelledby="lastNameErrorMsg"></p>

        <input
          id="email"
          className="connectionForm__ipt"
          name="email"
          type="email"
          placeholder="Email"
          aria-labelledby="email"
          aria-describedby="Please enter your email in this field."
          autoComplete="email"
          value={signUpFormData.email}
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
          autoComplete="new-password"
          value={signUpFormData.password}
          onChange={handleChange}
          minLength="8"
          required
        />
        <p id="passwordErrorMsg" aria-labelledby="passwordErrorMsg"></p>

        <div className="centerButton centerButton--hzl">
          <button className="btn btn--blue btn--big" aria-label="Sign-up" type="submit">Sign Up</button>
        </div>

        <p className="connectionForm__txt">
          You have an account? Click{" "} <Link className="links" rel="follow" aria-current="page" to="/login">here</Link> !
        </p>
      </form>

    </div>
  );
}

export default SignUp;
