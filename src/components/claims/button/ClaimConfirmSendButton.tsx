import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { db } from "../../../../firebase";
import { todayDate } from "../../../../functions";
import { useAuthStore } from "../../../../store/useAuthStore";
import { Claim } from "../../../../types";
import { useDisp } from "@/hooks/useDisp";
import { useUtils } from "@/hooks/useUtils";

type Props = {
  claim: Claim;
};

export const ClaimConfirmSendButton: NextPage<Props> = ({ claim }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [display, setDisplay] = useState(true);
  const { getUserName } = useDisp();
  const { isAuth, isOperator, isStampStaff } = useUtils();

  //修正処置完了 事務局へ渡す
  const amendmentClaim = async (id: string) => {
    const result = window.confirm("提出して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 2,
      operator: "事務局",
    });
    router.push(`/claims`);
  };

  //対策完了 事務局へ渡す
  const counterplanClaim = async (id: string) => {
    const result = window.confirm("提出して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      stampCounterplan: currentUser,
    });
    router.push(`/claims`);
  };

  //上司承認
  const bossApprovalClaim = async (id: string) => {
    const result = window.confirm("承認して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 6,
      operator: "管理者",
      stampBoss: currentUser,
      message: "",
    });
    router.push(`/claims`);
  };

  //上司却下
  const bossRejectedClaim = async (id: string) => {
    const result = window.confirm("却下して宜しいでしょうか？");
    if (!result) {
      setMessage("");
      setDisplay(true);
      return;
    }
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      message: `${todayDate()} ${getUserName(
        currentUser
      )}に却下されました。\n${message}`,
    });
    router.push(`/claims`);
  };

  //管理者承認
  const managerApprovalClaim = async (id: string) => {
    const result = window.confirm("承認して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 7,
      operator: "TM",
      stampManager: currentUser,
      message: "",
    });
    router.push(`/claims`);
  };

  //管理者却下
  const managerRejectedClaim = async (id: string) => {
    const result = window.confirm("却下して宜しいでしょうか？");
    if (!result) {
      setMessage("");
      setDisplay(true);
      return;
    }
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      message: `${todayDate()} ${getUserName(
        currentUser
      )}（管理者）に却下されました。\n${message}`,
    });
    router.push(`/claims`);
  };

  //TOP マネジメント承認
  const topManegmentApprovalClaim = async (id: string) => {
    const result = window.confirm("承認して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 8,
      operator: "",
      stampTm: currentUser,
      message: "",
    });
    router.push(`/claims`);
  };

  //TOP マネジメント却下
  const topManegmentRejectedClaim = async (id: string) => {
    const result = window.confirm(`却下して宜しいでしょうか？`);
    if (!result) {
      setMessage("");
      setDisplay(true);
      return;
    }
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      message: `${todayDate()} ${getUserName(
        currentUser
      )}（トップマネジメント）に却下されました。\n${message}`,
    });
    router.push(`/claims`);
  };

  return (
    <>
      {/* 修正処置を記入して事務局へ送信 */}
      {Number(claim.status) === 1 &&
        (isOperator(currentUser, claim) ||
          isStampStaff(currentUser, claim) ||
          isAuth(["isoOffice"]))
        && (
          <Flex justifyContent="center">
            <Button
              mt={12}
              colorScheme="facebook"
              onClick={() => {
                amendmentClaim(claim.id);
              }}
              disabled={!claim.amendmentSelect}
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
              counterplanClaim(claim.id);
            }}
            disabled={!claim.counterplanContent}
          >
            事務局へ提出する
          </Button>
        </Flex>
      )}

      {/* 上司が完了日と対策selectを記入　承認して管理職へ提出　却下して事務局へ提出 */}
      {Number(claim.status) === 5 && isOperator(currentUser, claim) && (
        <>
          {display ? (
            <Flex justifyContent="center">
              <Button
                mt={12}
                mr={3}
                colorScheme="blue"
                onClick={() => {
                  bossApprovalClaim(claim.id);
                }}
                disabled={!claim.completionDate || !claim.counterplanSelect}
              >
                承認する
              </Button>
              <Button
                mt={12}
                colorScheme="red"
                onClick={() => {
                  setDisplay(false);
                }}
              >
                却下する
              </Button>
            </Flex>
          ) : (
            <>
              <Text mt={12} fontSize="lg" fontWeight="bold">
                却下理由
              </Text>
              <Textarea
                mt="4"
                rounded="md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Flex mt={6}>
                <Button
                  onClick={() => bossRejectedClaim(claim.id)}
                  colorScheme="red"
                  w="50%"
                  mr="2"
                >
                  却下する
                </Button>
                <Button
                  onClick={() => {
                    setDisplay(true);
                    setMessage("");
                  }}
                  w="50%"
                >
                  キャンセル
                </Button>
              </Flex>
            </>
          )}
        </>
      )}

      {/* 管理職が確認　承認してTMへ提出　却下して事務局へ提出 */}
      {Number(claim.status) === 6 && isAuth(["isoManager"]) && (
        <>
          {display ? (
            <Flex justifyContent="center">
              <Button
                mt={12}
                mr={3}
                colorScheme="blue"
                onClick={() => {
                  managerApprovalClaim(claim.id);
                }}
              >
                承認する
              </Button>
              <Button
                mt={12}
                colorScheme="red"
                onClick={() => {
                  setDisplay(false);
                }}
              >
                却下する
              </Button>
            </Flex>
          ) : (
            <>
              <Text mt={12} fontSize="lg" fontWeight="bold">
                却下理由
              </Text>
              <Textarea
                mt="4"
                rounded="md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Flex mt={6}>
                <Button
                  onClick={() => managerRejectedClaim(claim.id)}
                  colorScheme="red"
                  w="50%"
                  mr="2"
                >
                  却下する
                </Button>
                <Button
                  onClick={() => {
                    setDisplay(true);
                    setMessage("");
                  }}
                  w="50%"
                >
                  キャンセル
                </Button>
              </Flex>
            </>
          )}
        </>
      )}

      {/* TMが確認　承認して完了　却下して事務局へ提出 */}
      {Number(claim.status) === 7 && isAuth(["isoTopManegment"]) && (
        <>
          {display ? (
            <Flex justifyContent="center">
              <Button
                mt={12}
                mr={3}
                colorScheme="blue"
                onClick={() => {
                  topManegmentApprovalClaim(claim.id);
                }}
              >
                承認する
              </Button>
              <Button
                mt={12}
                colorScheme="red"
                onClick={() => {
                  setDisplay(false);
                }}
              >
                却下する
              </Button>
            </Flex>
          ) : (
            <>
              <Text mt={12} fontSize="lg" fontWeight="bold">
                却下理由
              </Text>
              <Textarea
                mt="4"
                rounded="md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Flex mt={6}>
                <Button
                  onClick={() => topManegmentRejectedClaim(claim.id)}
                  colorScheme="red"
                  w="50%"
                  mr="2"
                >
                  却下する
                </Button>
                <Button
                  onClick={() => {
                    setDisplay(true);
                    setMessage("");
                  }}
                  w="50%"
                >
                  キャンセル
                </Button>
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
};
