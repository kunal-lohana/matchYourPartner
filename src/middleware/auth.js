const adminAuth = (req, res, next) => {
    const token = 'XYZ1';
    const isAdminAuthorized = token === 'XYZ';
    if(!isAdminAuthorized) {
        res.status(401).send('Authorized Admin!');
    } else {
        next();
    }
};

const userAuth = (req, res, next) => {
    const token = 'XYZ';
    const isAdminAuthorized = token === 'XYZ';
    if(!isAdminAuthorized) {
        res.status(401).send('Authorized User!');
    } else {
        next("Token expired");
    }
}

module.exports = { 
    adminAuth,
    userAuth
}