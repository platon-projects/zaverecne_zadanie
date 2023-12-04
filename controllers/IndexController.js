import express from 'express';
import {authorize} from '../services/security.js'
const router = express.Router();
import * as Events from '../services/Events.js';
/**
 * Uvodna stranka
 */
router.get("/", async function (req, res) {
    const allEvents = await Events.allEvents();
    // console.log(allEvents);
    // let isAdmin = authorize(req.session.user.isAdmin)
    console.log(req.session.user);
    res.render('index.twig', {
        events: allEvents,
        isAdmin: req.session.user.isAdmin
    });
});

/**
 * Zobraznie formulara
 */
router.get("/form",  function (req, res, next) {
    res.render('form.twig');
});

/**
 * Spracovanie dat z odoslaneho formulara.
 */
router.post("/form", async function (req, res) {
    console.log(req.body);
    await req.flash('success', JSON.stringify(req.body));
    res.redirect('/form');
});

/**
 * Stranka s obmedzenym pristupom. Vyzaduje sa rola admin.
 */


export {router as IndexController}

