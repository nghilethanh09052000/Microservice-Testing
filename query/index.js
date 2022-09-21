const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};
// posts = {
//     '123123':{
//         id:'123123',
//         title:'asdasd',
//         comments:[
//             {id:'cxvxcvxc',content:'zxczxhc'}
//         ]
//     }
// }

function handleEvent(type,data)
{
    switch (type) {
        case "PostCreated":
            {
                const { id, title } = data;
                posts[id] = { id, title, comments: [] };
            }
            break;
        case "CommentCreated":
            {
                const { id, content, postId, status } = data;
                const post = posts[postId];
                post.comments.push({ id, content, status });
            }
            break;
        case "CommentUpdated":
            {
                const { id, content, postId, status } = data;
                const post = posts[postId];
                const comment = post.comments.find((comment) => comment.id === id);
                comment.status = status;
                comment.content = content;
            }
            break;
        default:
            throw new Error("Nothing to do");
    }
}
app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    handleEvent(type,data)
    res.send({});
});

app.listen(4002, async () => {
    console.log("Listening on 4002");
    try {
        const res = await axios.get("http://event-bus-srv:4005/events");
        for (let event of res.data) {
            console.log("Processing event:", event.type);
            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log(error.message);
    }
});
