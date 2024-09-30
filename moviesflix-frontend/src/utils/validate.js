export const checkValidateData = (email, password, name, phone) => {

    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
    const isNameValid = name ? /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/.test(name) : true;
    const isNumValid = phone ? /^\+?[1-9][0-9]{7,14}$/.test(phone) : true;

    if (!isEmailValid) return "Please enter a valid email address (e.g., user@example.com).";
    if (!isPasswordValid) return "Password must start with capital letter, and must be at least 8 characters long, with atleast one lowercase, uppercase, and one number.";
    if (!isNameValid) return "Name should start with an uppercase letter";
    if (!isNumValid) return "Phone number should be a valid";

    return null;
}

