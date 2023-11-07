import React, { useState, useContext } from 'react';
import { DataContext } from '../DataContext';
import './Sign.css';
import Svgs from '../Assets/icons/Svgs';
import captchaImage from '../Assets/images/captcha.jpg';
import MobileHeader from '../components/MobileHeader/MobileHeader';
import { register, Login, oauth, getUserInfo } from '../logic/api';
import { isValidUsername, isValidEmail, isValidPassword, checkPasswordStrength } from '../logic/helperMethods';
import { Link, useNavigate } from 'react-router-dom';

const Sign = ({ isMobile }) => {

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const { setUserID, setUserUsername, setProfileImageName } = useContext(DataContext);

  const handleSubmitRegister = async(e) => {
        
      e.preventDefault();
      
      if(username.length < 1){
        setUsernameError("username can't be empty");
        return;
      }

      if(!isValidUsername(username)){
        setUsernameError("length of username must be 2 - 25 words, use only letters, numbers or both")
      }

      if(!isValidEmail(email)){
        setEmailError("not valid email");
        return;
      }

      if(!isValidPassword(password, confirmPassword)){
        setPasswordError("not valid password");
        return;
      }

      try{

        const res = await register(username, email, password);

        console.log(res);

        if(!res?.ok || res.ok === false){
          setError(res?.dt?.message ? res.dt.message : "Error creating account please try again");
          return;
        } 
        
        if(res.ok === true){
          setError(null);
          setLoginEmail(email);
          setLoginPassword(password);
          setUsername(null);
          setEmail(null);
          setPassword(null);
          setConfirmPassword(null);
          setUsernameError(null);
          setEmailError(null);
          setPasswordError(null);
          setPasswordConfirmError(null);
          setIsSignUp(false);
          return;
        }

      } catch(err){
        setError(err.message)
      }
  };

  const handleSubmitLogin = async(e) => {
        
      e.preventDefault();

      if(!isValidEmail(loginEmail)){
        setError("not valid email");
        return;
      }

      try{

        const res = await Login(loginEmail, loginPassword);

        console.log(res);

        if(!res?.ok || res.ok === false){
          setError(res?.dt?.message ? res.dt.message : "please type valid email");
          return;
        } 
        
        if(res.ok === true){
          setLoginEmail(null);
          setLoginPassword(null);
          setError(null);

          const userInfoRes = await getUserInfo();

          if(!userInfoRes || !userInfoRes.ok || userInfoRes.ok === false || !userInfoRes?.dt) return;

          console.log("userInfo: ", userInfoRes);

          setUserID(userInfoRes.dt.user_id ? userInfoRes.dt.user_id : "");
          setUserUsername(userInfoRes.dt.user_username ? userInfoRes.dt.user_username : "");
          setProfileImageName(userInfoRes.dt.profile_image ? userInfoRes.dt.profile_image : "");

          return;
        }

      } catch(err){
        setError(err.message)
      }
  };

  const handleOAuth = async(method) => {

  };

  const handleValidation = (e, field) => {

    switch(field){

      case "username":
        setUsername(e.target.value);
        if(!isValidUsername(e.target.value)){
          if(e.target.value.length > 2){
            setUsernameError("length of username must be 2 - 25 words, use only letters, numbers or both");
          } else {
            setUsernameError(null);
          }
          return;
        } else {
          setUsernameError(null);
          return
        }

      case "email":
        setEmail(e.target.value);
        setEmailError(null);
        return;

      case "password":
        setPassword(e.target.value);
        setPasswordError(null);
        return;

      case "confirm":
        setConfirmPassword(e.target.value);
        if(!isValidPassword(password, e.target.value)){
          setPasswordConfirmError("please type the same password");
          return;
        } else {
          setPasswordConfirmError(null);
          return
        }

    }
  };


  return (
    <div className='Sign'>

      <MobileHeader isMobile={isMobile} />

      {isSignUp === true ? (<div className='SignUp'>

        <h2>Sign Up</h2>
        <label>{error}</label>

        <form onSubmit={(e) => handleSubmitRegister(e)}>

          <label>Username <span style={{fontSize: "0.65rem", color: "red"}}>{usernameError}</span></label>
          <input type='text' placeholder='username' required onChange={(e) => handleValidation(e, "username")} ></input>

          <label>Email <span style={{fontSize: "0.65rem", color: "red"}}>{emailError}</span></label>
          <input type='email' placeholder='email' required onChange={(e) => handleValidation(e, "email")}></input>

          <label>Password <span style={{fontSize: "0.65rem", color: "red"}}>{passwordError}</span></label>
          <input type='password' placeholder='password' required onChange={(e) => handleValidation(e, "password")}></input>

          <label>Confirm Password <span style={{fontSize: "0.65rem", color: "red"}}>{passwordConfirmError}</span></label>
          <input type='password' placeholder='confirm password' required onChange={(e) => handleValidation(e, "confirm")}></input>

          <div className='captcha'>
            <div>
              <label>Enter what you see</label>
              <input type='text'></input>
            </div>
            <img src={captchaImage} alt=''/>
          </div>

          <div className='checkbox_terms'>
            <input type='checkbox'></input>
            <label>I agree to MoSocial <span>Terms of service</span> & <span>privacy policy</span></label>
          </div>

          <button onClick={(e) => handleSubmitRegister(e)} type='submit'>Create Account</button>

        </form>

        <div className='toggleButtonDiv'>
          <p onClick={() => setIsSignUp(false)}>Login</p>
        </div>

      </div>) 
      : (
      <div className='SignIn'>

        <h2>Login</h2>

        <label>{error}</label>

        <form onSubmit={(e) => handleSubmitLogin(e)}>

          <label>Email</label>
          <input type='text' placeholder='Enter your email' value={loginEmail ? loginEmail : ''} required onChange={(e) => setLoginEmail(e.target.value)}></input>

          <label>Password</label>
          <input type='password' placeholder='password' required value={loginPassword ? loginPassword : ''} onChange={(e) => setLoginPassword(e.target.value)}></input>

          <div className='checkbox_terms'>
            <input type='checkbox'></input>
            <label>Remember me</label>
          </div>

          <button type='submit' onSubmit={(e) => handleSubmitLogin(e)}>Login</button>

        </form>

        <div className='toggleButtonDiv'>
          <p onClick={() => setIsSignUp(true)}>Sign Up</p>
        </div>

      </div>)}

      
      <div className='signPageLander'>
        <div className='SignWith'>
          <Svgs type={"Facebook"} />
          <label>Sign with Facebook</label>
        </div>
        <div className='SignWith' onClick={() => handleOAuth("google")}>
          <Svgs type={"Google"} />
          <Link style={{color: 'inherit'}} to="http://localhost:3500/user/oauth/google"><label>Sign with Google</label></Link>
        </div>
        <div className='SignWith changeSVGcolor'>
          <Svgs type={"X"} />
          <label>Sign with Twitter</label>
        </div>
      </div>
      
    </div>
  )
};

export default Sign;
