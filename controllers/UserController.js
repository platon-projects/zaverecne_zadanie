import express from 'express';
import {authenticate} from "../services/security.js";


const router = express.Router();


router.get('/login', function (req, res) {
    res.render('form.twig');
});

/**
 * Kontrola prihlasovacich udajov odoslanych z formulara metodou POST.
 */
router.post('/check',  function (req, res) {
    // data z formulara su ulozene v tele (body) POST poziadavky.
    console.log(req.body.username, req.body.password, req.url);
    authenticate(req.body.username, req.body.password).then(async (user) => {
        if (user) {
            req.session.user = user;
            console.log('Login OK', user);
            // await req.flash('success', 'Login OK');
            // kedze pouzivam pomalsie ulozisko pre session data (subory) pockam na ulozenie sesison a az potom presmerujem
            req.session.save(() => {
                res.redirect('/');
            });
        } else {
            console.log('Login failed');
            // await req.flash('error', 'Chybné meno alebo heslo!');
            res.redirect('/user/login');
        }
    });
});

/**
 * Odhlasit prihlaseneho pouzivatela a zrusit session
 */
router.get('/logout', function (req, res) {
    let sessionName = req.session.name;
    req.session.destroy(async function(err) {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie(sessionName);
            res.redirect('/');
        }
    });
});

export {router as UserController}