import { Td, Tr } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import React from "react";
import useSWR from "swr";
import { CuttingReport } from "../../../types";
import { useCuttingReport } from "../../hooks/useCuttingReport";

type Props = {
  product: any;
  report: CuttingReport;
};

const CuttingReportTr: NextPage<Props> = ({ product, report }) => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data } = useSWR(`/api/products/${product.productId}`, fetcher);
  const value = data?.content?.content;
  const { scaleCalc } = useCuttingReport();
  return (
    <Tr>
      <Td>{product?.category}</Td>
      <Td>{value?.productNumber}</Td>
      <Td>{value?.colorName}</Td>
      <Td>{value?.productName}</Td>
      <Td isNumeric>{product?.quantity}m</Td>
      <Td isNumeric>{scaleCalc(product?.quantity, report.totalQuantity)}m</Td>
    </Tr>
  );
};

export default CuttingReportTr;
