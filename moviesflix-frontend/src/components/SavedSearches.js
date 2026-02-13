import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../utils/firebase';
import { fetchSavedSearches, deleteSavedSearch, loadSearchResults, updateSearchName } from '../utils/savedSearchUtils';
import { clearGptMovieResult } from '../utils/searchSlice';
import MovieSuggestions from './MovieSuggestions';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import useGenres from '../hooks/useGenres';
import Spinner from './Spinner';
import ConfirmModal from './ConfirmModal';

const SavedSearches = () => {
    const dispatch = useDispatch();
    const { savedSearches, currentSearchId } = useSelector((state) => state.gpt);
    const [isLoading, setIsLoading] = useState(true);
    console.log('savedsearch', savedSearches);
    
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchToDelete, setSearchToDelete] = useState(null);
    
    useGenres();

    useEffect(() => {
        dispatch(clearGptMovieResult());
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setIsLoading(true);
                await fetchSavedSearches(auth, dispatch);
                setIsLoading(false);
            } else {
                console.error('User not authenticated');
        setIsLoading(false);
            }
        });

        // Cleanup the subscription
        return () => {
            unsubscribe();
            dispatch(clearGptMovieResult());
        }
    }, [dispatch]);

    const handleLoadSearch = (search) => {
        loadSearchResults(search, dispatch);
        // Scroll to results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openDeleteModal = (search, e) => {
        e.stopPropagation();
        setSearchToDelete(search);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!searchToDelete) return;
        await deleteSavedSearch(auth, searchToDelete._id, dispatch);
        setSearchToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setSearchToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleEditName = (search, e) => {
        e.stopPropagation();
        setEditingId(search._id);
        setEditName(search.customName || search.fullQuestion);
    };

    const handleSaveName = async (searchId, e) => {
        e.stopPropagation();
        await updateSearchName(auth, searchId, editName, dispatch);
        setEditingId(null);
        setEditName('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    if (isLoading) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <Spinner />
          </div>
        );
      }

    if (savedSearches.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white p-6 mt-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Your Saved AI Searches</h1>
                <div className="text-center py-20">
                    <p className="text-gray-400 text-xl">No saved searches yet.</p>
                    <p className="text-gray-500 mt-2">Save your AI searches from the Chat page to see them here!</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-black text-white p-6 overflow-x-hidden">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Your Saved AI Searches</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {savedSearches.map((search) => (
                    <div
                        key={search._id}
                        className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700 ${currentSearchId === search._id ? 'ring-2 ring-red-600' : ''
                            }`}
                        onClick={() => handleLoadSearch(search)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-white flex-1">
                                {editingId === search._id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSaveName(search._id, e);
                                            } else if (e.key === 'Escape') {
                                                setEditingId(null);
                                                setEditName('');
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span>{search.customName || search.fullQuestion}</span>
                                )}
                            </h3>
                            <div className="flex gap-2 ml-2">
                                {editingId === search._id ? (
                                    <button
                                        onClick={(e) => handleSaveName(search._id, e)}
                                        className="text-green-400 hover:text-green-300"
                                    >
                                        <FontAwesomeIcon icon={faCheck} title='Save name' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => handleEditName(search, e)}
                                        className="text-blue-400 hover:text-blue-300"
                                        title="Edit name"
                                    >
                                        <FontAwesomeIcon icon={faPen} title='Edit search name' />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => openDeleteModal(search, e)} 
                                    className="text-red-400 hover:text-red-300"
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} title='Delete search' />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-2">
                            {search.fullQuestion}
                        </p>

                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{search.movieNames.length} results</span>
                            <span>{formatDate(search.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {currentSearchId && <MovieSuggestions />}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete saved search?"
                message={
                    searchToDelete
                        ? `Are you sure you want to delete "${(searchToDelete.customName || searchToDelete.fullQuestion).slice(0, 80)}"? This action cannot be undone.`
                        : ''
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default SavedSearches;