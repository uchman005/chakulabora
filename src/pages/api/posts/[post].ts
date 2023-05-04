import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../../models';
import { IPost, ResponseFunctions } from '../../../../interface';
export const config = {
    api: {
      bodyParser: {
        responseLimit: '10mb',
      },
    },
  };
const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const blob = req.query.post;
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    if (method === 'POST') {
        const { Post } = await dbCon();
        let post: IPost | null;
        try {
            post = await Post.findOne({ blob: blob });
        } catch (err) {
            post = null;
        }
        res.status(200).json(post);
    }
    else { res.status(400).json({ error: `No Response for This ${req.method} Request` }); }
};
export default create;