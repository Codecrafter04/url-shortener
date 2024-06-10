import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import Urls from './model/url.js'
import {customAlphabet} from 'nanoid'
import { url } from 'inspector';

const port = process.env.PORT || 3000
const app = express()

mongoose.connect('mongodb://localhost:27017/project')
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 4)

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',async (req,res) =>{
    const urldata = await Urls.find({})
    res.render("index",{shortid: null,urlData: urldata,header: `http://${req.headers.host}/`})
})

app.post('/shortenUrl', async (req,res) => {
    const longurl = req.body.longurl
    const shorturl = nanoid()

    const alreadyExist = await Urls.findOne({longUrl : longurl})  
    const urldata = await Urls.find({})

    if(alreadyExist){

        const shortid = `http://${req.headers.host}/${alreadyExist.shortUrl}`
        res.render("index",{shortid : shortid, urlData : urldata,header: `http://${req.headers.host}/`})
     
    }
    else{
        const data = new Urls({
        longUrl : longurl,
        shortUrl : shorturl
        })

        await data.save()
        const urldata = await Urls.find({})
        const shortid = `http://${req.headers.host}/${shorturl}`
        res.render("index",{shortid : shortid, urlData: urldata , header:`http://${req.headers.host}/` })
    }
}) 

app.get('/:shortUrl',async (req,res) =>{
    const togoonUrl = await Urls.findOneAndUpdate(req.params,
        {$inc: {clicks : 1}}
    )
    if(togoonUrl){
        res.redirect(togoonUrl.longUrl)
    }
    else{
        res.status(404).send("NOT FOUND")
    }
})

app.listen(port,()=>{
    console.log(`Server is Listening on port ${port}`)
})