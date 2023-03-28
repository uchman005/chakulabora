import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../models';
import { ResponseFunctions } from '../../../interface';
const deleteRecord = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    const handle: ResponseFunctions = {
        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            const { User } = await dbCon();
            const _id = req.query.user;

            const deleted = await User.deleteOne({ _id: _id });

            console.log("deleted");

            res.status(200).json(deleted);
        }

    }
    const response = handle[method];
    if (response) response(req, res);
    else res.status(400).json({ error: "No Response for This Request" });
};
export default deleteRecord;