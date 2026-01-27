exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya bisa diakses oleh admin'});
    }
    next();
};