import toast from "react-hot-toast";
import { addToWatchlist, removeFromWatchlist, setWatchlist } from "./movieSlice";



export const handleAddToWatchlist = async (auth, movie, selectedCategory, dispatch) => {
    const loadingToastId = toast.loading("Adding to watchlist...");
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch('https://moviesflix-xi.vercel.app/api/user/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ data: { ...movie, selectedCategory } })
            });

            if (response.ok) {
                console.log('Movie added to watchlist');
                toast.success("Added to watchlist");
                dispatch(addToWatchlist(movie));
            } else {
                toast.error("Failed to add to watchlist");
                console.log('Failed to add movie to watchlist', response.error);
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error adding movie to watchlist:', error);
    }
    toast.dismiss(loadingToastId);
};


export const handleRemoveFromWatchlist = async (auth, movie, dispatch) => {
    const loadingToastId = toast.loading("Removing from watchlist...");
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch('https://moviesflix-xi.vercel.app/api/user/remove', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ movieId: movie.id })
            });

            if (response.ok) {
                // Remove the deleted movie from the watchlist state
                dispatch(removeFromWatchlist(movie.id));
                toast.success("Removed from watchlist");
                console.log('Deleted movie:', movie.id);
            } else {
                toast.error("Failed to delete from watchlist");
                console.error('Failed to delete movie, status:', response.status);
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error deleting movie:', error);
    }
    toast.dismiss(loadingToastId);
};

export const fetchWatchlist = async (auth, dispatch, setLoading) => {
    try {
        const user = auth.currentUser;
        // console.log('curruser', user);

        if (user) {
            const idToken = await user.getIdToken();
            // console.log('idtoken', idToken);

            const response = await fetch('https://moviesflix-xi.vercel.app/api/user/watchlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });
            // console.log('response', response);


            if (response.ok) {
                const data = await response.json();
                // console.log('data', data);

                dispatch(setWatchlist(data.movies || []));  // Dispatch the action to store the watchlist
                // console.log('Fetched watchlist:', data.movies);
            } else {
                toast.error("Failed to fetch watchlist");
                console.error('Failed to fetch watchlist, status:', response.status);
            }
        } else {
            toast.error("User not authenticated");
            console.error('User not authenticated');
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error fetching watchlist:', error);
    }
};