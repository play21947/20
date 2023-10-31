const express = require('express')
const app = express()
const cors = require('cors')
const line = require('@line/bot-sdk')
const dotenv = require('dotenv')
const { default: axios } = require('axios')

let env = dotenv.config().parsed

app.use(cors())
app.use(express.json())

let lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}


app.get("/", (req, res) => {
    res.json("testing")
})

// GroupId : Cc516ca8f6a6d03a40eab43449d5cf8bf

app.post("/webhook", (req, res) => {
    console.log(req.body.events)
    let reply_token = req.body.events[0].source.groupId
    console.log(reply_token)
    if (req.body.events[0].type === "message") {
        reply(reply_token, 'hi')
    }
    res.sendStatus(200)
})

app.post("/notify", async (req, res) => {
    let item_name = req.body.item_name
    let img_firebase = req.body.img_firebase
    let res_reply = await reply(item_name, img_firebase)
    res.json(res_reply)
})


const reply = (name, img) => {
    return new Promise((resolve, reject) => {
        axios.post("https://api.line.me/v2/bot/message/push", {
            to: 'Cc516ca8f6a6d03a40eab43449d5cf8bf',
            messages: [
                {
                    type: 'text',
                    text: name ? 'ได้เพิ่มสินค้า : ' + name : 'ว่าง'
                },
                {
                    type: 'image',
                    originalContentUrl: img ? img : 'https://oc1t.com/upload/source/y9DpT.jpg',
                    previewImageUrl: img ? img : 'https://oc1t.com/upload/source/y9DpT.jpg'
                }
            ]
        }, {
            headers: {
                'Authorization': "Bearer " + env.ACCESS_TOKEN
            }
        }).then((res) => {
            if (res.data) {
                resolve({ success: true })
            }
        })
    })
}


app.listen(3001, () => {
    console.log("Server is running on port 3001")
})