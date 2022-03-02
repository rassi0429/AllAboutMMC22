const express = require("express")
const axios = require("axios")
const j2e = require("json2emap")
const _ = require('lodash');
const app = express()

const recordUrl = "https://api.neos.com/api/records/search"
function body(tags) {
    return { "private": false, "submittedTo": "G-Neos", "recordType": "world", "maxItems": 10, "count": 197, "requiredTags": tags }
}


app.get('/world/mmc21', async function (req, res) {
    const { data } = await axios.post(recordUrl, body(["mmc21"]))
    const parsed = data.map(res => addGenre22(formatWorld(res)))
    res.send(req.query.json ? parsed : j2e(parsed))
})

app.get('/world/mmc22', async function (req, res) {
    const { data } = await axios.post(recordUrl, body(["mmc22"]))
    const parsed = data.map(res => addGenre22(formatWorld(res)))
    res.send(req.query.json ? parsed : j2e(parsed))
})

app.get('/world/mmc20', async function (req, res) {
    const { data } = await axios.post(recordUrl, { "private": false, "submittedTo": "G-Neos", "recordType": "world", "maxItems": 10, "count": 197, "requiredTags": ["mmc"], "maxDate": "2020-10-03T00:00:00Z" })
    const parsed = data.map(res => addGenre20(formatWorld(res)))
    res.send(req.query.json ? parsed : j2e(parsed))
})

app.get("/a/mmc22", async (req, res) => {
    const span = Number(req.query.span) || 7
    const { data } = await axios.post(recordUrl, body(["mmc22"]))
    let sorted = _.sortBy(data, "firstPublishTime")
    sorted = sorted.map(i => formatWorld(i))
    let result = []
    // console.log(sorted.map(res => formatWorld(res).firstPublishTime))
    let startDate = null
    for (let i = 29 - span; i > 0; i -= span) {
        const endDate = new Date(Date.UTC(2022, 1, i + span, 19, 0, 0))
        startDate = new Date(Date.UTC(2022, 1, i, 19, 0, 0))
        // console.log(startDate, endDate)
        result.push(getEvent22(startDate, endDate, sorted))
    }
    if (startDate.getTime() != new Date(Date.UTC(2022, 1, 1, 19, 0, 0)).getTime()) {
        result.push(getEvent22(new Date(Date.UTC(2022, 1, 1, 19, 0, 0)), startDate, sorted))
    }
    // console.log(result.reverse())
    res.send(req.query.json ? result.reverse() : j2e(result.reverse()))
})


app.get("/a/mmc21", async (req, res) => {
    const span = Number(req.query.span) || 7
    const { data } = await axios.post(recordUrl, body(["mmc21"]))
    let sorted = _.sortBy(data, "firstPublishTime")
    sorted = sorted.map(i => formatWorld(i))
    let result = []
    // console.log(sorted.map(res => formatWorld(res).firstPublishTime))
    let startDate = null
    for (let i = 31 - span; i > 0; i -= span) {
        const endDate = new Date(Date.UTC(2021, 8, i + span, 19, 0, 0))
        startDate = new Date(Date.UTC(2021, 8, i, 19, 0, 0))
        // console.log(startDate, endDate)
        result.push(getEvent21(startDate, endDate, sorted))
    }
    if (startDate.getTime() != new Date(Date.UTC(2021, 8, 1, 19, 0, 0)).getTime()) {
        result.push(getEvent21(new Date(Date.UTC(2021, 8, 1, 19, 0, 0)), startDate, sorted))
    }
    // console.log(result.reverse())
    res.send(req.query.json ? result.reverse() : j2e(result.reverse()))
})


app.get("/a/mmc20", async (req, res) => {
    const span = Number(req.query.span) || 7
    const { data } = await axios.post(recordUrl, { "private": false, "submittedTo": "G-Neos", "recordType": "world", "maxItems": 10, "count": 197, "requiredTags": ["mmc"], "maxDate": "2020-10-03T00:00:00Z" })
    let sorted = _.sortBy(data, "firstPublishTime")
    sorted = sorted.map(i => formatWorld(i))
    let result = []
    console.log(sorted.map(res => formatWorld(res).firstPublishTime))
    let startDate = null
    for (let i = 31 - span; i > 0; i -= span) {
        const endDate = new Date(Date.UTC(2020, 8, i + span, 19, 0, 0))
        startDate = new Date(Date.UTC(2020, 8, i, 19, 0, 0))
        console.log(startDate, endDate)
        result.push(getEvent20(startDate, endDate, sorted))
    }
    if (startDate.getTime() != new Date(Date.UTC(2020, 8, 1, 19, 0, 0)).getTime()) {
        result.push(getEvent20(new Date(Date.UTC(2020, 8, 1, 19, 0, 0)), startDate, sorted))
    }
    // console.log(result.reverse())
    res.send(req.query.json ? result.reverse() : j2e(result.reverse()))
})


const server = app.listen(3000, function () {
    console.log("ok port:" + server.address().port)
});

function formatWorld(res) {
    return {
        "worldRec": `neosrec:///${res.ownerId}/${res.id}`,
        "thumbnail": res.thumbnailUri,
        "firstPublishTime": res.firstPublishTime,
        "tags": res.tags,
        "ownerId": res.ownerId,
        "ownerName": res.ownerName,
        "visits": res.visits,
        "name": res.name,
        "description": res.description
    }
}

function addGenre22(k) {
    if (k.tags.includes("world") || k.tags.includes("World")) {
        if (k.tags.includes("social") || k.tags.includes("Social")) {
            k.genre = "world_social"
        } else if (k.tags.includes("game") || k.tags.includes("Game")) {
            k.genre = "world_game"
        } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
            k.genre = "world_misc"
        }
    } else if (k.tags.includes("avatar") || k.tags.includes("Avatar")) {
        if (k.tags.includes("avatars") || k.tags.includes("Avatars")) {
            k.genre = "avatar_avatars"
        } else if (k.tags.includes("accessories") || k.tags.includes("Accessories")) {
            k.genre = "avatar_accessories"
        } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
            k.genre = "avatar_misc"
        }
    } else if (k.tags.includes("other") || k.tags.includes("Other")) {
        if (k.tags.includes("tau") || k.tags.includes("TAU")) {
            k.genre = "other_tau"
        } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
            k.genre = "other_misc"
        }
    } else if (k.tags.includes("meme") || k.tags.includes("Meme")) {
        k.genre = "meme"
    } else if (k.tags.includes("art") || k.tags.includes("Art")) {
        k.genre = "art"
    } else if (k.tags.includes("esd") || k.tags.includes("Esd") || k.tags.includes("ESD")) {
        k.genre = "esd"
    }
    return k
}

function addGenre20(k) {
    if (k.tags.includes("world") || k.tags.includes("World")) {
        k.genre = "world"
    } else if (k.tags.includes("avatar") || k.tags.includes("Avatar")) {
        k.genre = "avatar"
    } else if (k.tags.includes("other") || k.tags.includes("Other")) {
        k.genre = "other"
    }
    return k
}

function getEvent22(startDate, endDate, sorted) {
    let template = {
        world_social: [],
        world_game: [],
        world_misc: [],
        avatar_avatars: [],
        avatar_accessories: [],
        avatar_misc: [],
        other_tau: [],
        other_misc: [],
        meme: [],
        art: [],
        esd: [],
    }
    sorted.forEach(k => {
        // console.log(k.tags)
        const firstPublishTime = new Date(k.firstPublishTime)
        if (startDate < firstPublishTime && endDate > firstPublishTime) {
            if (k.tags.includes("world") || k.tags.includes("World")) {
                if (k.tags.includes("social") || k.tags.includes("Social")) {
                    template.world_social.push(k)
                } else if (k.tags.includes("game") || k.tags.includes("Game")) {
                    template.world_game.push(k)
                } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
                    template.world_misc.push(k)
                }
            } else if (k.tags.includes("avatar") || k.tags.includes("Avatar")) {
                if (k.tags.includes("avatars") || k.tags.includes("Avatars")) {
                    template.avatar_avatars.push(k)
                } else if (k.tags.includes("accessories") || k.tags.includes("Accessories")) {
                    template.avatar_accessories.push(k)
                } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
                    template.avatar_misc.push(k)
                }
            } else if (k.tags.includes("other") || k.tags.includes("Other")) {
                if (k.tags.includes("tau") || k.tags.includes("TAU")) {
                    template.other_tau.push(k)
                } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
                    template.other_misc.push(k)
                }
            } else if (k.tags.includes("meme") || k.tags.includes("Meme")) {
                template.meme.push(k)
            } else if (k.tags.includes("art") || k.tags.includes("Art")) {
                template.art.push(k)
            } else if (k.tags.includes("esd") || k.tags.includes("Esd") || k.tags.includes("ESD")) {

                template.esd.push(k)
            }
        }
    })
    return template
}

function getEvent21(startDate, endDate, sorted) {
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
            if (k.tags.includes("world") || k.tags.includes("World")) {
                if (k.tags.includes("social") || k.tags.includes("Social")) {
                    template.world_social.push(k)
                } else if (k.tags.includes("game") || k.tags.includes("Game")) {
                    template.world_game.push(k)
                } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
                    template.world_misc.push(k)
                }
            } else if (k.tags.includes("avatar") || k.tags.includes("Avatar")) {
                if (k.tags.includes("avatars") || k.tags.includes("Avatars")) {
                    template.avatar_avatars.push(k)
                } else if (k.tags.includes("accessories") || k.tags.includes("Accessories")) {
                    template.avatar_accessories.push(k)
                } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
                    template.avatar_misc.push(k)
                }
            } else if (k.tags.includes("other") || k.tags.includes("Other")) {
                if (k.tags.includes("tau") || k.tags.includes("TAU")) {
                    template.other_tau.push(k)
                } else if (k.tags.includes("misc") || k.tags.includes("Misc")) {
                    template.other_misc.push(k)
                }
            } else if (k.tags.includes("meme") || k.tags.includes("Meme")) {
                template.meme.push(k)
            }
        }
    })
    return template
}

function getEvent20(startDate, endDate, sorted) {
    let template = {
        world: [],
        avatar: [],
        other: []
    }
    sorted.forEach(k => {
        const firstPublishTime = new Date(k.firstPublishTime)
        if (startDate < firstPublishTime && endDate > firstPublishTime) {
            if (k.tags.includes("world") || k.tags.includes("World")) {
                template.world.push(k)
            } else if (k.tags.includes("avatar") || k.tags.includes("Avatar")) {
                template.avatar.push(k)
            } else if (k.tags.includes("other") || k.tags.includes("Other")) {
                template.other.push(k)
            }
        }
    })
    return template
}