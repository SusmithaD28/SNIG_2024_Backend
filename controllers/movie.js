const Movie=require("../models/movie-model");

const getAllMovieTesting=async(req,res)=>{
    const myData=await Movie.find(req.query);
    res.status(200).json({myData});
};

module.exports={getAllMovieTesting};