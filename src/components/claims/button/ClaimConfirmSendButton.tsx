import { Button, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { useAuthStore } from "../../../../store/useAuthStore";
import { Claim } from "../../../../types";
import { useUtils } from "@/hooks/useUtils";
import { ClaimRejectModal } from "../ClaimRejectModal";
import { useClaims } from "@/hooks/useClaims";

type Props = {
  claim: Claim;
};

export const ClaimConfirmSendButton: FC<Props> = ({ claim }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isAuth, isOperator, isStampStaff } = useUtils();
  const {
    AmendmentDoneSendToOffice,
    counterplanDoneSendToOffice,
    bossApproval,
    mgrApproval,
    tmApproval,
    bossRejected,
    mgrRejected,
    tmRejected,
  } = useClaims();

  return (
    <>
      {/* 修正処置を記入して事務局へ送信 */}
      {Number(claim.status) === 1 &&
        (isOperator(currentUser, claim) ||
          isStampStaff(currentUser, claim) ||
          isAuth(["isoOffice"])) && (
          <Flex justifyContent="center">
            <Button
              mt={12}
              colorScheme="facebook"
              onClick={() => {
                AmendmentDoneSendToOffice(claim);
              }}
              isDisabled={!claim.amendmentSelect}
            >
              事務局へ提出する
            </Button>
          </Flex>
        )}

      {/* 対策を記入して事務局へ送信 */}
      {Number(claim.status) === 3 && isOperator(currentUser, claim) && (
        <Flex justifyContent="center">
          <Button
            mt={12}
            colorScheme="facebook"
            onClick={() => {
              counterplanDoneSendToOffice(claim);
            }}
            isDisabled={!claim.counterplanContent}
          >
            事務局へ提出する
          </Button>
        </Flex>
      )}

      {/* 上司が完了日と対策selectを記入　承認して管理職へ提出　却下して事務局へ提出 */}
      {Number(claim.status) === 5 && isOperator(currentUser, claim) && (
        <Flex mt={10} gap={3} justifyContent="center">
          <Button
            colorScheme="blue"
            onClick={() => {
              bossApproval(claim);
            }}
            isDisabled={!claim.completionDate || !claim.counterplanSelect}
          >
            承認する
          </Button>
          <ClaimRejectModal claim={claim} onRejectFunc={bossRejected} />
        </Flex>
      )}

      {/* 管理職が確認　承認してTMへ提出　却下して事務局へ提出 */}
      {Number(claim.status) === 6 && isAuth(["isoManager"]) && (
        <Flex mt={10} gap={3} justifyContent="center">
          <Button
            colorScheme="blue"
            onClick={() => {
              mgrApproval(claim);
            }}
          >
            承認する
          </Button>
          <ClaimRejectModal claim={claim} onRejectFunc={mgrRejected} />
        </Flex>
      )}

      {/* TMが確認　承認して完了　却下して事務局へ提出 */}
      {Number(claim.status) === 7 && isAuth(["isoTopManegment"]) && (
        <Flex justifyContent="center">
          <Button
            mt={12}
            mr={3}
            colorScheme="blue"
            onClick={() => {
              tmApproval(claim);
            }}
          >
            承認する
          </Button>
          <ClaimRejectModal claim={claim} onRejectFunc={tmRejected} />
        </Flex>
      )}
    </>
  );
};
