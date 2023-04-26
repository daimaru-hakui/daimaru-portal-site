/* eslint-disable @next/next/no-img-element */
import { Box, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from "../../../data";
import ClaimAttached from "./ClaimAttached";
import { Claim } from "../../../types";

type Props = {
  claim: Claim;
};

const ClaimReport: FC<Props> = ({ claim }) => {
  return (
    <>
      {Number(claim.status) >= 1 && (
        <Flex alignItems="center" justifyContent="space-between">
          <Flex mr={1} alignItems="center">
            <Box fontSize="lg" fontWeight="semibold" mr={1}>
              受付NO
            </Box>
            <Box>{claim.receptionNum}</Box>
          </Flex>
          <Flex alignItems="center">
            <Box fontSize="lg" fontWeight="semibold" mr={1}>
              受付日
            </Box>
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
      <Box>
        <Box mt={10} fontSize="lg" fontWeight="semibold">
          顧客名
        </Box>
        <Box px={2} mt={2}>
          <Box>{claim.customer}</Box>
        </Box>
      </Box>
      <Box>
        <Box mt={9} fontSize="lg" fontWeight="semibold">
          発生日
        </Box>
        <Box px={2} mt={2}>
          <Box>{claim.occurrenceDate}</Box>
        </Box>
      </Box>

      <Box mt={10}>
        <Box as="h2" fontSize="lg" fontWeight="semibold">
          発生内容
        </Box>
        <Box px={2} mt={2}>
          {claimSelectList1.map((value) => (
            <Box key={value.id}>
              {Number(value.id) === Number(claim.occurrenceSelect) &&
                `${claim.occurrenceSelect && "■"}${value.headline}  ${
                  value.title
                }`}
            </Box>
          ))}
        </Box>
        <Box px={2} mt={2} whiteSpace="pre-wrap">
          {claim.occurrenceContent}
        </Box>
      </Box>

      <Box mt={10}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          修正処置
        </Flex>
        <Box px={2} mt={2}>
          {claimSelectList2.map((value) => (
            <Box key={value.id}>
              {Number(value.id) === Number(claim.amendmentSelect) &&
                `${claim.amendmentSelect && "■"}${value.title}`}
            </Box>
          ))}
          <Box mt={2} whiteSpace="pre-wrap">
            {claim.amendmentContent}
          </Box>
        </Box>
      </Box>

      <Box mt={10}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          起因部署
        </Flex>
        <Box px={2} mt={2}>
          {claimSelectList4.map((value) => (
            <Box key={value.id}>
              {Number(value.id) === Number(claim.causeDepartmentSelect) &&
                value.title}
            </Box>
          ))}
        </Box>
      </Box>

      <Box mt={10}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          対策
        </Flex>
        <Box px={2} mt={2}>
          {claimSelectList3.map((value) => (
            <Box key={value.id}>
              {Number(value.id) === Number(claim.counterplanSelect) &&
                `${claim.counterplanSelect && "■"}${value.title}`}
            </Box>
          ))}
          <Box mt={2} whiteSpace="pre-wrap">
            {claim.counterplanContent}
          </Box>
        </Box>
      </Box>

      {/* 添付書類 */}
      <Box mt={9}>
        <ClaimAttached imageUrl={claim.imageUrl1} />
        <ClaimAttached imageUrl={claim.imageUrl2} />
        <ClaimAttached imageUrl={claim.imageUrl3} />
      </Box>

      {/* 完了日 */}
      <Box>
        <Box mt={9} fontSize="lg" fontWeight="semibold">
          完了日
        </Box>
        <Box px={2} mt={2}>
          <Box>{claim.completionDate}</Box>
        </Box>
      </Box>
    </>
  );
};

export default ClaimReport;
