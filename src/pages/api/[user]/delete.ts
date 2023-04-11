import { NextApiRequest, NextApiResponse } from 'next';
import { dbCon } from '../../../../models';
import { ResponseFunctions } from '../../../../interface';
const deleteRecord = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
    if (method === 'POST') {
        const { User } = await dbCon();
        const _id = req.query.user;
        const deleted = await User.deleteOne({ _id: _id });
        res.status(200).json(deleted);
    } else res.status(400).json({ error: "No Response for This Request" });
};
export default deleteRecord;