import Router from 'koa-router';
import {sysCfg} from '../../config';

const router = Router({prefix: sysCfg.apiPrefix});

router.post('/completions', async (ctx) => {
    const params = {...ctx.request.body};
    ctx.log.debug(__filename, '[createChatCompletion] Request params:', params);
    try {
        const response = await ctx.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: params.content
            }],
        });
        if (response.status !== 200) {
            ctx.log.error(response.statusText)
            return ctx.send('QueryError', response.statusText);
        }
        let result = response.data.choices[0].message;
        ctx.send('Success', result);
    } catch (e) {
        ctx.log.error(e.stack);
        ctx.send('CallServiceError',e.stack);
    }
});

export default router;
