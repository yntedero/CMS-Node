import mysql from 'mysql2';

// bude obsahovat pool pripojeni k databaze
let pool = null;

/**
 * Ziskat spojenie na databazu.
 *
 * @returns {Pool}
 */
function getDbConnection() {
    if (pool === null) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            namedPlaceholders: true
        });
    }
    // pouzitie promise verzie je potrebne aj pri transakciach
    return pool.promise();
}

/**
 * Vykonat SQL prikaz a vratit vysledok.
 *
 * Volanie vyuziva tzv. prepared statement, ktory umoznuje pouzivat zastupne symboly (znaky ? alebo pomenovane symboly).
 *
 * @param sql SQL prikaz (moznost pouzit pomenovane zastupne symboly - named placeholders)
 * @param params Parametre SQL prikazu (objekt, ktory definuje hodnoty pouzitych pomenovanych symbolov
 *               alebo pole v pripade ak pouzijeme otazniky ako zastupne symboly)
 * @returns {Promise<*>}
 */
async function query(sql, params) {
    let [rows, fields] = await getDbConnection().execute(sql, params);
    return rows;
}

export {query}