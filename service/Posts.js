import * as Db from "./MariaClient.js";

/**
 * Vlozit nove podujatie
 *
 * @param name
 * @param description
 * @param type
 * @param event_date
 * @param city
 * @param region
 * @returns {Promise<*>}
 */
async function addPost(name, description, type, event_date, city, region) {
    await Db.query(
        'INSERT INTO posts (name, description, type, event_date, city, region) VALUES (:name, :description, :type, :event_date, :city, :region)',
        {name: name, description: description, type: type, event_date: event_date, city: city, region: region}
    );
}

/**
 * Editnut podujatie
 * @param name
 * @param description
 * @param type
 * @param event_date
 * @param city
 * @param region
 * @param postId
 * @returns {Promise<*>}
 */

async function updatePost(name, description, type, event_date, city, region, postId) {
    await Db.query(
        'UPDATE posts SET name = :name, description = :description, type = :type, event_date = :event_date, city = :city, region = :region WHERE id = :postId',
        {name: name, description: description, type: type, event_date: event_date, city: city, region: region, postId: postId}
    );
}

/**
 * Vyhladat podujatie
 *
 * @param postId
 * @returns {Promise<*>}
 */

async function getPost(postId) {
    return Db.query(
        'SELECT * FROM posts WHERE id = :postId',
        {postId: postId}
    )
}

/**
 * Vymazat podujatie
 *
 * @param postId
 * @returns {Promise<*>}
 */
async function deletePost(postId) {
    await Db.query(
        'DELETE FROM posts WHERE id = :postId',
        {postId: postId}
    );
}

/**
 * Vratit zoznam podujati bez zoradenia.
 * @returns {Promise<*>}
 */
async function findAllPosts() {
    return Db.query('SELECT * FROM posts');
}

/**
 * Vratit zoznam nastavajucich prispevkov.
 * @returns {Promise<*>}
 */
async function findUpcomingPosts() {
    return Db.query('SELECT * FROM posts WHERE event_date > CURDATE()');
}

/**
 * Vratit zoznam prispevkov zoradeny podla casu vytvorenia zostupne.
 * @returns {Promise<*>}
 */
async function orderByDate() {
    return Db.query('SELECT * FROM posts WHERE event_date > CURDATE() ORDER BY event_date ASC');
}

/**
 * Vratit zoznam prispevkov zoradeny podla nazvu zostupne.
 * @returns {Promise<*>}
 */
async function orderByName() {
    return Db.query('SELECT * FROM posts WHERE event_date > CURDATE() ORDER BY name ASC');
}

/**
 * Vratit zoznam prispevkov zoradeny podla regionu zostupne.
 * @returns {Promise<*>}
 */
async function orderByRegion() {
    return Db.query('SELECT * FROM posts WHERE event_date > CURDATE() ORDER BY region ASC');
}

// admin zoradenia zostupne (Z-A)
async function orderByDateA() {
    return Db.query('SELECT * FROM posts ORDER BY event_date ASC');
}

async function orderByNameA() {
    return Db.query('SELECT * FROM posts ORDER BY name ASC');
}

export {addPost, findAllPosts, deletePost, getPost, updatePost, findUpcomingPosts, orderByDate, orderByRegion, orderByName, orderByDateA, orderByNameA}