const config = require('config');

module.exports = class Core {

    static async run(req, res) {
        if (this.Actions.indexOf(req.params.action) == -1) return res.status(404).send('ERROR_INVALID_ACTION');
        let result, code = 200;
        if (typeof this[req.params.action] != 'undefined') {
            result = await this[req.params.action](req);
            if (!result.status) code = result.code ? result.code : 400;
            if (result.data != null && result.data.hasOwnProperty('attachment')) {
                res.header("Content-Type", "text/csv");
                res.attachment(result.data.attachment)
                return res.status(code).send(result.data.doc);
            }
            return res.status(code).send(result.data);
        }
        return res.status(400).send('ERROR_INVALID_ACTION');
    }

    static async auth(req) {
        let token = req.headers['x-auth-token'];
        if (!token) return { status: false, code: 401, data: 'MISSING_TOKEN' };
        const decoded = Utils.jwt.verify(token, 'access');
        if (decoded.errors) return { status: false, code: 401 ,data: 'INVALID_TOKEN' };
        if (decoded.user && decoded.user) {
            let res = {}
            let params = { _id: decoded.user, status: { "$nin": ['DEACTIVATED', 'DELETED'] } };
            try {
                let user = await Models.users.findOne(params, [], { });
                if (!user) return { status: false, code: 401, data: 'USER_NOT_FOUND' };
                res.user = user
                return { status: true, data: res };
            } catch (error) {
                console.log('core auth error' , error)
                return { status: false, code: 401, data: error };
            }
        }
        return { status: false, code: 401, data: "ACCESS_DENIED" };
    }

    static async get(modelName, params) {
        try {
            return await Models[modelName].findOne(...params);
        } catch (error) {
            return this.error(error);
        }
    }
    static async create(modelName, params) {
        try {
            const model = new Models[modelName](...params);
            const data = await model.save();
            return data;
        } catch (error) {
            console.log('error :', error)
            return this.error(error);
        }
    }

    static async search(modelName, params) {
        try {
            if (params.length == 0) params = [{}];
            if (params.length == 1) params.push(['-__v']);
            if (params.length == 2) params.push({});

            params[2]['limit'] = params[2]['limit'] ? parseInt(params[2]['limit'], 10) : 10;
            params[2]['page'] = params[2]['page'] ? parseInt(params[2]['page'], 10) : 1;
            params[2]['skip'] = (params[2]['page'] - 1) * params[2]['limit'];
            let limit = params[2]['limit'];

            if (params[2]['noLimit']) delete (params[2]['limit']);
            const result = await Models[modelName].find(...params);

            const total = await Models[modelName].countDocuments(params[0]);
            const pages = Math.floor(total / limit);

            return {
                results: result,
                paginate: {
                    total: total,
                    current_page: params[2]['page'],
                    last_page: (pages % limit) == 0 ? pages : pages + 1,
                },
            };
        } catch (error) {
            return this.error(error);
        }
    }

    static async update(modelName, params) {
        try {
            if (params.length == 2) {
                params.push({ new: true })
            }
            else if (params.length == 3) params[2].new = true;
            params[2]['runValidators'] = true;
            return await Models[modelName].findOneAndUpdate(...params);
        } catch (error) {
            console.log(error);
            return this.error(error);
        }
    }

    static async bulkUpdate(modelName, params) {
        try {
            if (!params.length) params = [{}, {}];
            else if (params.length == 1) params.push({ $set: {} });
            else if (params.length >= 2) params[1] = { $set: params[1] };
            return await Models[modelName].updateMany(...params);
        } catch (error) {
            return this.error(error);
        }
    }

    static async count(modelName, params) {
        try {
            const total = await Models[modelName].countDocuments(params[0]);
            return total;
        } catch (error) {
            return this.error(error);
        }
    }

    static async remove(modelName, params, type = 'normal') {
        try {
            let data = null;
            if (type == 'normal') data = await Models[modelName].findOneAndRemove(params[0]);
            else data = await Models[modelName].findOneAndUpdate(...params);
            return data;
        } catch (error) {
            console.log(error);
            return this.error(error);
        }
    }
    static async bulkRemove(modelName, params) {
        try {
            const data = await Models[modelName].deleteMany(params[0]);
            return data;
        } catch (error) {
            console.log(error);
            return this.error(error);
        }
    }

    static error(error) {
        if (error.errmsg) {
            if (error.code && error.code === 11000) {
                let field;
                if (!error.keyValue) {
                    field = (/(index: (\w+)(_\d+))/).exec(error.message)[2].toLowerCase();
                } else {
                    field = Object.keys(error.keyValue).join(',').toLowerCase();
                }
                error.errors = { [field]: 'errors_duplicate' };
            }
        } else if (error.errors) {
            const keys = Object.keys(error.errors);
            const myCustomError = {};
            keys.forEach((field) => {
                myCustomError[field] = `errors_${error.errors[field].kind || error.errors[field]}`;
            });
            error.errors = myCustomError;
        } else { error.errors = {}; }
        if (!error.status) error.status = 500;
        return error;
    }
}