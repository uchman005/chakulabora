import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../../models'; 
import { ResponseFunctions } from '../../../../interface';
const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    const handle: ResponseFunctions = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            const { User } = await dbCon();
            let user;
            try {
                user = await User.findOne({
                    email: req.query.user
                });
            } catch (err: any) {
                return res.status(400).json({ error: "Did not find user because: " + err.message })
            }
            return res.status(200).json(user);
        }
    }
    const response = handle[method];
    if (response) response(req, res);
    else return res.status(400).json({ error: "No Response for This Request" });
};
export default create;