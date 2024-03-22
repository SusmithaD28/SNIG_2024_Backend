const {JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken");
const { Admin, User, Movies } = require("../db");
async function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({msg:'Access denied. No token provided.' });
    }
    const words = token.split(" ");
    const jwtToken = words[1];
    try {
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        // console.log(decodedValue)
        const email=decodedValue.email;
        if(email) {
            const user = await User.findOne({
                email
            })
            // console.log(user.email);
            req.subscription = user.subscription;
            req.email = email;
            next();
        }else{
            res.status(403).json({
                msg: "You are not authenticated"
            })
        }
    } catch(e) {
        res.json({
            msg: "Incorrect inputs"
        })
    }
}
module.exports = userMiddleware;