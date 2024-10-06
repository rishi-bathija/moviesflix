import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearGptMovieResult, toggleAiSearch, toggleGptSearch } from '../utils/searchSlice';
import { changeLanguage } from '../utils/configSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from './accountlogo-removebg-preview.png';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { removeUser, addUser } from '../utils/userSlice';
import { lang } from '../utils/constants';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);
  const showGptSearch = useSelector(store => store.gpt.showGptSearch);
  const showAiSearch = useSelector(store => store.gpt.showAiSearch);


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

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      navigate("/error");
    });
  };

  const handleGptSearch = () => {
    dispatch(toggleGptSearch());
    if (showAiSearch) {
      dispatch(toggleAiSearch()); // Turn off AI search if it's enabled
    }
  };

  const handleHomeClick = () => {
    // Reset both search states to return to the home page
    if (showGptSearch || showAiSearch) {
      dispatch(toggleGptSearch()); // Turn off GPT search
      if (showAiSearch) {
        dispatch(toggleAiSearch()); // Turn off AI search
      }
    }
  };


  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };


  const toggleSearch = (e) => {
    dispatch(clearGptMovieResult()); // Clear results when toggling
    if (e.target.value === "AI Search") {
      dispatch(toggleAiSearch());
      dispatch(toggleGptSearch()); // Turn off GPT search
    } else {
      dispatch(toggleGptSearch());
      if (showAiSearch) {
        dispatch(toggleAiSearch()); // Turn off AI search
      }
    }
  };

  return (
    <div className='absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-row justify-between items-center '>
      {(!showGptSearch && !showAiSearch) && (
        <Link to={"/"}>
          <img
            className="pl-0 md:pl-5 w-40 md:w-48 max-w-full cursor-pointer bg-none my-2 -ml-4 md:ml-0"
            src={logo}
            alt="logo"
          />
        </Link>
      )}
      {user && (
        <div className='flex items-center absolute gap-4 right-5 top-5'>
          {(showGptSearch || showAiSearch) && (
            <select className='p-2 bg-red-800 text-white m-2' onChange={toggleSearch}>
              <option>Normal Search</option>
              <option>AI Search</option>
            </select>
          )}
          {(showGptSearch || showAiSearch) && (
            <select className='p-2 bg-red-800 text-white m-2' onChange={handleLanguageChange}>
              {lang.map((l) => (
                <option key={l.identifier} value={l.identifier}>{l.name}</option>
              ))}
            </select>
          )}
          {(showGptSearch || showAiSearch) && <FontAwesomeIcon
            icon={faHome}
            onClick={handleHomeClick}  // Use the new function here
            className='text-white text-2xl cursor-pointer'
          />}

          {(!showGptSearch && !showAiSearch) && <FontAwesomeIcon
            icon={faSearch}
            onClick={handleGptSearch}  // Search icon toggles GptSearch
            className='text-white text-2xl cursor-pointer'
          />}

          {(!showGptSearch && !showAiSearch) && (
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
