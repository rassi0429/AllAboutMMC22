const express = require("express")
const axios = require("axios")
const j2e = require("json2emap")
const _ = require('lodash');
const app = express()

const recordUrl = "https://api.neos.com/api/records/search"
function body(tags) {
    return { "private": false, "submittedTo": "G-Neos", "recordType": "world", "maxItems": 10, "count": 150, "requiredTags": tags }
}


app.get('/world/mmc21', async function (req, res) {
    const { data } = await axios.post(recordUrl, body(["mmc21"]))
    const parsed = data.map(res => formatWorld(res))
    res.send(req.query.json ? parsed : j2e(parsed))
})

app.get('/world/mmc22', async function (req, res) {
    const { data } = await axios.post(recordUrl, body(["mmc22"]))
    const parsed = data.map(res => formatWorld(res))
    res.send(req.query.json ? parsed : j2e(parsed))
})

app.get('/world/mmc20', async function (req, res) {
    const { data } = await axios.post(recordUrl, {"private": false,"submittedTo": "G-Neos","recordType": "world","maxItems": 10,"count": 150,"requiredTags": ["mmc"],"maxDate":"2020-10-03T00:00:00Z"})
    const parsed = data.map(res => formatWorld(res))
    res.send(req.query.json ? parsed : j2e(parsed))
})

app.get("/a/mmc21", async (req, res) => {
    const { data } = await axios.port(recordUrl, body(["mmc21"]))

})

const server = app.listen(3000, function () {
    console.log("ok port:" + server.address().port)
});

(async () => {
    const span = 7
    const { data } = await axios.post(recordUrl, body(["mmc21"]))
    const sorted = _.sortBy(data, "firstPublishTime")
    let result = []
    console.log(sorted.map(res => formatWorld(res).firstPublishTime))
    for (let i = 31 - span; i > 0; i -= span) {
        const endDate = new Date(Date.UTC(2021, 8, i + span, 18, 0, 0))
        const startDate = new Date(Date.UTC(2021, 8, i, 18, 0, 0))
        console.log(startDate, endDate)
        let template = {
            world_social: [],
            world_game: [],
            world_misc: [],
            avatar_avatars: [],
            avatar_accessories: [],
            avatar_misc: [],
            other_tau: [],
            other_misc: [],
            meme: []
        }
        sorted.forEach(k => {
            const firstPublishTime = new Date(k.firstPublishTime)
            if (startDate < firstPublishTime && endDate > firstPublishTime) {
                if (k.tags.includes("world")) {
                    if (k.tags.includes("social")) {
                        template.world_social.push(k)
                    } else if (k.tags.includes("game")) {
                        template.world_game.push(k)
                    } else if (k.tags.includes("misc")) {
                        template.world_misc.push(k)
                    }
                } else if (k.tags.includes("avatar")) {
                    if (k.tags.includes("avatars")) {
                        template.avatar_avatars.push(k)
                    } else if (k.tags.includes("accessories")) {
                        template.avatar_accessories.push(k)
                    } else if (k.tags.includes("misc")) {
                        template.avatar_misc.push(k)
                    }
                } else if (k.tags.includes("other")) {
                    if (k.tags.includes("tau")) {
                        template.other_tau.push(k)
                    } else if (k.tags.includes("misc")) {
                        template.other_misc.push(k)
                    }
                } else if (k.tags.includes("meme")) {
                    template.meme.push(k)
                }
            }
        })
        result.push(template)
    }
    console.log(result)
})()

function formatWorld(res) {
    return {
        "worldRec": `neosrec:///${res.ownerId}/${res.id}`,
        "thumbnail": res.thumbnailUri,
        "firstPublishTime": res.firstPublishTime,
        "tags": res.tags,
        "ownerId": res.ownerId,
        "visits": res.visits,
        "name": res.name,
        "description": res.description
    }
}