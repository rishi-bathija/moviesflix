import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../utils/firebase';
import { Link, useNavigate } from 'react-router-dom';
import './loginStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { toggleGptSearch } from '../utils/gptSlice';
import { lang } from '../utils/constants';
import { changeLanguage } from '../utils/configSlice';
import logo from './accountlogo-removebg-preview.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector(store => store.user);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      navigate("/error");
    });
  };

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGptSearch = () => {
    dispatch(toggleGptSearch());
  };

  const showGptSearch = useSelector(store => store.gpt.showGptSearch);
  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className='absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-row justify-between items-center '>
      <Link to={"/"}>
        <img className="pl-0 md:pl-5 w-36 md:w-48 cursor-pointer bg-none my-2 -ml-4 md:ml-0" src={logo} alt="logo" />
      </Link>
      {user && (
        <div className='flex items-center relative gap-4'>
          {showGptSearch && (
            <select className='p-2 bg-red-800 text-white m-2' onChange={handleLanguageChange}>
              {lang.map((l) => (
                <option key={l.identifier} value={l.identifier}>{l.name}</option>
              ))}
            </select>
          )}
          {showGptSearch ? (
            <FontAwesomeIcon icon={faHome} onClick={handleGptSearch} className='text-white text-2xl cursor-pointer' />
          ) : (
            <FontAwesomeIcon icon={faSearch} onClick={handleGptSearch} className='text-white text-2xl cursor-pointer' />
          )}

          {!showGptSearch && (
            <div className="group relative flex items-center cursor-pointer">
              <span className='text-white mr-2 hidden md:block text-2xl'>Hello, {user?.displayName}</span>
              <img className='w-10 h-10 md:w-12 md:h-12 p-1 rounded-full' src={user?.photoURL} alt="user" />
              <FontAwesomeIcon icon={faCaretDown} className='text-white text-lg ml-2' />

              {/* Dropdown shown on hover */}
              <div className='hidden group-hover:block absolute right-0 mt-2 py-2 w-60 top-[50%] translate-y-[20%] bg-red-800 rounded-lg shadow-xl z-20'>
                <button
                  onClick={() => {
                    navigate('/mylist');
                  }}
                  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
                  My List
                </button>
                <button
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
