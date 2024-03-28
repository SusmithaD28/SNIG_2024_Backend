const express=require("express");
const router =express.Router();

const{
    getAllMovieTesting
}=require("../controllers/movie");

router.route("/").get(getAllMovieTesting);

module.exports=router;