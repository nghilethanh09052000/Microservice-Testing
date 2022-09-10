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

app.get("/posts", (req, res) => {
    res.send(posts)
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    switch (type) 
    {
        case "PostCreated":
            {
                const { id, title } = data;
                posts[id] = { id, title, comments: [] };
            }
            break;
        case "CommentCreated":
            {
                const { id, content, postId } = data;
                const post = posts[postId];
                post.comments.push({ id, content });
            }
            break;

        default:
            throw new Error("Nothing to do");
    }
    console.log(post)
    res.send({});
});

app.listen(4002, () => {
    console.log("Listen on 4002");
});
