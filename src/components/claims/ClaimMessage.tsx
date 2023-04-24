import { Alert, AlertIcon, Box, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";

type Props = {
  claim: {
    status: string;
    operator: string;
    message: string;
    stampStaff: string;
    amendmentContent: string;
  };
  currentUser: string | undefined;
  users: [];
  enabledOffice: any;
  enabledManager: any;
  enabledTopManegment: any;
};

const ClaimMessage: NextPage<Props> = ({
  claim,
  currentUser,
  users,
  enabledOffice,
  enabledManager,
  enabledTopManegment,
}) => {
  return (
    <>
      <Box
        w={{ base: "100%", md: "750px" }}
        mx="auto"
        justifyContent="space-between"
      >
        {/* 事務局に表示するメッセージ */}
        {claim.message && Number(claim.status) <= 7 && (
          <Alert status="error">
            <AlertIcon />
            <Box whiteSpace="pre-wrap">{claim.message}</Box>
          </Alert>
        )}

        {/* 事務局に表示するメッセージ　 */}
        {Number(claim.status) === 0 && enabledOffice() && (
          <Alert status="info">
            <AlertIcon />
            {users.map(
              (user: { uid: string; name: string }) =>
                claim.stampStaff === user.uid && (
                  <Box key={user.uid}>
                    <Box>
                      受付NO.と受付日を記入してください。
                      <br />
                      記入が完了次第、下の「受け付ける」のボタンをクリックしてください。
                    </Box>
                  </Box>
                )
            )}
          </Alert>
        )}

        {/* 担当者に表示するメッセージ　 */}
        {Number(claim.status) === 1 && claim.stampStaff === currentUser && (
          <Alert status="info">
            <AlertIcon />
            {users.map(
              (user: { uid: string; name: string }) =>
                claim.stampStaff === user.uid && (
                  <Box key={user.uid}>
                    <Box>作業者：{user.name}</Box>
                    <Box>
                      編集ボタンをクリックして、【修正処置】を記入してください。
                      <br />
                      記入が完了次第、下の【事務局へ提出する】ボタンをクリックしてください。
                    </Box>
                  </Box>
                )
            )}
          </Alert>
        )}

        {/* 事務局に表示するメッセージ　 */}
        {Number(claim.status) === 2 && enabledOffice() && (
          <Alert status="info">
            <AlertIcon />
            <Box>
              <Box>
                編集ボタンをクリックして、【起因部署】を選択してください。
                <br />
                選択が完了次第、対策記入する方へ送信してください。
              </Box>
            </Box>
          </Alert>
        )}

        {/* 対策者に表示するメッセージ */}
        {Number(claim.status) === 3 && claim.operator === currentUser && (
          <Alert status="info">
            <AlertIcon />
            {users.map(
              (user: { uid: string; name: string }) =>
                claim.operator === user.uid && (
                  <Box key={user.uid}>
                    <Box>作業者：{user.name}</Box>
                    <Box>
                      編集ボタンをクリックして、【対策】を記入してください。
                      <br />
                      記入が完了次第、下の【事務局へ提出する】ボタンをクリックしてください。
                    </Box>
                  </Box>
                )
            )}
          </Alert>
        )}

        {/* 事務局に表示するメッセージ */}
        {Number(claim.status) === 4 && enabledOffice() && (
          <Alert status="info">
            <AlertIcon />
            <Box>
              発生内容・修正処置・対策が記入されているか確認してください。
              <br />
              記入漏れがなければ、タスクの「上司承認」を選択して送信してください。
            </Box>
          </Alert>
        )}

        {/* 上司に表示するメッセージ */}
        {Number(claim.status) === 5 && claim.operator === currentUser && (
          <Alert status="info">
            <AlertIcon />
            {users.map(
              (user: { uid: string; name: string }) =>
                claim.operator === user.uid && (
                  <Box key={user.uid}>
                    <Box>作業者：{user.name}</Box>
                    <Box>
                      編集ボタンをクリックして、【完了日】の記入と対策の確認をしてください。
                      <br />
                      記入と確認が完了次第、下の【承認する】ボタンをクリックしてください。
                      <br />
                      やり直しの場合は却下してください。
                    </Box>
                  </Box>
                )
            )}
          </Alert>
        )}

        {/* 管理者に表示するメッセージ */}
        {Number(claim.status) === 6 && enabledManager() && (
          <Alert status="info">
            <AlertIcon />
            <Box>
              <Box>
                内容を確認してから【承認する】ボタンをクリックしてください。
                <br />
                やり直しの場合は却下してください。
              </Box>
            </Box>
          </Alert>
        )}

        {/* topManagmentに表示するメッセージ */}
        {Number(claim.status) === 7 && enabledTopManegment() && (
          <Alert status="info">
            <AlertIcon />
            <Box>
              内容を確認してから【承認する】ボタンをクリックしてください。
              <br />
              やり直しの場合は却下してください。
            </Box>
          </Alert>
        )}
      </Box>
    </>
  );
};

export default ClaimMessage;
