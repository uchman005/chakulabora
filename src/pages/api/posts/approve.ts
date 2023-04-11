import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../../models';
import { IPost, ResponseFunctions } from '../../../../interface';
const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    if (method === 'POST') {
        const _id = req.body._id;
        const { Post } = await dbCon();
        let post;
        try {
            post = await Post.findOne({ _id: _id });
            if (post !== null) {
                post.approved = true;
                await post.save();
            }
        } catch (err) {
            post = null;
        }
        res.status(200).json(post);
    }
    else { res.status(400).json({ error: `No Response for This ${req.method} Request` }); }
};
export default create;