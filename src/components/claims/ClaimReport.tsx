/* eslint-disable @next/next/no-img-element */
import { Box, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from "../../../data";
import { ClaimAttached } from "./image/ClaimAttached";
import { Claim } from "../../../types";

type Props = {
  claim: Claim;
};

export const ClaimReport: FC<Props> = ({ claim }) => {
  return (
    <>
      {1 <= Number(claim.status) && (
        <Flex alignItems="center" justifyContent="space-between">
          <Flex gap={2} alignItems="center">
            <Box>受付NO</Box>
            <Box>{claim.receptionNum}</Box>
          </Flex>
          <Flex gap={2} alignItems="center">
            <Box>受付日</Box>
            <Box>{claim.receptionDate}</Box>
          </Flex>
        </Flex>
      )}
      <Box
        as="h1"
        p={3}
        mt={6}
        fontSize="3xl"
        fontWeight="semibold"
        textAlign="center"
      >
        クレーム報告書
      </Box>

      <Box mt={10} fontSize="lg" fontWeight="semibold">
        顧客名
      </Box>
      <Box px={2} mt={2}>
        <Box>{claim.customer}</Box>
      </Box>

      <Box mt={10} fontSize="lg" fontWeight="semibold">
        発生日
      </Box>
      <Box px={2} mt={2}>
        <Box>{claim.occurrenceDate}</Box>
      </Box>

      <Box as="h2" mt={10} fontSize="lg" fontWeight="semibold">
        発生内容
      </Box>
      <Box px={2} mt={2}>
        {claimSelectList1.map(({ id, headline, title }) => (
          <Box key={id}>
            {Number(id) === Number(claim.occurrenceSelect) &&
              `${claim.occurrenceSelect && "■"}${headline}  ${title}`}
          </Box>
        ))}
      </Box>
      <Box px={2} mt={2} whiteSpace="pre-wrap">
        {claim.occurrenceContent}
      </Box>

      <Flex as="h2" mt={10} fontSize="lg" fontWeight="semibold">
        修正処置
      </Flex>
      <Box px={2} mt={2}>
        {claimSelectList2.map(({ id, title }) => (
          <Box key={id}>
            {Number(id) === Number(claim.amendmentSelect) &&
              `${claim.amendmentSelect && "■"}${title}`}
          </Box>
        ))}
        <Box mt={2} whiteSpace="pre-wrap">
          {claim.amendmentContent}
        </Box>
      </Box>

      <Flex as="h2" mt={10} fontSize="lg" fontWeight="semibold">
        起因部署
      </Flex>
      <Box px={2} mt={2}>
        {claimSelectList4.map(({ id, title }) => (
          <Box key={id}>
            {Number(id) === Number(claim.causeDepartmentSelect) && title}
          </Box>
        ))}
      </Box>

      <Flex as="h2" mt={10} fontSize="lg" fontWeight="semibold">
        対策
      </Flex>
      <Box px={2} mt={2}>
        {claimSelectList3.map(({ id, title }) => (
          <Box key={id}>
            {Number(id) === Number(claim.counterplanSelect) &&
              `${claim.counterplanSelect && "■"}${title}`}
          </Box>
        ))}
        <Box mt={2} whiteSpace="pre-wrap">
          {claim.counterplanContent}
        </Box>
      </Box>

      {/* 添付書類 */}
      <Box mt={10}>
        <ClaimAttached imageUrl={claim.imageUrl1} />
        <ClaimAttached imageUrl={claim.imageUrl2} />
        <ClaimAttached imageUrl={claim.imageUrl3} />
      </Box>

      <Box mt={10} fontSize="lg" fontWeight="semibold">
        完了日
      </Box>
      <Box px={2} mt={2}>
        <Box>{claim.completionDate}</Box>
      </Box>
    </>
  );
};
