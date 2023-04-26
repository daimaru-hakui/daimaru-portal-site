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

  const buttonEl = () => (
    <Button
      w="full"
      onClick={() => {
        setEdit(true);
      }}
    >
      編集
    </Button>
  );
  return (
    <>
      <Box w={{ md: "750px" }} py={2} mx="auto">
        {!edit && (
          <Flex gap={3} justifyContent="space-between" w="full">
            <Box w="full">
              <Link href="/claims">
                <Button w="100%">一覧へ戻る</Button>
              </Link>
            </Box>

            {/* 事務局のみ編集可 */}
            {isAuth(["isoOffice"]) && buttonEl()}

            {/*1 - 3 受付から内容確認 担当者・記入者・作業者・事務局のみ編集可 */}
            {Number(claim.status) >= 1 &&
              Number(claim.status) <= 3 &&
              (isStampStaff(currentUser, claim) ||
                isAuthor(currentUser, claim) ||
                isOperator(currentUser, claim)) &&
              buttonEl()}

            {/*5 上司承認中 上司と事務局のみ編集可 */}
            {Number(claim.status) === 5 &&
              isOperator(currentUser, claim) &&
              buttonEl()}
          </Flex>
        )}
      </Box>
    </>
  );
};
