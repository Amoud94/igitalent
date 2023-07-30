const http = require('./http');
exports.invoke = async (endpoint,httpMethod = 'post', data, httpOptions) => {
    /* SOME_LOG */
    if (httpOptions) {
        if (!httpOptions.headers) httpOptions.headers = {};

        if (!httpOptions.headers.Accept) httpOptions.headers.Accept = 'application/json';

        if (!httpOptions.headers['Content-Type']) httpOptions.headers['Content-Type'] = 'application/json';
        if (!httpOptions.params) httpOptions.params = {};
    }

    let result;
    try {
        if (httpMethod === 'get' || httpMethod === 'delete') {
            result = await http[httpMethod](endpoint, httpOptions);
        } else {
            result = await http[httpMethod](endpoint, data, httpOptions);
        }
    } catch (error) {
        result = error.response ? error.response : { status: 500, data: error.message };
    }

    return result;
};
