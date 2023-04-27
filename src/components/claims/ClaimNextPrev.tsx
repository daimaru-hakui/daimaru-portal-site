import { Box, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { useClaimStore } from "../../../store/useClaimStore";
import { Claim } from "../../../types";
import Link from "next/link";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

type Props = {
  claim: Claim;
};

export const ClaimNextPrev: FC<Props> = ({ claim }) => {
  const claims = useClaimStore((state) => state.claims);

  const nextPrevPage = (id: string, page: number) => {
    let currentIndex = 0;
    claims.some((claim, index: number) => {
      if (claim.id === id) {
        currentIndex = index;
        return;
      }
    });
    const claim = claims.find(
      (_, index: number) => currentIndex + page === index
    );
    return claim?.id;
  };

  return (
    <Flex justifyContent="space-between" color="gray.600">
      {nextPrevPage(claim.id, 1) !== undefined ? (
        <Link href={`/claims/${nextPrevPage(claim.id, 1)}`}>
          <Flex alignItems="center">
            <ArrowBackIcon />
            前のクレーム
          </Flex>
        </Link>
      ) : (
        <Box></Box>
      )}

      {nextPrevPage(claim.id, -1) !== undefined ? (
        <Link href={`/claims/${nextPrevPage(claim.id, -1)}`}>
          <Flex alignItems="center">
            次のクレーム
            <ArrowForwardIcon />
          </Flex>
        </Link>
      ) : (
        <Box></Box>
      )}
    </Flex>
  );
};
