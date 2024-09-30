import React, { useRef, useState } from 'react';
import Header from './Header';
import './loginStyle.css';
import { checkValidateData } from '../utils/validate';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from "firebase/auth";
import { auth } from '../utils/firebase';
import userProfile from './Untitled.png';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const phone = useRef(null);

  const handleButtonClick = () => {
    const message = checkValidateData(email.current.value, password.current.value, name?.current?.value, phone?.current?.value);
    setErrorMsg(message);

    // if the message is present, i.e there must be something wrong with the validation
    if (message) return;

    // signin/signup:-

    // signup
    if (!isSignIn) {
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          // console.log(user);

          // update user's profile
          updateProfile(user, {
            displayName: name.current.value, photoURL: userProfile
          }).then(() => {
            // Profile updated!

            const { uid, email, displayName, photoURL } = auth.currentUser;
            dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }));

            // once profile is updated, the navigate to browse
            // ...
          }).catch((error) => {
            // An error occurred
            setErrorMsg(error.message);
          });

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMsg(errorCode + "-" + errorMessage)
        });
    }
    //signin
    else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // console.log(user);
        })
        .catch((error) => {
          console.log('error', error);

          const errorCode = error.code;

          const errorMessage = error.message;
          setErrorMsg(errorCode + " : " + errorMessage)
        });

    }
  }

  const handleSignIn = () => setIsSignIn(!isSignIn);
  const toggleShowPassword = () => setShowPassword(!showPassword); // Function to toggle password visibility

  return (
    <div>
      <Header />
      <div className="absolute inset-0">
        <img src="https://assets.nflxext.com/ffe/siteui/vlv3/563192ea-ac0e-4906-a865-ba9899ffafad/6b2842d1-2339-4f08-84f6-148e9fcbe01b/IN-en-20231218-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="background"
          className="object-cover h-screen w-full" />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="w-11/12 sm:w-96 absolute mx-auto p-8 bg-black bg-opacity-75 rounded-md text-white my-36 right-0 left-0 ">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignIn && (
          <>
            <input ref={name} className="p-4 my-2 w-full bg-gray-700 rounded-md text-base placeholder-gray-400" type="text" placeholder="Full Name" />
            <input ref={phone} className="p-4 my-2 w-full bg-gray-700 rounded-md text-base placeholder-gray-400" type="text" placeholder="Mobile No." />
          </>
        )}

        <input ref={email} className="p-4 my-2 w-full bg-gray-700 rounded-md text-base placeholder-gray-400" type="email" placeholder="Email Address" />

        <div className="relative my-2">
          <input
            ref={password}
            className="p-4 w-full bg-gray-700 rounded-md text-base placeholder-gray-400"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <span
            className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400"
            onClick={toggleShowPassword}
          >
            {showPassword ? '🙈' : '👁️'} {/* Emoji icons to toggle visibility */}
          </span>
        </div>

        {errorMsg && <p className="text-red-500 font-semibold text-sm">{errorMsg}</p>}

        <button
          onClick={handleButtonClick}
          className="p-4 my-4 bg-red-600 w-full rounded-md hover:bg-red-700 text-white text-lg font-semibold">
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-center text-sm mt-4 cursor-pointer text-gray-300" onClick={handleSignIn}>
          {isSignIn ? "New to MoviesFlix? Sign Up Now" : "Already registered? Sign In"}
        </p>
      </form>
    </div>
  );
};

export default Login;

// import React, { useRef, useState } from 'react'
// import Header from './Header'
// import './loginStyle.css'
// import { checkValidateData } from '../utils/validate'
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { signInWithEmailAndPassword } from "firebase/auth";

// import { auth } from '../utils/firebase';
// import { updateProfile } from "firebase/auth";
// import userProfile from './Untitled.png';
// import { useDispatch } from 'react-redux';
// import { addUser } from '../utils/userSlice';


// const Login = () => {

//   const [isSignIn, setIsSignIn] = useState(true);
//   const handleSignIn = () => {
//     setIsSignIn(!isSignIn);
//   }


//   const dispatch = useDispatch();

//   const [errorMsg, setErrorMsg] = useState(null);
//   const email = useRef(null);
//   const password = useRef(null);
//   const name = useRef(null);
//   const phone = useRef(null);

//   const handleButtonClick = () => {
//     console.log(email.current.value);
//     console.log(password.current.value);
//     // console.log(name.current.value);
//     // console.log(phone.current.value);
//     // Validate the form data
//     const message = checkValidateData(email.current.value, password.current.value, name?.current?.value, phone?.current?.value);
//     console.log(message);
//     setErrorMsg(message);

//     // if the message is present, i.e there must be something wrong with the validation


//     if (message) return;

//     // signin/signup:-

//     // signup
//     if (!isSignIn) {
//       createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
//         .then((userCredential) => {
//           // Signed up
//           const user = userCredential.user;
//           console.log(user);

//           // update user's profile
//           updateProfile(user, {
//             displayName: name.current.value, photoURL: userProfile
//           }).then(() => {
//             // Profile updated!

//             const { uid, email, displayName, photoURL } = auth.currentUser;
//             dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }));

//             // once profile is updated, the navigate to browse
//             // ...
//           }).catch((error) => {
//             // An error occurred
//             setErrorMsg(error.message);
//           });

//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           setErrorMsg(errorCode + "-" + errorMessage)
//         });
//     }
//     //signin
//     else {
//       signInWithEmailAndPassword(auth, email.current.value, password.current.value)
//         .then((userCredential) => {
//           // Signed in
//           const user = userCredential.user;
//           console.log(user);
//         })
//         .catch((error) => {
//           const errorCode = error.code;

//           const errorMessage = error.message;
//           setErrorMsg(errorCode + " : " + errorMessage)
//         });

//     }
//   }

//   return (
//     <div>
//       <Header />
//       <div className='relative'>
//         <div style={{
//           backgroundImage: `linear-gradient(to bottom,rgba(0,0,0,0.7) 20%,rgba(255,255,255,0.1) 60%,rgba(0,0,0,0.7)) 40%,url(https://assets.nflxext.com/ffe/siteui/vlv3/7ca5b7c7-20aa-42a8-a278-f801b0d65fa1/fb548c0a-8582-43c5-9fba-cd98bf27452f/IN-en-20240326-popsignuptwoweeks-perspective_alpha_website_small.jpg)`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '100vh',
//           width: '100%',
//           position: 'relative',
//         }}
//         ></div>
//       </div>
//       <form onSubmit={(e) => e.preventDefault()} className="w-full md:w-3/12 p-12 bg-black my-36 mx-auto right-0 left-0 text-white bg-opacity-90 absolute top-0 opacity-85">

//         <h1 className="font-bold text-3xl py-4">
//           {isSignIn ? "Sign In" : "Sign Up"}</h1>

//         {!isSignIn && (<input ref={name} className="p-4 my-4 w-full bg-gray-700 rounded-sm" type="text" placeholder='Full Name' />)}

//         {!isSignIn && (<input ref={phone} className="p-4 my-4 w-full bg-gray-700 rounded-sm" type="text" placeholder='Mobile No.' />)}

//         {/* ref={email} gives the reference of the input box(email) in the form of object*/}
//         <input ref={email} className="p-4 my-4 w-full bg-gray-700 rounded-sm" type="text" placeholder='Email Address' />

//         <input ref={password} className="p-4 my-4 w-full bg-gray-700 rounded-sm" type="password" placeholder='Password' />

//         <p style={{ color: 'red', fontWeight: 'bolder' }}>{errorMsg}</p>

//         <button onClick={handleButtonClick} className="p-4 my-4 bg-red-600 w-full rounded-sm hover:bg-red-700">{isSignIn ? "Sign In" : "Sign Up"}</button>

//         <p className='py-4 p-text cursor-pointer text-dec' onClick={handleSignIn}>

//           {isSignIn ? "New to Netfix? Sign Up Now" : "Already registered? Sign in"}</p>
//       </form>
//     </div>
//   )
// }

// export default Login
