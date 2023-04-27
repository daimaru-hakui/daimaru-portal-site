import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth, updateEmail } from "firebase/auth";
type Data = {
  content: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email } = req.body;
  const auth = getAuth();
  const user = auth.currentUser;
  res.status(200).json({ content: auth });
  //   await updateEmail(user, email)
  //     .then(() => {
  //       res.status(200).json({ content: email });
  //       // Email updated!
  //       // ...
  //       // res.status(200).json({ content: "OK" });
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //       // An error occurred
  //       // ...
  //     });
}
