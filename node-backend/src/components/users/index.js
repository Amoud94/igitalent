
module.exports = class Users extends Core {
    static Actions = ["me", "search", "get", "login", "register", "refreshToken"];


    static async me(req) {
        const auth = await super.auth(req);
        if (!auth.status) return { status: false, code: 401, data: auth.data };
        if (['DEACTIVATED', 'DELETED'].includes(auth.data.user.status)) return { status: false, code: 401, data: 'error session invalid' };

        auth.data.user = Utils.fc.omit(auth.data.user, [
            "password"
        ]);

        return {
            status: true,
            data: { ...auth.data },
        };
    }

    static async get(req) {
        const auth = await super.auth(req);
        if (!auth.status) return { status: false, code: 400, data: 'error session invalid'  };
        if (!req.query.id || !Utils.fc.objectId.isValid(req.query.id)) return { status: false, data: 'error id invalid' };
        let  params = [{ _id: String(req.query.id) }, [], { populate: [{ path: "account", model: Models["accounts"] }] }]
        let user = await super.get("users", params);
        if (!user) {
            return { status: false, data: 'error user not found' };
        }
    }

    static async search(req) {
        const auth = await super.auth(req);
        if (!auth.status) return { status: false, code: 400, data: { session: 'errors_session_invalid' } };

        let params = [
            {  },
            ["-__v"],
            {
                sort: { createdAt: -1 },
            },
        ];
        req.query.limit ? params[2]['limit'] = req.query.limit : params[2]['noLimit'] = 1
        const users = await super.search("users", params);
        if (users.errors) return { status: false, data: users.errors };
        return { status: true, data: users };
    }


    static async register(req) {
        let user = Utils.fc.pick(req.body, ["firstname", "lastname", "email", "address", "phone", "password", "confirmedPassword"]);
        if (!user.email || !Utils.fc.isValidEmail(user.email.trim())) return { status: false, data: 'error invalid email' };
        let params = [
            {
                email: user.email.trim(),
            },
        ];
        const resultData = await super.get("users", params);
        if (resultData) return { status: false, data: 'error duplicated email' };

        if (!user.password || user.password.length < 5)
            return { status: false, data: 'error invalid password'};
        if (user.password !== user.confirmedPassword)
            return { status: false, data: 'error miss-matching passwords'};
        user.password = await Utils.hash.hash(user.password);
        delete user.confirmedPassword;
        const resp = await super.create("users", [user]);
        if (resp.errors) return { status: false, data: resp.errors };

        let accessToken = Utils.jwt.sign({ user: String(resp._id) }, "access");
        let refreshToken = Utils.jwt.sign({ user: String(resp._id) }, "refresh");
        return { data: { accessToken, refreshToken, user: resp }, status: true };
    }

    static async session(req) {
        const ip = (req.headers['x-forwarded-for'] || '105.67.129.211').split(',')[0].trim();
        const baseURL = `https://ipinfo.io/${ip}?token=b8e3e169ca5d93`;
        const { data = {} } = await Utils.invoke.invoke(baseURL, "get", {});

        return { status: true, data: { country: data.country, ip: data.ip } };
    }

    static async login(req) {
        if (!req.body.password || !req.body.email || !Utils.fc.isValidEmail(req.body.email.trim())) return { status: false, data: 'error invalid email or password'};
        let params
        let email = req.body.email.trim();
        if (Utils.fc.isValidEmail(email)) {
            params = [
                {
                    email: email,
                    status: { "$nin": ['BANNED', 'DEACTIVATED'] },
                },
            ];
        }

        let user = await super.get("users", params);
        if (!user) return { status: false, data: 'error user not found' };

        const validePassword = await Utils.hash.hachVerify(
            req.body.password,
            user.password
        );

        if (!validePassword) return { status: false, data: 'error password invalid'};

        let accessToken = Utils.jwt.sign({ user: String(user._id) }, "access");
        let refreshToken = Utils.jwt.sign({ user: String(user._id) }, "refresh");

        const ipDetail = await this.session(req);

        const setLastLoginDate = await super.update("users", [
            {
                _id: String(user._id)
            },
            {
                lastLoginDate: new Date(),
                $push:{
                    loginHistory : { 
                        time: new Date(),
                        details : ipDetail
                    }
                }
            }
        ])
        if (setLastLoginDate.error) return { status: false, data: setLastLoginDate.error };
        user = Utils.fc.omit(setLastLoginDate, [
            "password"
        ]);
        return { data: { accessToken, refreshToken, user }, status: true };
    }

    static async refreshToken(req) {
        let token = req.headers["x-auth-token"];
        if (!token) return { status: false, data: "ACCESS_DENIED" };
        if (!req.body.refreshToken) return { status: false, data: "INVALID_DATA" };
        const decodedAccessToken = Utils.jwt.verify(token, "access", {
            ignoreExpiration: true,
        });
        if (decodedAccessToken.errors || !decodedAccessToken.user) return { status: false, data: "INVALID_TOKEN" };
        const user = await super.get('users',[{ _id:String(decodedAccessToken.user) }]);
        if (!user || ['BANNED','DELETED'].includes(user.status)) return { status: false, data: "ACCESS_DENIED" };
        const decodedRefreshToken = Utils.jwt.verify(
            req.body.refreshToken,
            "refresh"
        );
        if (decodedRefreshToken.errors)
            return { status: false, data: "INVALID_TOKEN" };
        if (decodedAccessToken.user != decodedRefreshToken.user)
            return { status: false, data: "INVALID_TOKEN" };
        let accessToken = Utils.jwt.sign(
            { user: decodedAccessToken.user },
            "access"
        );
        return {
            status: true,
            data: { accessToken, refreshToken: req.body.refreshToken },
        };
    }
};
