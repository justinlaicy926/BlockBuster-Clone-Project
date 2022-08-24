/**
 *Middware function to check if a user has admin status or not 
 *executes after authorization function, which sends a req.user object
 */



module.exports = function (req, res, next) {
    //if not admin, send code 403, forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}