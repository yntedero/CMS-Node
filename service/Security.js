import * as Db from './MariaClient.js';
import sha256 from 'crypto-js/sha256.js';
import hex from 'crypto-js/enc-hex.js';

/** Middleware pre overovanie pristupu na zaklade rol pouzivatela
 *
 * @param permittedRoles Zoznam rol, ktore maju pristup ku konkretnej akcii (route)
 * @returns {(function(*, *, *): void)|*}
 */
function authorize(...permittedRoles) {
    // funkcia vrati middleware, ktory sa pouzije pri spracovani requestu
    return (req, res, next) => {
        const user = req.session.user;

        if (user) {
            // ak pouzivatel existuje, tak overim jeho rolu
            let accessGranted = permittedRoles.some((permittedRole) => {
                return user.roles.includes(permittedRole);
            });

            // ak je pristup povoleny, tak pokracujem v spracovani requestu
            if (accessGranted) {
                next();
            } else {
                req.flash('error', 'Pokus o neoprávnený prístup!');
                res.redirect('/');
            }
        } else {
            req.flash('error', 'Prístup len pre prihlásených používateľov!');
            res.redirect('/');
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
async function authenticate(username, password) {
    let dbUsers = await Db.query('SELECT * FROM users WHERE username = :user', {
        user: username
    });

    // v DB by mali byt pouzivatelske mena unikatne, takze vysledkom dotazu moze byt bud 0 alebo 1 pouzivatel
    if (dbUsers.length !== 1) {
        console.log(`Pouzivatel ${dbUser.username} sa nenasiel.`);
        return null;
    }

    // vyberiem prveho pouzivatela z vysledkov dotazu
    let dbUser = dbUsers.pop();
    // (zadane heslo sa nezhoduje s heslom v DB) a vratim null
    if (dbUser.password !== hashPassword(password)) {
        console.log(dbUser.password ,hashPassword(password) );
        return null;
    }
    // toto pole priradim do objektu pouzivatela, ktory vratim
    dbUser.roles = dbUser.roles.split(',');

    return dbUser;
}

export {authorize, authenticate, hashPassword, setUserPassword};