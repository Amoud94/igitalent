const config = require('config');

module.exports = async function (req, res, next) {
    let token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send("MISSING_TOKEN");
     else {
        const decoded = Utils.jwt.verify(token, 'access');
        if (decoded.errors) return res.status(401).send('INVALID_TOKEN');
        if (decoded.user && decoded.user) {
            let params = { _id: decoded.user, status: { "$nin": ['BANNED', 'DELETED'] } };
            try {
                let user = await Models.users.findOne(params, [], { populate: [{ path: "account", model: Models["accounts"] }] });
                if (!user) return res.status(401).send("USER_NOT_FOUND");
                user = Utils.fc.omit(user, "password")
                res.user = user
                req.session = res;
                return next();
            } catch (error) {
                console.log('middleware auth error' , error)
                return res.status(401).send(error);
            }
        }
        return res.status(401).send("ACCESS_DENIED");
    }
}