import toast from "react-hot-toast";
import { setSavedSearches, loadSavedSearch } from "./searchSlice";

const API_BASE_URL = process.env.REACT_APP_CLIENT_URL;

export const saveAiSearch = async (auth, searchData, dispatch) => {
    const loadingToastId = toast.loading("Saving search...");
    try {
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not authenticated");
            return false;
        }

        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/user/save-ai-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(searchData)
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Search saved successfully!");
            await fetchSavedSearches(auth, dispatch);
            return true;
        } else {
            toast.error(data.msg || "Failed to save search");
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error saving search:', error);
        return false;
    } finally {
        toast.dismiss(loadingToastId);
    }
};

export const fetchSavedSearches = async (auth, dispatch) => {
    console.log('auth at fetchsavedsearch', auth);
    
    try {
        const user = auth.currentUser;
        if (!user) {
            dispatch(setSavedSearches([]));
            return;
        }

        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/user/get-saved-ai-searches`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(setSavedSearches(data.searches || []));
        } else {
            console.error('Failed to fetch saved searches');
            dispatch(setSavedSearches([]));
        }
    } catch (error) {
        console.error('Error fetching saved searches:', error);
        dispatch(setSavedSearches([]));
    }
};

export const deleteSavedSearch = async (auth, searchId, dispatch) => {
    const loadingToastId = toast.loading("Deleting search...");
    try {
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not authenticated");
            return false;
        }

        console.log('Delete request - searchId:', searchId); 

        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/user/delete-saved-ai-search`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ searchId })
        });

        console.log('Delete response status:', response.status);
        const data = await response.json();
        console.log('Delete response data:', data);
        
        if (response.ok) {
            toast.success("Search deleted successfully");
            // Refresh saved searches list
            await fetchSavedSearches(auth, dispatch);
            return true;
        } else {
            toast.error(data.msg || "Failed to delete search");
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error deleting search:', error);
        return false;
    } finally {
        toast.dismiss(loadingToastId);
    }
};

export const updateSearchName = async (auth, searchId, customName, dispatch) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not authenticated");
            return false;
        }

        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/user/update-saved-ai-search-name`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ searchId, customName })
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Search name updated");
            await fetchSavedSearches(auth, dispatch);
            return true;
        } else {
            toast.error(data.msg || "Failed to update search name");
            return false;
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error('Error updating search name:', error);
        return false;
    }
};

export const loadSearchResults = (savedSearch, dispatch) => {
    dispatch(loadSavedSearch({
        movieNames: savedSearch.movieNames,
        movieResults: savedSearch.movieResults,
        searchId: savedSearch._id
    }));
};