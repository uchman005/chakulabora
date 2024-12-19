import ImageKit from "imagekit";

import { NextApiRequest, NextApiResponse } from "next";
import { ResponseFunctions } from "../../../../interface";
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
  privateKey: process.env.PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
});

async function getImageAuth() {
  return imagekit.getAuthenticationParameters();
}
const image = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "GET") {
    const data = await getImageAuth();
    return res.status(200).json(data);
  } else {
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
  }
};
export default image;
