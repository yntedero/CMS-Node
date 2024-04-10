import express from 'express';
import {authorize} from '../service/Security.js';
import * as Comments from "../service/Comments.js";

const router = express.Router();

// pridat komentar k prispevku
router.post("/add/:postId", async function (req, res) {
    // pockat na dokoncenie funkcie pre pridanie komentaru
    console.log(req.body)
    console.log(req.body.message + " " + req.body.username);
    await Comments.addComment(req.params.postId, req.body.username, req.body.message);
    await req.flash('success', 'Príspevok bol pridaný.');

    let postId = req.params.postId;
    res.redirect('/post/pod_info/' + postId);
});

// vymazat komentar k prispevku
router.get('/delete/:id/:postId', authorize('admin'), async function(req, res) {
    // pockat na dokoncenie funkcie pre vymazanie komentaru
    await Comments.deleteComment(req.params.id);
    await req.flash('success', 'Príspevok bol vymazany.')

    let postId = req.params.postId;
    res.redirect('/post/pod_info/' + postId);
})

export {router as CommentController}