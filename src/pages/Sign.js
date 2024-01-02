import React, { useState, useContext, useRef } from 'react';
import { DataContext } from '../DataContext';
import './Sign.css';
import Svgs from '../Assets/icons/Svgs';
import { register, Login, getUserInfo, sendCodeToEmail, verifyEmail, changePassword, changePasswordSendCode } from '../logic/api';
import { isValidUsername, isValidEmail, isValidPassword, checkPasswordStrength } from '../logic/helperMethods';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Sign = () => {

  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(73);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [verifyEmailError, setVerifyEmailError] = useState("");
  const [verifyEmailSuccess, setVerifyEmailSuccess] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [verCode, setVerCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { 
    setUserID, setUserUsername, setProfileImageName, 
    setIsMyProfile, setIsTestAccount } = useContext(DataContext);
  const reCaptchaRef = useRef(null);
  const reCaptchaRefLogin = useRef(null);
  const navigate = useNavigate();

  const testAccountEmail = "test@gmail.com";
  const testAccountPassword = "test1234";

  const handleSubmitRegister = async(e) => {
        
      e.preventDefault();

      const reCaptchaToken = reCaptchaRef?.current?.getValue() ? reCaptchaRef.current.getValue() : null;
      console.log("Captcha token: ", reCaptchaToken);
      reCaptchaRef.current.reset();

      if(!reCaptchaToken) return setError("Please check the reCACPTCHA");
      
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

      if(!isVerified) return setVerifyEmailError("Please confirm your email");

      try{

        const res = await register(username, email, password, reCaptchaToken);

        if(!res?.ok || res.ok === false){
          setError(res?.dt ? res.dt : "Error creating account please try again");
          return;
        } 

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
        setIsMyProfile(true);
        setIsTestAccount(false);
        navigate('/sign');

      } catch(err){
        setError(err.message)
      }
  };

  const handleSubmitLogin = async() => {

      const reCaptchaToken = reCaptchaRefLogin?.current?.getValue() ? reCaptchaRefLogin.current.getValue() : null;
      console.log("Captcha token: ", reCaptchaToken);
      reCaptchaRefLogin.current.reset();

      if(!reCaptchaToken) return setError("Please check the reCACPTCHA");

      if(!isValidEmail(loginEmail)){
        setError("not valid email");
        return;
      }

      try{

        const res = await Login(loginEmail, loginPassword, reCaptchaToken);

        console.log(res);

        if(!res?.ok || res.ok !== true){
          setError(res?.dt ? res.dt : "please type valid email");

          if(res.isBlocked){
            setIsBlocked(true);
            setBlockTime(Math.round(res.dt/1000/60/60));
            setError("You are blocked");
          }

          return;
        } 

        setLoginEmail("");
        setLoginPassword("");
        setError("");

        const userInfoRes = await getUserInfo();

        if(!userInfoRes || !userInfoRes.ok || userInfoRes.ok !== true || !userInfoRes?.dt) return;

        console.log("userInfo: ", userInfoRes);

        setUserID(userInfoRes.dt.user_id ? userInfoRes.dt.user_id : "");
        setUserUsername(userInfoRes.dt.user_username ? userInfoRes.dt.user_username : "");
        setProfileImageName(userInfoRes.dt.profile_image ? userInfoRes.dt.profile_image : "");

        setIsMyProfile(true);

        if(loginEmail === testAccountEmail) {
          setIsTestAccount(true);
        } else {
          setIsTestAccount(false);
        }

        navigate(`/profile/${userInfoRes.dt.user_id ? userInfoRes.dt.user_id : ""}`);

        return;

      } catch(err){
        setError(err.message)
      }
  };

  const sendEmailVerificationCode = async(e) => {
    
    try{

      e.preventDefault();
        
      if(!isValidEmail(email)){
        setEmailError("not valid email");
        return;
      };

      const res = await sendCodeToEmail(email);

      if(!res?.ok || res.ok === false) {
        setVerifyEmailError(res.dt ? res.dt : "The code wasn't sent :(");
        setRequestingCode(false);
        console.log("Error sending the code");
        return;
      }

      setVerifyEmailSuccess("The code was sent, check your email :)");

      setVerifyEmailError("");

      console.log("Code sent to ", email);

      setRequestingCode(false);

    } catch(err){
      console.log(err.message);
      setVerifyEmailError(err.message);
      setVerifyEmailSuccess("");
      setRequestingCode(false);
    }

    if(verifyEmailError?.length > 0){
      setTimeout(() => {
        setVerifyEmailError("");
      }, 60 * 1000)
    }

  };

  const verifyMyEmail = async(e) => {

    try{

      e.preventDefault();

      console.log("Verifing");

      if(!verCode || verCode.length !== 6) return setVerifyEmailError("please Check your email for the verification code");

      const res = await verifyEmail(email, verCode);

      console.log(res.dt);

      if(!res || res.ok === false) return setVerifyEmailError(res.dt);

      setVerifyEmailSuccess(res.dt);

      setVerifyEmailError("");

      setIsVerified(true);

      console.log("Verify completed :)");

    } catch(err){
      setVerifyEmailError(err.message);
      setVerifyEmailSuccess("");
    }

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

  const getRemainingBlockTime = () => {

    if(blockTime > 0 && blockTime < 24) return `${Math.round(blockTime)} hours`;

    if(blockTime > 24 && blockTime < 730) return `${Math.round(blockTime / 24)} days`;

    if(blockTime > 730 && blockTime < 365) return `${Math.round(blockTime / 24 / 30)} months`;

    return `${blockTime} years`;

  };

  const newPasswordCodeRequest = async(e) => {

    try {

      e.preventDefault();

      console.log("email: ", loginEmail);

      if(!isValidEmail(loginEmail)){
        setError("not valid email");
        return;
      }

      setRequestingCode(true);

      const res = await changePasswordSendCode(loginEmail);

      if(!res || res.ok !== true){
        setRequestingCode(false);
        setError(res.dt);
        return;
      };

      setRequestingCode(false);

    } catch(err) {
      setError(err.message);
      setRequestingCode(false);
    }

  };

  const changeMyPassword = async() => {

    try {

      console.log("email: ", loginEmail, " password: ", loginPassword, " verCode: ", verCode);

      if(!isValidEmail(loginEmail)){
        setError("not valid email");
        return;
      }

      if(!verCode || verCode.length !== 6) return setError("Enter the code sent to your email, if it didn't reach your inbox re-send it.");

      const checkPass = checkPasswordStrength(loginPassword);

      if(checkPass.ok !== true){
        setError(checkPass.message);
        return;
      }

      const res = await changePassword(loginEmail, loginPassword, verCode);

      if(!res || res.ok !== true){
        setError(res.dt);
        return;
      }
      
      setIsForgotPassword(false);

    } catch(err) {
      setError(err.message);
    }

  };

  return (
    <div className='Sign'>

      {isSignUp === true ? (<div className='SignUp'>

        <h2 style={{
          display: isForgotPassword ? null : "flex",
          justifyContent: "space-between",
          alignItems: "center"}}>Sign Up<span style={{
          fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", color: "grey"
          }} onClick={() => {
            setIsSignUp(false);
            setLoginEmail(testAccountEmail);
            setLoginPassword(testAccountPassword);
        }}>Test Account</span></h2>
        <label>{error}</label>

        <form onSubmit={(e) => handleSubmitRegister(e)}>

          <label>Username <span style={{fontSize: "0.65rem", color: "red"}}>{usernameError}</span></label>
          <input type='text' placeholder='username' required onChange={(e) => handleValidation(e, "username")} ></input>

          <label>Email <span style={{fontSize: "0.65rem", color: "red"}}>{emailError}</span></label>
          <input type='email' placeholder='email' required onChange={(e) => handleValidation(e, "email")}></input>

          <label>Confirm your email <span style={{fontSize: "0.65rem", color: verifyEmailError?.length > 0 ? "red" : "green"}}>{
            verifyEmailError?.length > 0 ? verifyEmailError : verifyEmailSuccess
          }</span></label>
          <div className='verifyEmailDiv'>
            <div>
              <button onClick={(e) =>{setRequestingCode(true); sendEmailVerificationCode(e)}}>{requestingCode === false ? "Send Code" : "Sending..."}</button>
              <button onClick={(e) => {if(verCode?.length === 6) verifyMyEmail(e);}} style={{background: verCode?.length === 6 ? null : "#efefef"}}>Verify</button>
            </div>
            <input type='text' placeholder='Enter Verification Code' value={verCode?.length > 0 ? verCode : null} onChange={(e) => setVerCode(e.target.value)}></input>
          </div>

          <label>Password <span style={{fontSize: "0.65rem", color: "red"}}>{passwordError}</span></label>
          <input type='password' placeholder='password' required onChange={(e) => handleValidation(e, "password")}></input>

          <label>Confirm Password <span style={{fontSize: "0.65rem", color: "red"}}>{passwordConfirmError}</span></label>
          <input type='password' placeholder='confirm password' required onChange={(e) => handleValidation(e, "confirm")}></input>

          <ReCAPTCHA 
            sitekey={process.env.REACT_APP_SITE_KEY}
            ref={reCaptchaRef}
          />

          <div className='checkbox_terms'>
            <input type='checkbox'></input>
            <label>I agree to MoSocial <span>Terms of service</span> & <span>privacy policy</span></label>
          </div>

          <button onClick={(e) => handleSubmitRegister(e)} type='submit'>Create Account</button>

        </form>

        <div className='toggleButtonDiv'>
          <p onClick={() => setIsSignUp(false)}>Login</p>
        </div>

        <div className='signPageLanderInsider'>
          <div className='SignWithinside'>
            <Svgs type={"Google"} />
            <Link style={{color: 'inherit'}} to={`${process.env.REACT_APP_REGISTER_URL}/user/oauth/google`}><label>Sign with Google</label></Link>
          </div>
        </div>

      </div>) 
      : (
      <div className='SignIn'>

        {!isBlocked ? <><h2 style={{
          fontSize: isForgotPassword ? "1.2rem" : null,
          fontWeight: isForgotPassword ? "500" : null,
          width: isForgotPassword ? null : "100%",
          display: isForgotPassword ? null : "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }} onClick={() => {if(isForgotPassword) setIsForgotPassword(false)}}>
          {isForgotPassword ? "Return to Login" 
          : (<>Login<span style={{
          fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", color: "grey"
          }} onClick={() => {
          if(loginEmail.length <= 0 || loginPassword.length <= 0) {
            setLoginEmail(testAccountEmail);
            setLoginPassword(testAccountPassword);
          } else {
            setLoginEmail("");
            setLoginPassword("");
          }
        }}>Test Account</span></>)}</h2>

        <label>{error}</label>

        <form onSubmit={(e) => {if(!isForgotPassword) handleSubmitLogin(e)}}>

          <label>Email</label>
          <input type='text' placeholder='Enter your email' value={loginEmail ? loginEmail : ''} required onChange={(e) => setLoginEmail(e.target.value)}></input>

          {!isForgotPassword && <><label style={{
            width: "100%", display: "flex"
          }}>Password<span style={{
            marginLeft: "auto", color: "#fa7a7a7", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500"
          }} onClick={() => setIsForgotPassword(true)}>Forgot Password ?</span></label>
          <input type='password' placeholder='password' required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}></input>

          <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} ref={reCaptchaRefLogin} /></>}

          {isForgotPassword && <>

            <label>Enter new password</label>
            <input placeholder='New Password' onChange={(e) => {setLoginPassword(e.target.value)}}/>

            <label>Enter The Code sent to your Email</label>

            <div className='forgotPassword' style={{ maxWidth: "100%" }}>
              <input placeholder='Enter Code' 
              onChange={(e) => setVerCode(e.target.value)}
              style={{margin: 0}}/>
              <button type='button' style={{
                marginTop: 0, borderRadius: 6, padding: 12, whiteSpace: "nowrap",
                maxHeight: "100%"
              }} onClick={(e) => newPasswordCodeRequest(e)}>{requestingCode ? "Sending..." : "Send Code"}</button>
            </div>

          </>}

          <button type={isForgotPassword ? 'button' : 'submit'} onClick={(e) => {
            e.preventDefault();
            if(isForgotPassword === false){
               handleSubmitLogin();
            } else {
              changeMyPassword();
            }
          }}>{isForgotPassword ? "Change Password" : "Login"}</button>

        </form>

        <div className='toggleButtonDiv'>
          <p onClick={() => setIsSignUp(true)}>Sign Up</p>
        </div></> : <div className='blocked'>
          <p>You are blocked, come back after:</p>
          <span>{getRemainingBlockTime()}</span>
          <button onClick={() => setIsBlocked(false)}>Return</button>
        </div>}

        <div className='signPageLanderInsider'>
          <div className='SignWithinside'>
            <Svgs type={"Google"} />
            <Link style={{color: 'inherit'}} to={`${process.env.REACT_APP_REGISTER_URL}/user/oauth/google`}><label>Sign with Google</label></Link>
          </div>
        </div>

      </div>)}

      
      <div className='signPageLander'>
        <div className='SignWith'>
          <Svgs type={"Google"} />
          <Link style={{color: 'inherit'}}to={`${process.env.REACT_APP_REGISTER_URL}/user/oauth/google`}><label>Sign with Google</label></Link>
        </div>
      </div>
      
    </div>
  )
};

export default Sign;
