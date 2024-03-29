const { Router, request } = require("express");
const userMiddleware = require("../middleware/user");
const { User, Movies, embeddedMovies } = require("../db");
const {JWT_SECRET,saltRounds} = require("../config");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ConnectionStates } = require("mongoose");
const adminMiddleware = require("../middleware/admin");
require('dotenv').config({ path: "./.env" });
const mongoose = require('mongoose');
uri = process.env.DBURI;

// var cloudinary = require('cloudinary').v2;
// const api_secret = process.env.CLOUDINARY_API;          
// cloudinary.config({ 
//   cloud_name: 'dmosrjvky', 
//   api_key: '395151562262217', 
//   api_secret: api_secret 
// });
// singup
router.post('/signup', async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
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
            firstname,
            lastname,
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
    const subscribedAt = user.subscribedAt;
    const date = Date.now();
    if(user.role!="admin" && subscribedAt!=null)
    {
        if(date-subscribedAt>2592000000)
        {
            user.subscription = null;
            await user.save();
        }
    }
    const token = jwt.sign({
        email,
        iat: Math.floor(Date.now() / 1000) 
    }, JWT_SECRET,{expiresIn:'1d'});
    res.json({token,firstname:user.firstname,role:user.role,subscription:user.subscription,subscribedAt:user.subscribedAt})
});

// signout

// delete account
router.delete('/delete', userMiddleware, async (req, res) => {
    const email = req.email;
    const response = await User.deleteOne({email});
    res.json({
        msg: "Account deleted successfully"
    })
});

// get all movies
router.get('/movies', userMiddleware, async(req, res) => {
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
            const response_ = await embeddedMovies.findOne({ "_id": movieId });
            if(!response_)
                return res.status(404).json({ message: 'Movie not found' });
            return res.status(200).json({ movies: response_ });
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
    const role = req.role;
    const date = Date.now();
    if(role=="admin"){
        return res.json({ message: "You are admin" });
    }
    const email = req.email;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.subscription = sub;
            user.subscribedAt = date;
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
router.get('/subscription', userMiddleware, async(req, res) => {
    const subscription = req.subscription;
    const email = req.email;
    if(subscription==null)
    {
        res.json({
            message: "Not subscribed"
        })
    }
    else
    {
        const user = await User.findOne({ email });
        res.json({
            subscription:user.subscription,subscribedAt:user.subscribedAt
        });
    }
});
// router.get('/videos/watch', userMiddleware, async (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         // Check if files
//         if (!files || files.length === 0) {
//           return res.status(404).json({
//             err: 'No files exist'
//           });
//         }
    
//         // Files exist
//         return res.json(files);
//       });
// });
// router.post('/upload',(req, res) => {
//     cloudinary.uploader.upload("../videos/gif.mp4",
//   { public_id: "gif" }, 
//   function(error, result) {console.log("hello"); });
//   res.json({msg: "uploaded"});
//   });
// watch a movie fetch from videos database
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

router.post('/movies',userMiddleware, adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const plot = req.body.plot;
    const genres = req.body.genres;
    const runtime = req.body.runtime;
    const newmovie = await Movies.create({
        title,
        plot,
        genres,
        runtime
    })

    res.json({
        message: 'movie added successfully', movieId: newmovie._id
    })
});

// get movies
router.get('/movies', userMiddleware, adminMiddleware, async (req, res) => {
    const response = await Movies.find({});
    res.json({
        movies: response
    })

});

// get a movie
router.get('/movies/:movieId', userMiddleware, adminMiddleware, async (req, res) => {
    const movieId = req.params.movieId;
    const response = await Movies.find({"_id":movieId});
    res.json({
        movies: response
    })
});

// delete movie
router.delete('/movies/delete/:movieId', userMiddleware, adminMiddleware, async (req, res) => {
    const movieId = req.params.movieId;
    await Movies.deleteOne({"_id":movieId})
    res.json({
        message: 'movie deleted successfully'
    })
});

// get all users
router.get('/users', userMiddleware, adminMiddleware, async (req, res) => {
    const response = await User.find({});
    res.json({
        users: response
    })
});

// get a user
router.get('/users/:userId', userMiddleware, adminMiddleware, async (req, res) => {
    const userId = req.params.userId;
    const response = await User.find({"_id":userId});
    res.json({
        user: response
    })
});

// delete user
router.delete('/users/delete/:userId', userMiddleware, adminMiddleware, async (req, res) => {
    const userId = req.params.userId;

    const response = await User.deleteOne({"_id":userId});
    res.json({
        msg: "user deleted successfully"
    })
});

router.get('/videos', userMiddleware, adminMiddleware, async (req, res) => {
    
});
module.exports = router