import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { google } from "googleapis"

dotenv.config()

const port = process.env.PORT || 8080; // default port to listen
const app = express();
const key = process.env.KEY;

app.use(cors())
app.use(express.json())

const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.metadata.readonly'],
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const drive = google.drive({ version: "v3", auth })
const sheets = google.sheets({ version: 'v4', auth });

const getLastModifiedDate = async() => {
    const response = await drive.files.get({
        fileId: process.env.SHEET_ID,
        fields: "modifiedTime"
    })
    return response
}

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.post("/add", async(req, res) => {
    console.log(req)
    const paylaod = req.body;
    console.log(paylaod)
    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [paylaod.name, paylaod.email]
            ]
        }
    })
    res.send(response)
})

app.listen(port, () => {
    console.log(`server started at http://localhost:${ port }`);
});