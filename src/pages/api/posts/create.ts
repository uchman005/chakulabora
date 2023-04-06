import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../../models';
import { ResponseFunctions } from '../../../../interface';
const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    const handle: ResponseFunctions = {
        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            const data = req.body;
            const blob: string = data.title.replaceAll(" ", "-").toLowerCase()
            const { Post } = await dbCon();
            let post;
            let message: string;
            try {

                post = new Post({
                    title: data.title,
                    body: data.body,
                    author: data.author,
                    category: data.category,
                    upvotes: [],
                    downvotes: [],
                    blob: blob,
                });
                await post.save();
                message = 'Post created successfully';
            } catch (err:any) {
                post = null;
                message= err.message;
            }
            res.status(200).json({ post, message });
        }

    }
    const response = handle[method];
    if (response) response(req, res);
    else res.status(400).json({ error: `No Response for This ${req.method} Request` });
};
export default create;