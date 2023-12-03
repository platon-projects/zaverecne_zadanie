import * as Db from './dbclient.js';
import sha256 from 'crypto-js/sha256.js';
import hex from 'crypto-js/enc-hex.js';

/** Middleware pre overovanie pristupu na zaklade rol pouzivatela
 *
 * @param permittedRoles Zoznam rol, ktore maju pristup ku konkretnej akcii (route)
 * @returns {(function(*, *, *): void)|*}
 */
function authorize(...permittedRoles) {
    return (req, res, next) => {
        const user = req.session.user;

        if (user) {
            // Prejdem vsetky roly, ktore maju povoleny pristup a zistujem, ci ich ma pouzivatel pridelene
            // ak ma pridelenu aspon jednu rolu, tak je pristup povoleny
            let accessGranted = permittedRoles.some((permittedRole) => {
                return user.roles.includes(permittedRole);
            });

            if (accessGranted) {
                // pouzivatel ma pozadovanu rolu, spracovanie poziadavky moze teda pokracovat
                next();
            } else {
                let rolesString = permittedRoles.join(', ');
                req.flash('error', `Pre prístup je vyžadovaná rola ${rolesString}!`);
                res.redirect('/'); // navrat na uvodnu stranku
            }
        } else {
            let rolesString = permittedRoles.join(', ');
            req.flash('error', 'Prístup len pre prihlásených používateľov!');
            res.redirect('/'); // navrat na uvodnu stranku
        }
    }
}

/**
 * Vypocitat hash zadaneho hesla.
 *
 * Pri hashovani sa pouziva aj SALT definovany v konfiguracii.
 *
 * @param password
 */
function hashPassword(password) {
    // pripojit pred heslo retazec SALT, vypocitat hash algoritmom sha256 a skonvertovat ho na hex retazec.
    return sha256(process.env.PWD_SALT + password).toString(hex);
}

/**
 * Nastavit nove heslo pre pouzivatela.
 *
 * @param username
 * @param password
 * @returns {Promise<void>}
 */
async function setUserPassword(username, password) {
    await Db.query('UPDATE users SET password = :pwd WHERE username = :username', {
        pwd: hashPassword(password),
        username: username
    });
}

/**
 * Overenie prihlasovacich udajov pouzivatela a nacitanie dalsich detailov z DB.
 * @param username
 * @param password
 * @returns {Promise<User>}
 */
async function authenticate(username, password){
    let dbUsers = await Db.query('SELECT * FROM users WHERE user = :user', {
        user: username
    });


    if (dbUsers.length !== 1) {
        console.log(`Pouzivatel ${dbUser.username} sa nenasiel.`);
        return null;
    }

    let dbUser = dbUsers.pop();
    if (dbUser.password !== hashPassword(password)) {
        console.log(dbUser.password ,hashPassword(password) );
        return null;
    }


    return dbUser;
}

export {authorize, authenticate, hashPassword, setUserPassword};