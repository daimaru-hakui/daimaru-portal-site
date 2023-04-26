/* eslint-disable @next/next/no-img-element */
//クレーム報告書　個別ページ
import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { claimsState } from "../../../store";

import { ClaimSelectSendButton } from "../../components/claims/button/ClaimSelectSendButton";
import ClaimReport from "../../components/claims/ClaimReport";
import { ClaimConfirmSendButton } from "../../components/claims/button/ClaimConfirmSendButton";
import { ClaimEditButton } from "../../components/claims/button/ClaimEditButton";
import ClaimProgress from "../../components/claims/ClaimProgress";
import { ClaimMessage } from "../../components/claims/ClaimMessage";
import Link from "next/link";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ClaimStampArea from "../../components/claims/ClaimStampArea";
import { ClaimAccept } from "../../components/claims/ClaimAccept";
import { useAuthStore } from "../../../store/useAuthStore";
import { ClaimEditReport } from "@/components/claims/ClaimEditReport";
import { useUtils } from "@/hooks/useUtils";

//クレーム報告書作成

const ClaimId = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const users = useAuthStore((state) => state.users);
  const { isAuth } = useUtils();
  const [claim, setClaim] = useState<any>([]); //クレームの個別記事を取得
  const [claims, setClaims] = useRecoilState<any>(claimsState); //クレーム一覧を取得
  const [edit, setEdit] = useState(false); //編集画面切替

  // クレーム報告書を取得;
  useEffect(() => {
    onSnapshot(doc(db, "claimList", `${queryId}`), (doc) => {
      setClaim({ ...doc.data(), id: doc.id });
    });
  }, [queryId, edit]);

  //nextページ prevページのIDを取得
  const nextPrevPage = (id: any, page: number) => {
    let currentIndex = 0;
    claims.forEach((claim: any, index: number) => {
      if (claim.id == id) {
        currentIndex = index;
      }
    });
    const array = claims.filter((claim: any, index: number) => {
      if (currentIndex + page === index) return claim.id;
    });
    let nextId;
    if (array && array[0]) {
      nextId = array[0].id;
    }
    return nextId;
  };

  return (
    <>
      {claim && (
        <>
          <Box position="relative">
            <Flex justifyContent="space-between" color="gray.600">
              {nextPrevPage(queryId, 1) !== undefined ? (
                <Link href={`/claims/${nextPrevPage(queryId, 1)}`}>
                  <Flex alignItems="center">
                    <ArrowBackIcon />
                    前のクレーム
                  </Flex>
                </Link>
              ) : (
                <Box></Box>
              )}

              {nextPrevPage(queryId, -1) !== undefined ? (
                <Link href={`/claims/${nextPrevPage(queryId, -1)}`}>
                  <Flex alignItems="center">
                    次のクレーム
                    <ArrowForwardIcon />
                  </Flex>
                </Link>
              ) : (
                <Box></Box>
              )}
            </Flex>
            {/* クレームメッセージ */}
            <ClaimMessage claim={claim} />

            {/* ステータスの進捗 */}
            <ClaimProgress claim={claim} users={users} />

            {/* 編集ボタン 未処理以外「担当者」と「事務局」と「作業者」のみ*/}
            <ClaimEditButton claim={claim} edit={edit} setEdit={setEdit} />

            {/* レポート部分メイン */}
            <Box
              w={{ base: "full", md: "750px" }}
              mx="auto"
              p={6}
              bg="white"
              rounded="md"
              boxShadow="md"
            >
              {/* 通常画面 */}
              {!edit && <ClaimReport claim={claim} />}
              {/* 編集画面 */}
              {edit && <ClaimEditReport claim={claim} setEdit={setEdit} />}

              {/*'未処理 受付NO. 受付日 入力欄*/}
              <ClaimAccept claim={claim} />

              {!edit && (
                <>
                  {/*決定ボタン*/}
                  <ClaimConfirmSendButton claim={claim} />

                  {/* 担当者セレクトボタン　未処理以外　事務局のみ */}
                  {Number(claim.status) !== 0 && isAuth(["isoOffice"]) && (
                    <ClaimSelectSendButton claim={claim} />
                  )}
                </>
              )}
            </Box>

            {/* スタンプエリア */}
            <ClaimStampArea claim={claim} users={users} />

            {/* 編集ボタン 未処理以外「担当者」と「事務局」と「作業者」のみ*/}
            <ClaimEditButton claim={claim} edit={edit} setEdit={setEdit} />
          </Box>
        </>
      )}
    </>
  );
};

export default ClaimId;
