import {} from 'fastify';
import { DATA } from '../../../db';
export default async function (app) {
    app.get('/', async (req, res) => {
        return {
            data: DATA.POSTS
        };
    });
    app.get('/:id', async (req, res) => {
        const paramId = +req.params.id;
        const findPost = DATA.POSTS.find((item) => {
            return item.id === paramId;
        });
        if (!findPost) {
            return res.status(404).send({
                status: `Not found post by id=${paramId}`
            });
        }
        return {
            data: findPost
        };
    });
}
//# sourceMappingURL=get.js.map