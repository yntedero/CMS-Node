import express from 'express';
import {authorize} from '../service/Security.js';
import * as Posts from "../service/Posts.js";
import * as Comments from "../service/Comments.js";

const router = express.Router();

// zobrazenie vsetkych prispevkov
router.get("/podujatia", async function (req, res) {
    try {
        let posts = req.session.user.roles[1] === 'admin' ? await Posts.findAllPosts() : await Posts.findUpcomingPosts();

        res.render('index/podujatia.twig', {
            posts: posts
        });
    } catch (e) {
        let posts = await Posts.findUpcomingPosts();

        res.render('index/podujatia.twig', {
            posts: posts
        });
    }

});

// zobrazenie vsetkych prispevkov
router.get("/admin", authorize('admin'), async function (req, res) {
    let posts = await Posts.findAllPosts();

    res.render('index/admin.twig', {
        posts: posts
    });
});

// zobrazenie vsetkych prispevkov
router.get("/orderbydate", async function (req, res) {
    let posts = await Posts.orderByDate();

    res.render('index/podujatia.twig', {
        posts: posts
    });
});

// zoradenie postov podla nazvu zostupne (A-Z)
router.get("/orderbyname", async function (req, res) {
    let posts = await Posts.orderByName();

    res.render('index/podujatia.twig', {
        posts: posts
    });
});



// zobrazenie vsetkych prispevkov podla regionu
router.get("/orderbyregion", async function (req, res) {
    let posts = await Posts.orderByRegion();

    res.render('index/podujatia.twig', {
        posts: posts
    });
});


// admin zoradenia zostupne (Z-A)
router.get("/orderbydateA", async function (req, res) {
    // vyhladam v DB vsetky prispevky
    let posts = await Posts.orderByDateA();

    res.render('index/admin.twig', {
        posts: posts
    });
});

router.get("/orderbynameA", async function (req, res) {
    let posts = await Posts.orderByNameA();

    res.render('index/admin.twig', {
        posts: posts
    });
});



// presmerovanie na stranku pre updatnutie prispevku
router.get("/updatered/:postId", async function (req, res) {
    let postinfo = await Posts.getPost(req.params.postId);
    let postId = req.params.postId
    res.render('index/update.twig', {
        post: postinfo,
        postId: postId
    });
    
});



// presmerovanie na oso stranku pre updatnutie prispevku
router.get("/pod_info/:postId", async function (req, res) {
    let postinfo = await Posts.getPost(req.params.postId);
    let comments = await Comments.findAllComments(req.params.postId);
    let postId = req.params.postId
    res.render('index/pod_info.twig', {
        post: postinfo,
        postId: postId,
        comments: comments
    });
    
});

// vymazanie prispevku a komentarov pod nim (admin)
router.get('/delete/:postId', authorize('admin'), async function(req, res) {
    await Comments.deleteCommentsOfPost(req.params.postId);
    await Posts.deletePost(req.params.postId);
    await req.flash('success', 'Príspevok bol vymazany.')

    res.redirect('/post/admin');
})

// presmerovanie na stranku pre updatnutie prispevku
router.post('/update/:postId', authorize('admin'), async function(req, res) {
    await Posts.updatePost(req.body.name, req.body.description, req.body.type, req.body.event_date, req.body.city, req.body.region, req.params.postId);
    await req.flash('success', 'Príspevok bol zmeneny.')

    res.redirect('/post/admin');
})

// presmerovanie na stranku pre pridanie prispevku (formular)
router.post("/new", authorize('admin'), async function (req, res) {
    await Posts.addPost(req.body.name, req.body.description, req.body.type, req.body.event_date, req.body.city, req.body.region);
    await req.flash('success', 'Príspevok bol pridaný.')

    res.redirect('/post/admin');
});

export {router as PostController}