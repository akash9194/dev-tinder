const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isUserAuthenticated = token === 'xyz';
    if (!isUserAuthenticated) {
        res.status(401).send('error')
        // res.send('2nd resp');

    } else {
        next();
    }
}
module.exports = {
    adminAuth
}