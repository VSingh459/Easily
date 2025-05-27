export const requireLogin = (req, res, next) => {
    if (req.session.user) {
        next(); // User is logged in, proceed
    } else {
        res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
};