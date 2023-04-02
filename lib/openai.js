const {Configuration, OpenAIApi} = require("openai");
const tunnel = require('tunnel');
const axios = require('axios');
const {existsSync} = require("fs");
exports.openai = (opts = {}) => {
    const configuration = new Configuration({
        apiKey: opts.apiKey,
    });
    let defaultOpts = {
        timeout: 60000,
        maxContentLength: 20 * 1024 * 1024,
        maxBodyLength: 20 * 1024 * 1024,
        withCredentials: true,
    };
    if (existsSync('config/local.json')) {
        // 本地开发
        defaultOpts = {
            ...defaultOpts,
            httpsAgent: tunnel.httpsOverHttp({
                proxy: {
                    host: '127.0.0.1',
                    port: 7890,
                }
            })
        }
    }
    const client = axios.create(defaultOpts);
    const openai = new OpenAIApi(configuration, configuration.basePath, client);
    return async (ctx, next) => {
        ctx.openai = openai;
        await next();
    };
};