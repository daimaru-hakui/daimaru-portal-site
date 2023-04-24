import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CuttingReportType } from "../../../../types/CuttingReportType";
type Data = {
  contents: CuttingReportType[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = "https://daimaru-kijizaiko.vercel.app/api/cutting-reports/";
  const contents = await axios
    .get(url, {
      params: { API_KEY: "daimaru-kijizaiko" },
    })
    .then((res) => res.data);
  res.status(200).json({ contents: contents.contents });
}
