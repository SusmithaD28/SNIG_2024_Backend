const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, User, Movies } = require("../db");
const {JWT_SECRET} = require("../config");
const router = Router();
const jwt = require("jsonwebtoken");

// Admin Routes

// signup
router.post('/signup', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    // check if a user with this username already exists
    await Admin.create({
        name: name,
        password: password
    })
    // console.log(JWT_SECRET);
    res.json({
        message: 'Admin created successfully'
    })
});

// signin
router.post('/signin', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    const admin = await Admin.find({
        name,
        password
    })
    if (admin) {
        const token = jwt.sign({
            name
        }, JWT_SECRET,{expiresIn:'1d'});

        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect admin username or password"
        })
    }
});

// add movie
router.post('/movies', adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const plot = req.body.plot;
    const genres = req.body.genres;
    const runtime = req.body.runtime;
    const newmovie = await Movies.create({
        title,
        description,
        imageLink,
        price
    })

    res.json({
        message: 'movie added successfully', movieId: newmovie._id
    })
});

// get movies
router.get('/movies', adminMiddleware, async (req, res) => {
    const response = await Movies.find({});
    res.json({
        movies: response
    })

});

// get a movie
router.get('/movies/:movieId', adminMiddleware, async (req, res) => {
    const response = await Movies.find({"_id":movieId});
    res.json({
        movies: response
    })
});

// delete movie
router.post('/movies/delete/:movieId', adminMiddleware, async (req, res) => {
    Movies.deleteOne({"_id":movieId})
    res.json({
        message: 'movie deleted successfully'
    })
});

// get all users
router.get('/users', adminMiddleware, async (req, res) => {
    const response = await User.find({});
    res.json({
        users: response
    })
});

// get a user
router.get('/users/:userId', adminMiddleware, async (req, res) => {
    const response = await User.find({"_id":userId});
    res.json({
        user: response
    })
});

// delete user
router.post('/users/delete/:userId', adminMiddleware, async (req, res) => {
    const response = await User.deleteOne({"_id":userId});
    res.json({
        msg: "user deleted successfully"
    })
});

// watch a movie
router.post('/movies/watch/:movieId', adminMiddleware, async (req, res) => {
    res.json({
        link: ""
    })
});

module.exports = router;