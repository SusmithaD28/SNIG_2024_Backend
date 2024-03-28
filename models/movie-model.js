const mongoose=require('mongoose')

const movieSchema=new mongoose.Schema({
    name:String,
    description:String
})

const Movie=new mongoose.model("Movie",movieSchema);
module.exports=Movie;