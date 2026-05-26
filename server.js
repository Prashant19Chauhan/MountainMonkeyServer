import "./self/utility/loadEnv.js";
import mongoose from "mongoose";
import app from "./src/app.js";

const port = process.env.PORT

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected')
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer();
