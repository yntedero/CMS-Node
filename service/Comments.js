import * as Db from "./MariaClient.js";

/**
 * Vlozit novy komentar
 *
 * @param postId
 * @param username
 * @param message
 * @returns {Promise<*>}
 */

async function addComment(postId, username, message) {
    await Db.query(
        'INSERT INTO comments (post_id, username, message, created_at) VALUES (:post_id, :username, :message, now())',
        {post_id: postId, username: username, message: message}
    );
}

/**
 * Vymazat komentar
 *
 * @param commId
 * @returns {Promise<*>}
 */

async function deleteComment(commId) {
    await Db.query(
        'DELETE FROM comments WHERE id = :commId',
        {commId: commId}
    );
}

/**
 * Vymazat vsetky komentare daneho postu
 *
 * @param postId
 * @returns {Promise<*>}
 */
async function deleteCommentsOfPost(postId) {
    await Db.query(
        'DELETE FROM comments WHERE post_id = :postId',
        {postId: postId}
    );
}


// najst vsetky komentare daneho prispevku
async function findAllComments(postId) {
    return Db.query('SELECT * FROM comments WHERE post_id = :postId ORDER BY created_at ASC',
        {postId: postId}
    );
}

export {addComment, deleteComment, findAllComments, deleteCommentsOfPost}