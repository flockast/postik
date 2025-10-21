import {} from 'fastify';
import { DATA } from '../../../db';
export default async (app) => {
    app.post('/', async (req, res) => {
        const title = req.body.title;
        const newPost = {
            id: DATA.POSTS.length + 1,
            title
        };
        DATA.POSTS = [
            ...DATA.POSTS,
            newPost
        ];
        return {
            data: newPost
        };
    });
};
//# sourceMappingURL=post.js.map