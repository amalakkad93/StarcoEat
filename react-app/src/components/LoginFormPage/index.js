import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { login } from "../../store/session";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Navigate, useNavigate, NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
import FormContainer from "../CustomTags/FormContainer";

import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ulRef = useRef();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user, shallowEqual);

  const backendBaseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://gotham-eat.onrender.com";

  const oauthLoginUrl = `${backendBaseUrl}/api/auth/oauth_login`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) {
    navigate("/");
    return null;
  }

  const isLoginDisabled =
    !email.trim() || !password.trim() || password.length < 6;

  const loginFields = [
    {
      type: "text",
      name: "email",
      // label: "Email",
      placeholder: "Email",
      setter: setEmail,
      value: email,
      required: true,
      className: "",
      inputClassName: "login-signup-form-input",
    },
    {
      type: "text",
      name: "password",
      // label: "Password",
      placeholder: "Password",
      setter: setPassword,
      value: password,
      required: true,
      className: "",
      inputClassName: "login-signup-form-input",
    },
  ];

  const loginValidations = [
    {
      fieldName: "email",
      rule: (value) => {
        if (!value) return "Email is required";
        if (!value.includes("@") || !value.includes("."))
          return "Invalid email format";
        return null;
      },
    },
    {
      fieldName: "password",
      rule: (value) => {
        if (!value) return "Password is required";
        if (value.length < 6)
          return "Password should be at least 6 characters long";
        return null;
      },
    },
  ];
  const validateCommonFields = (fields, validations) => {
    let errors = {};

    validations.forEach((validation) => {
      const field = fields.find((f) => f.name === validation.fieldName);
      const value = field ? field.value : null;

      if (value && validation.rule(value)) {
        errors[validation.fieldName] = validation.message;
      }
    });

    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCommonFields(
      loginFields,
      loginValidations
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(Object.values(validationErrors));
      return;
    }

    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <div className="login-signup-form-pages-top-banner">
        <NavLink exact to="/" className="navbar-logo">
          <div className="logo-container">
            <h1 className="login-signup-logo-h1-first">Starco</h1>
            <h1 className="login-signup-logo-h1-second">Eats</h1>
          </div>
        </NavLink>
      </div>
      <div className="form-login">
        {/* {errors.map((error, idx) => <div key={idx} className="error">{error}</div>)} */}
        <FormContainer
          fields={loginFields}
          onSubmit={handleSubmit}
          isSubmitDisabled={isLoginDisabled}
          errors={errors}
          validations={loginValidations}
          className="login-signup-form"
          inputClassName="login-signup-form-input"
          submitLabel="Log In"
          submitButtonClass="login-signup-form-btn"
          formTitle="Log In"
          extraElements={
            <>
              <button
                className="demo-user-btn"
                type="button"
                onClick={(e) => {
                  setEmail("demo@io.com");
                  setPassword("password");
                }}
              >
                Demo User
              </button>

              <button onClick={() =>  window.location.href = oauthLoginUrl}>
                <img
                  className="google-login-icon"
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                  alt="Google logo"
                />
                <span className="google-login-text">Login with Google</span>
              </button>
            </>
          }
        />

        {/* <a
          href={`https://gotham-eat.onrender.com/api/auth/oauth_login`}
          className="submit-login-google"
        >
          <button >
           <img
              className="google-login-icon"
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google logo"
            />
            <span className="google-login-text">Login with Google</span>
          </button>
        </a> */}

        {/* Google Auth */}
        {/* <a href={"/api/auth/oauth_login"} className="submit-google">
          <button className="submit-login-google">
            <GoogleLogin className="google-icon" />
          </button>

        </a> */}
        {/* <a href={`https://gotham-eat.onrender.com/api/auth/oauth_login`}><button>OAUTH</button></a> */}
      </div>
    </>
  );
}

export default LoginFormPage;

// import React, { useState } from "react";
// import { login } from "../../store/session";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useNavigate, NavLink } from 'react-router-dom';

// import FormContainer, {validateCommonFields} from '../CustomTags/FormContainer';

// import './LoginForm.css';

// function LoginFormPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sessionUser = useSelector((state) => state.session.user);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState([]);

//   if (sessionUser) {
//     navigate('/');
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = await dispatch(login(email, password));
//     if (data) {
//       setErrors(data);
//     }
//   };

//   const loginFields = [
//     {
//       type: 'text',
//       name: 'email',
//       label: 'Email',
//       setter: setEmail,
//       value: email,
//       required: true,
//       className: '',
//       inputClassName: 'login-signup-form-input'
//     },
//     {
//       type: 'text',
//       name: 'password',
//       label: 'Password',
//       setter: setPassword,
//       value: password,
//       required: true,
//       className: '',
//       inputClassName: 'login-signup-form-input'
//     }
//   ];

//   // When using the FormContainer:
//   <FormContainer fields={loginFields} className="login-signup-form" />

//   return (
//     <>
//       <div className="login-signup-form-pages-top-banner">
//         <NavLink exact to="/" className="navbar-logo">
//           <div className="logo-container">
//             <h1 className="login-signup-logo-h1-first">Starco</h1>
//             <h1 className="login-signup-logo-h1-second">Eats</h1>
//           </div>
//         </NavLink>
//       </div>
//       <h1>Log In</h1>
//       <form className="login-signup-form" onSubmit={handleSubmit}>
//         <ul>
//           {errors.map((error, idx) => (
//             <li key={idx}>{error}</li>
//           ))}
//         </ul>
//         <FormContainer fields={loginFields} className="login-signup-form" />
//         <button className="login-signup-form-btn" type="submit">Log In</button>
//       </form>
//     </>
//   );
// }

// export default LoginFormPage;

// import React, { useState } from "react";
// import { login } from "../../store/session";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useNavigate, NavLink } from 'react-router-dom';

// import './LoginForm.css';

// function LoginFormPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sessionUser = useSelector((state) => state.session.user);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState([]);

//   if (sessionUser) {
//     navigate('/');
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = await dispatch(login(email, password));
//     if (data) {
//       setErrors(data);
//     }
//   };

//   return (
//     <>
//     <div className="login-signup-form-pages-top-banner">
//       <NavLink exact to="/" className="navbar-logo">
//         <div className="logo-container">
//           <h1 className="login-signup-logo-h1-first">Starco</h1>
//           <h1 className="login-signup-logo-h1-second">Eats</h1>
// 				</div>
//       </NavLink>
//     </div>
//       <h1>Log In</h1>
//       <form className="login-signup-form" onSubmit={handleSubmit}>
//         <ul>
//           {errors.map((error, idx) => (
//             <li key={idx}>{error}</li>
//           ))}
//         </ul>
//         <label className="login-signup-form-label">
//           Email
//           <input
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>
//         <label className="login-signup-form-label">
//           Password
//           <input
//             className="login-signup-form-input"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         <button className="login-signup-form-btn" type="submit">Log In</button>
//       </form>
//     </>
//   );
// }

// export default LoginFormPage;
