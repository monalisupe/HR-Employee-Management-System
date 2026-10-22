const mongoose= require("mpngoose");

const connectDB = async() => {
    try{
        const connection = await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        ); 
    }catch(error){
        console.log("MongoDB connected failed :", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;