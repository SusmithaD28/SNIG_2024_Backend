const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { Admin, User, Movies } = require("../db");
const {JWT_SECRET,saltRounds} = require("../config");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ConnectionStates } = require("mongoose");

// User Routes

// singup
router.post('/signup', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const auth = await bcrypt.compare(password,hashedPassword);
    if(!auth)
    {
        console.log("noMatch");
    }
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    // Create the user
    try {
        await User.create({
            name,
            password:hashedPassword,
            email
        });
        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// signin
router.post('/signin', async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email
    })
    if(!user)
    {
        return res.status(400).json({msg: "User doesn't exist"});
    }
    const auth = await bcrypt.compare(password,user.password);
    if(!auth)
    {
        return res.status(400).json({msg:'Incorrect password'});
    }
    const token = jwt.sign({
        email,
        iat: Math.floor(Date.now() / 1000) 
    }, JWT_SECRET,{expiresIn:'1d'});
    res.json({token})
});

// signout

// delete account
router.post('/delete', userMiddleware, async (req, res) => {
    const email = req.email;
    const response = await User.deleteOne({email});
    res.json({
        msg: "Account deleted successfully"
    })
});

// get all movies
router.get('/movies', async(req, res) => {
    const response = await Movies.find({});
    res.json({
        movies: response
    })
});

// get a movie
router.get('/movies/:movieId', userMiddleware, async (req, res) => {
    const movieId = req.params.movieId;
    try {
        const response = await Movies.findOne({ "_id": movieId });
        if (!response) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ movies: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// add a sub
router.post('/subscription', userMiddleware, async (req, res) => {
    const sub = req.body.subscription;
    const email = req.email;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.subscription = sub;
            await user.save(); 
            res.json({ message: "Subscription updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// get sub
router.get('/subscription', userMiddleware, (req, res) => {
    const subscription = req.subscription;
    if(subscription!=null)
    {
        res.json({
            msg: "Not subscribed"
        })
    }
    else
    {
        res.json({
            subscription
        })
    }
});

// watch a movie
router.get('/movies/:movieId/watch', userMiddleware, (req, res) => {
    const movieId = req.params.movieId;
    const subscription = req.subscription;
    // show if subscribed
    if(subscription==null)
    {
        res.json({
            msg: "Please subscribe to watch"
        })
    }
    else
    {
        res.json({
            msg: "Here's the movie"
        })
    }
});

// get user (me)
router.get('/me', userMiddleware, async(req, res) => {
    const email = req.email;
    const user = await User.findOne({
        email
    })
    if (user) {
        res.json({
            user
        })
    } else {
        res.status(411).json({
            message: "user not found"
        })
    }
});

module.exports = router