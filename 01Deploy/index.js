import express from "express";
import { configDotenv } from "dotenv";
const app = express();

const port = 4000

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/twitter', (req, res)=>{
    res.send('twitter id')
})

app.get('/login',(req,res)=>{
    res.send('<h1>please login</h1>')
})

app.listen(process.env.PORT, () => {
    console.log(`server running at ${port}`)
})