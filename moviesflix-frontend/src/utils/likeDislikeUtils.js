
import toast from "react-hot-toast";
import { addDislikedMovie, addLikedMovie, removeDislikedMovie, removeLikedMovie, setDislikedMovies, setLikedMovies } from "./likeDislikeSlice";

const API_BASE_URL = process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';

export const handleLikeMovie = async (auth, movie, selectedCategory, dispatch) => {
    const loadingToastId = toast.loading("Adding to liked movies...");
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/user/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ data: { ...movie, selectedCategory } })
            });

            if (response.ok) {
                console.log('Movie added to liked movies');
                toast.success("Added to liked movies");
                dispatch(addLikedMovie(movie));
                return true;
            } else {
                const errorData = await response.json();
                toast.error(errorData.msg || "Failed to add to liked movies");
                console.log('Failed to add movie to liked movies', response.error);
                return false;
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error adding movie to liked movies:', error);
        return false;
    } finally {
        toast.dismiss(loadingToastId);
    }
};

export const handleDislikeMovie = async (auth, movie, selectedCategory, dispatch) => {
    const loadingToastId = toast.loading("Adding to disliked movies...");
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/user/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ data: { ...movie, selectedCategory } })
            });

            if (response.ok) {
                console.log('Movie added to disliked movies');
                toast.success("Marked as not for you");
                dispatch(addDislikedMovie(movie));
                return true;
            } else {
                const errorData = await response.json();
                toast.error(errorData.msg || "Failed to mark as not for you");
                console.log('Failed to add movie to disliked movies', response.error);
                return false;
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error adding movie to disliked movies:', error);
        return false;
    } finally {
        toast.dismiss(loadingToastId);
    }
};

export const handleRemoveLike = async (auth, movieId, dispatch) => {
    const loadingToastId = toast.loading("Removing from liked movies...");
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/user/unlike`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ movieId })
            });

            if (response.ok) {
                console.log('Movie removed from liked movies');
                toast.success("Removed from liked movies");
                dispatch(removeLikedMovie(movieId));
                return true;
            } else {
                toast.error("Failed to remove from liked movies");
                console.error('Failed to remove from liked movies', response.status);
                return false;
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error removing from liked movies:', error);
        return false;
    } finally {
        toast.dismiss(loadingToastId);
    }
};

export const handleRemoveDislike = async (auth, movieId, dispatch) => {
    const loadingToastId = toast.loading("Removing from disliked movies...");
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/user/undislike`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ movieId })
            });

            if (response.ok) {
                console.log('Movie removed from disliked movies');
                toast.success("Rating removed");
                dispatch(removeDislikedMovie(movieId));
                return true;
            } else {
                toast.error("Failed to remove rating");
                console.error('Failed to remove rating', response.status);
                return false;
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error removing rating:', error);
        return false;
    } finally {
        toast.dismiss(loadingToastId);
    }
};

export const fetchLikedMovies = async (auth, dispatch) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/user/liked-movies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setLikedMovies(data.movies || []));
            } else {
                console.error('Failed to fetch liked movies');
                dispatch(setLikedMovies([]));
            }
        }
        else {
            dispatch(setLikedMovies([]));
            toast.error("User not authenticated");
            console.error('User not authenticated');
        }
    } catch (error) {
        console.error('Error fetching liked movies:', error);
        dispatch(setLikedMovies([]));
    }
};

export const fetchDislikedMovies = async (auth, dispatch) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/user/disliked-movies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setDislikedMovies(data.movies || []));
            } else {
                console.error('Failed to fetch disliked movies');
                dispatch(setDislikedMovies([]));
            }
        } else {
            dispatch(setDislikedMovies([]));
            toast.error("User not authenticated");
            console.error('User not authenticated');
        }
    } catch (error) {
        console.error('Error fetching disliked movies:', error);
        dispatch(setDislikedMovies([]));
    }
};