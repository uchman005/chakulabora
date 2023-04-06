import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../../models';
import { ResponseFunctions } from '../../../../interface';
const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    if(method === 'POST'){
        const { Post } = await dbCon();
        let posts = await Post.find({approved: true});

        res.status(200).json( posts );
    }
    // const handle: ResponseFunctions = {
    //     POST: async (req: NextApiRequest, res: NextApiResponse) => {
            
    //     }
    // }
    // const response = handle[method];
    // if (response) response(req, res)
    else {res.status(400).json({ error: `No Response for This ${req.method} Request` });}
};
export default create;