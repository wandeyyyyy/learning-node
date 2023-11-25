function login(req, res, next) {
    console.log("Authenticating...");
    next();
};

module.exports = login;