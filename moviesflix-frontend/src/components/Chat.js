import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addGptMovieResult } from '../utils/gptSlice';
import MovieSuggestions from './MovieSuggestions';
const Chat = () => {
    const [answer, setAnswer] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(""); // Store the predefined question part
    const [userInput, setUserInput] = useState(""); // Store the additional user input
    // const [countryInput, setCountryInput] = useState(""); // Store the user-specified country
    const dispatch = useDispatch();

    const predefinedQuestions = [
        "Suggest me some",
        "Movies and tv shows similar to",
        "Trending movies and tv shows",
        "Top-rated movies and tv shows",
        "Newly release movies and tv shows"
    ];

    // Function to handle question selection
    const handleQuestionSelect = (predefined) => {
        setSelectedQuestion(predefined); // Set the selected question part
        setUserInput(""); // Reset any previous user input
    };

    const searchMovie = async (movie) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/multi?query=${movie}&api_key=${process.env.REACT_APP_API_KEY}`)
            return response.data.results;
        } catch (error) {
            console.error(`Error fetching data for ${movie}:`, error);
            return [];
        }
    }

    const generateResponse = async () => {
        setAnswer("Loading...");
        try {
            const user = auth.currentUser;
            if (user) {
                const idToken = await user.getIdToken();

                // Combine the predefined question with the user's input
                const finalQuestion = selectedQuestion + " " + userInput;
                console.log('finalquestion', finalQuestion);

                // Prepare the request body
                const requestBody = JSON.stringify({ question: finalQuestion });

                const response = await fetch("https://moviesflix-backend.vercel.app/api/user/generate-chat-response", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: requestBody,
                });

                const responseData = await response.json(); // Parse the response as JSON
                // console.log('responsedata', responseData);

                // Check if the response contains movies and tvShows
                let movieList = [];
                if (responseData.movies && responseData.tvShows) {
                    movieList = `${responseData.movies}, ${responseData.tvShows}`.split(", ");
                } else {
                    // For responses from the Gemini API
                    movieList = responseData.candidates[0].content.parts[0].text.split(", ");
                }

                // Make API calls for each movie in the list
                const individResp = movieList.map((movie) => searchMovie(movie));

                const searchResults = await Promise.all(individResp);

                // console.log('searchRes', searchResults);

                dispatch(addGptMovieResult({ movieNames: movieList, gptResults: searchResults }));

                // Update the answer after the search results have been processed
                setAnswer(movieList); // or however you want to display the movie list
            }
        } catch (error) {
            setAnswer("Something went wrong. Please try again.");
            console.error("Error fetching response: ", error);
        }
    };

    // console.log('answer', answer);

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 w-full overflow-x-hidden mt-20">
            {/* <div className="fixed inset-0 -z-10">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/563192ea-ac0e-4906-a865-ba9899ffafad/6b2842d1-2339-4f08-84f6-148e9fcbe01b/IN-en-20231218-popsignuptwoweeks-perspective_alpha_website_large.jpg"
                    alt="background"
                    className="h-full w-full object-cover"
                />
            </div> */}
            <h1 className="text-3xl md:text-4xl text-red-600 font-bold mb-4 md:mb-8">MoviesFlix Chatbot</h1>
            <div className="searchbar flex justify-center flex-col sm:flex-row w-full sm:w-3/4 mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 space-y-2 sm:space-y-4 w-full">
                    <div className="space-y-2">
                        {predefinedQuestions.map((questionPart, index) => (
                            <button
                                key={index}
                                className="w-full px-2 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-lg rounded-lg transition duration-300 ease-in-out"
                                onClick={() => handleQuestionSelect(questionPart)}
                            >
                                {questionPart}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        {selectedQuestion && (
                            <div className="absolute top-2 left-4 text-gray-300 pointer-events-none text-sm sm:text-base">
                                {selectedQuestion}
                            </div>
                        )}
                        <input
                            type="text"
                            className="w-full px-4 py-2 text-sm sm:text-lg rounded-lg bg-red-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Complete your question here..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            disabled={!selectedQuestion}
                            style={{ paddingLeft: selectedQuestion ? `${selectedQuestion.length + 1}ch` : '1rem' }}
                            title={!selectedQuestion && 'Please select a question first'}
                        />
                    </div>

                    <button
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-lg rounded-lg transition duration-300 ease-in-out"
                        onClick={generateResponse}
                        disabled={!selectedQuestion}
                    >
                        Generate Answer
                    </button>
                </div>
            </div>

            {/* Display the response */}
            <MovieSuggestions />
        </div>
    );


};

export default Chat;