import express from 'express';

const router = express.Router();

// uvodna stranka (index)
router.get("/", function (req, res) {
    res.render('index/index.twig', {
        message: 'Vitajte na webe EventEcho !'
    });
});

// stranka podujati
router.get("/podujatia", function (req, res) {
    res.render('index/podujatia.twig', {
        message: 'Podujatia'
    });
});

export {router as IndexController}

