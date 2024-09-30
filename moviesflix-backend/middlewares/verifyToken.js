const firebase = require("../config/firebase");

exports.verifyToken = async (req, res, next) => {
    try {
        // extract token
        const idToken = req.headers.authorization.split('Bearer ')[1];

        // if token missing, then return response
        if (!idToken) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        // verify the token
        try {
            const decodedToken = await firebase.auth().verifyIdToken(idToken);
            req.user = decodedToken;
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                successs: false,
                message: "Token is invalid",
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            successs: false,
            message: "Something went wrong while validating the token",
        })
    }
}