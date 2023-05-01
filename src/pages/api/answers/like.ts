import { NextApiRequest, NextApiResponse } from 'next';
import {like_answer} from '../../../../lib/answers';
import { ResponseFunctions } from '../../../../interface';
const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    if (method === 'POST') {
        const { like, answer_id, author_id, user_id } = req.body;
        const liked = await like_answer(like, answer_id, author_id, user_id);
        res.status(200).json(liked);
    }
    else { res.status(400).json({ error: `No Response for This ${req.method} Request` }); }
};
export default create;