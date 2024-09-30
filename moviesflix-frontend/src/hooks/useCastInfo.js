// import { useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { API_KEY } from "../utils/constants";
// import { getMovieInfo } from "../utils/movieSlice";

// const useCastInfo = (movie, selectedCategory) => {
//     const dispatch = useDispatch();


//     // fetch the data frm API and put it into the store
//     const getCastInfo = async () => {
//         try {
//             const response = await fetch(`https://api.themoviedb.org/3/${selectedCategory}/${movie.id}/credits?api_key=${API_KEY}`);
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch cast info for ${selectedCategory} ID ${movie.id}`);
//             }
//             const result = await response.json();
//             // console.log("Cast", result.cast);
//             dispatch(getMovieInfo({ id: movie.id, cast: result.cast }));
//         } catch (error) {
//             console.error("Error fetching cast info:", error);

//         }
//     }

//     useEffect(() => {
//         getCastInfo();
//     }, [selectedCategory, movie.id]);

// }

// export default useCastInfo;