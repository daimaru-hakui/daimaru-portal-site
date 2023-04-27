import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { Claim } from "../../../../types";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useUtils } from "@/hooks/useUtils";

type Props = {
  claim: Claim;
  edit: boolean;
  setEdit: any;
};

export const ClaimEditButton: FC<Props> = ({ claim, edit, setEdit }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isAuth, isOperator, isStampStaff, isAuthor } = useUtils();

  return (
    <Box w={{ md: "750px" }} py={2} mx="auto">
      {!edit && (
        <Flex gap={3} justifyContent="space-between" w="full">
          <Box w="full">
            <Link href="/claims">
              <Button w="100%">一覧へ戻る</Button>
            </Link>
          </Box>

          {/* 全てのstatusで事務局は編集可 */
            (isAuth(["isoOffice"])
              ||
              /*1.修正処置 2.起因部署選択 3.対策記入 【担当者】【記入者】【作業者】編集可 */
              ([1, 2, 3].includes(Number(claim.status)) &&
                (isStampStaff(currentUser, claim) ||
                  isAuthor(currentUser, claim) ||
                  isOperator(currentUser, claim)))
              ||
              /*5 上司承認 【上司】編集可 */
              (Number(claim.status) === 5 &&
                isOperator(currentUser, claim)))
            &&
            (
              <Button
                w="full"
                onClick={() => {
                  setEdit(true);
                }}
              >
                編集
              </Button>
            )
          }
        </Flex>
      )}
    </Box>
  );
};
