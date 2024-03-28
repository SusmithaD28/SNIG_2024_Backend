// Username: shrutipatel2688
// Password: eqJxUwBNqcGhdLeP
// mongodb+srv://<username>:<password>@cluster0.b3ulavk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// connection string: mongodb+srv://<username>:<password>@cluster0.b3ulavk.mongodb.net/
require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes');
const connectDB=require("./utlis/db")
const app=express();
app.use(express.json());

const movie_routes=require("./routes/movies");
const PORT=process.env.PORT || 4000;
const MONGOURL = process.env.MONGO_URI;

    connectDB().then(()=>{  
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    });
});

app.get("/",(req,res)=>{
    res.send("Hi I am live");
})

app.use('/api', userRoutes);

// middleware or to set router
app.use("/api/movies",movie_routes);
// const movieSchema = new mongoose.Schema({
//     name: String,
//     description: String
// })

// const MovieModel=mongoose.model("movie",movieSchema);

// app.get("/movie",(req,res)=>{
//     MovieModel.find({}).then(function(movie){
//         res.json(movie)
//     }).catch(function(err){
//         console.log(err)
//     })
// })

// app.get("/search", async (req, res) => {
//     const name = req.query.name; 
//     var id='65f9dd8a1132e990f9a6fd8b'
//     var queryObject = {};
//     if (name) {
//         queryObject.name = name;
//     }
//     const data = await MovieModel.findById(id);
//     console.log(data);
//     res.json({ data });
// });
