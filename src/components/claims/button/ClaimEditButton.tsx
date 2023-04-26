import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { Claim } from "../../../../types";
import { useAuthStore } from "../../../../store/useAuthStore";

type Props = {
  claim: Claim;
  edit: boolean;
  setEdit: any;
  enabledOffice: any;
};

export const ClaimEditButton: FC<Props> = ({
  claim,
  edit,
  setEdit,
  enabledOffice,
}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  return (
    <>
      <Box w={{ base: "100%", md: "750px" }} py={2} mx="auto">
        {!edit && (
          <Flex justifyContent="space-between" w="100%">
            <Box w="100%" mr={1}>
              <Link href={"/claims"}>
                <Button w="100%">一覧へ戻る</Button>
              </Link>
            </Box>
            {/* 事務局のみ編集可 */}
            {(Number(claim.status) == 4 || Number(claim.status) >= 6) &&
              enabledOffice() && (
                <Box w="100%" ml={1}>
                  <Button
                    w="100%"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    編集
                  </Button>
                </Box>
              )}
            {/* 受付から内容確認 担当者・記入者・作業者・事務局のみ編集可 */}
            {Number(claim.status) >= 1 &&
              Number(claim.status) <= 3 &&
              (claim.stampStaff === currentUser ||
                claim.author === currentUser ||
                claim.operator === currentUser ||
                enabledOffice()) && (
                <Box w="100%" ml={1}>
                  <Button
                    w="100%"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    編集
                  </Button>
                </Box>
              )}
            {/* 上司承認中 上司と事務局のみ編集可 */}
            {Number(claim.status) === 5 &&
              (claim.operator === currentUser || enabledOffice()) && (
                <Box w="100%" ml={1}>
                  <Button
                    w="100%"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    編集
                  </Button>
                </Box>
              )}
          </Flex>
        )}
      </Box>
    </>
  );
};
