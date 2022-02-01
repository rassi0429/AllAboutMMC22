const express = require("express")
const axios = require("axios")
const j2e = require("json2emap")
const app = express()

const recordUrl = "https://api.neos.com/api/records/search"
const body = { "private": false, "submittedTo": "G-Neos", "recordType": "world", "maxItems": 10, "count": 150, "requiredTags": ["mmc21"] }


app.get('/world/mmc21', async function (req, res) {
    const { data } = await axios.post(recordUrl, body)
    const parsed = data.map(res => { return { "worldRec": `neosrec:///${res.ownerId}/${res.id}`, "thumbnail": res.thumbnailUri, "firstPublishTime": res.firstPublishTime, tags: res.tags } })
    res.send(req.query.json ? parsed : j2e(parsed))
})


const server = app.listen(3000, function () {
    console.log("ok port:" + server.address().port)
});