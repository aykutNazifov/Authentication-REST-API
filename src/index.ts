import express from "express"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from 'cors'
import dotenv from "dotenv"
import mongoose from "mongoose"
import router from "./router"

dotenv.config()

const app = express()

app.use(cors())
app.use(compression())
app.use(cookieParser())
app.use(express.json())

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL as string)
mongoose.connection.on("error", (err: Error) => console.log("mongo er", err))


app.get("/get", (req, res) => res.status(200).json({ data: "Test" }))

app.use("/", router())
