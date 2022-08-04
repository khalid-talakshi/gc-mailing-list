import express from "express";
import dotenv from "dotenv";

const port = process.env.PORT || 8080; // default port to listen
const app = express();

app.listen(port, () => {
    console.log(`server started at http://localhost:${ port }`);
});