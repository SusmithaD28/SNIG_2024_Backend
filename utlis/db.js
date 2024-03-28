const mongoose=require("mongoose")
const URI=process.env.MONGO_URI

const connectDB=async()=>{
    try{
        await mongoose.connect(URI);
        console.log("connection succesfully");
    }
    catch(error){
        console.log("database connetion failed");
        process.exit(0)
    }
};

module.exports=connectDB;