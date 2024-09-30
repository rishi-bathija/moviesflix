// console.log("authtoken", process.env.REACT_APP_API_OPTIONS_AUTH_TOKEN);

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_API_OPTIONS_AUTH_TOKEN}`
  }
};

export const IMG_CDN = "https://image.tmdb.org/t/p/original";

export const API_KEY = process.env.REACT_APP_API_KEY;

export const lang = [
  { identifier: "en", name: "English" },
  { identifier: "hi", name: "Hindi" },
  { identifier: "es", name: "Spanish" },
]

export const gpt_api = process.env.REACT_APP_GPT_API;