/* eslint-disable @next/next/no-img-element */
//クレーム報告書　個別ページ
import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { claimsState } from "../../../store";
import { taskflow } from "../../../data";
import { todayDate } from "../../../functions";

import ClaimSelectSendButton from "../../components/claims/button/ClaimSelectSendButton";
import ClaimReport from "../../components/claims/ClaimReport";
import ClaimConfirmSendButton from "../../components/claims/button/ClaimConfirmSendButton";
import ClaimEditButton from "../../components/claims/button/ClaimEditButton";
import ClaimProgress from "../../components/claims/ClaimProgress";
import ClaimMessage from "../../components/claims/ClaimMessage";
import ClaimEditReport from "../../components/claims/ClaimEditReport";
import Link from "next/link";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ClaimStampArea from "../../components/claims/ClaimStampArea";
import ClaimAccept from "../../components/claims/ClaimAccept";
import { useAuthStore } from "../../../store/useAuthStore";

//クレーム報告書作成

const ClaimId = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const [claim, setClaim] = useState<any>([]); //クレームの個別記事を取得
  const [claims, setClaims] = useRecoilState<any>(claimsState); //クレーム一覧を取得
  const [selectUser, setSelectUser] = useState(""); //送信先選択
  const [selectTask, setSelectTask] = useState<number>(0); //タスクの選択
  const [edit, setEdit] = useState(false); //編集画面切替
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagereUsers] = useState<any>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

  const [customer, setCustomer] = useState(""); //顧客名
  const [occurrenceDate, setOccurrenceDate] = useState(""); //発生日
  const [occurrenceSelect, setOccurrenceSelect] = useState(""); //発生選択
  const [occurrenceContent, setOccurrenceContent] = useState(""); //発生内容
  const [amendmentSelect, setAmendmentSelect] = useState(""); //修正処置選択
  const [amendmentContent, setAmendmentContent] = useState(""); //修正処置内容
  const [counterplanSelect, setCounterplanSelect] = useState(""); //対策選択
  const [counterplanContent, setCounterplanContent] = useState(""); //対策内容
  const [completionDate, setCompletionDate] = useState(""); //完了日
  const [causeDepartmentSelect, setCauseDepartmentSelect] = useState(""); //起因部署

  const [receptionDate, setReceptionDate] = useState(todayDate); //受付日
  const [receptionist, setReceptionist] = useState(""); //受付者
  const [receptionNum, setReceptionNum] = useState(""); //受付NO.
  const [stampStaff, setStampStaff] = useState(""); //担当者ハンコ
  const [stampOffice, setStampOffice] = useState(""); //事務局ハンコ
  const [stampBoss, setStampBoss] = useState(""); //上司ハンコ
  const [stampManager, setStampManager] = useState(""); //管理者ハンコ
  const [stampTm, setStampTm] = useState(""); //TMハンコ
  const [status, setStatus] = useState(""); //ステータス
  const [deletedAt, setDeletedAt] = useState(null); //論理削除
  const [createdAt, setCreatedAt] = useState(null); //作成日

  const [fileUpload1, setFileUpload1] = useState<any>();
  const [fileUpload2, setFileUpload2] = useState<any>();
  const [fileUpload3, setFileUpload3] = useState<any>();
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imagePath1, setImagePath1] = useState("");
  const [imagePath2, setImagePath2] = useState("");
  const [imagePath3, setImagePath3] = useState("");

  // クレーム報告書を取得;
  useEffect(() => {
    onSnapshot(doc(db, "claimList", `${queryId}`), (doc) => {
      setClaim(doc.data());
    });
  }, [queryId, edit]);

  //クレーム報告書を削除
  const deleteClaim = async (
    id: any,
    imagePath1: string,
    imagePath2: string,
    imagePath3: string
  ) => {
    const result = window.confirm("削除して宜しいでしょうか？");
    if (!result) return;

    await deleteDoc(doc(db, "claimList", id));

    fileDelete(imagePath1);
    fileDelete(imagePath2);
    fileDelete(imagePath3);

    router.push(`/claims`);
  };

  //画像を削除
  const fileDelete = async (path: string) => {
    if (path === "") {
      return;
    }
    const imageRef = ref(storage, `${path}`);
    await deleteObject(imageRef)
      .then(() => {
        console.log(path);
        console.log("削除成功");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //クレーム報告書を受付、担当者に修正処置を依頼
  const acceptClaim = async (id: any) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: 1,
      receptionist: currentUser,
      receptionNum,
      receptionDate,
      stampOffice: currentUser,
      operator: claim.stampStaff, //作業者
    });
    router.push(`/claims`);
  };

  //クレーム報告書のステータスを変更
  const switchStatus = async (id: any) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: Number(selectTask),
      operator: selectUser,
      // message: '',
    });
    router.push("/claims");
  };

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

  //クレーム報告書を更新
  const updateClaim = async (id: any) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      customer,
      receptionNum,
      receptionDate,
      occurrenceDate,
      occurrenceSelect,
      occurrenceContent,
      amendmentSelect,
      amendmentContent,
      counterplanSelect,
      counterplanContent,
      completionDate,
      causeDepartmentSelect,
    });
  };

  //クレーム報告書の発生内容を更新
  const updateOccurrenceClaim = async (id: any) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      occurrenceSelect,
      occurrenceContent,
    });
  };

  //クレーム報告書の修正処置を更新
  const updateAmendmentClaim = async (id: any) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      amendmentSelect,
      amendmentContent,
      causeDepartmentSelect,
    });
  };

  //クレーム報告書を対策者・上司入力欄の更新
  const updateCounterplanClaim = async (id: any) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      counterplanSelect,
      counterplanContent,
      completionDate,
    });
  };

  //各リストを取得
  useEffect(() => {
    //ISOマネージャーのリスト
    setIsoManagereUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO 上司のリスト
    setIsoBossUsers(
      users.filter((user: any) => {
        return user.isoBoss === true;
      })
    );
    //ISO トップマネジメントのリスト
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 事務局のリスト
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
  }, [users]);

  //事務局のみ編集可
  const enabledOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (office.includes(currentUser)) return true;
    return false;
  };

  //記入者のみ編集可
  const enabledAuthor = () => {
    if (claim.author === currentUser) return true;
    return false;
  };

  //担当者のみ編集可
  const enabledStaff = () => {
    if (claim.stampStaff === currentUser) return true;
    return false;
  };

  //対策者のみ編集可
  const enabledCounterplan = () => {
    if (claim.operator === currentUser && Number(claim.status) === 3)
      return true;
    return false;
  };

  //上司のみ編集可
  const enabledBoss = () => {
    const boss = isoBossUsers.map((user: { uid: string }) => {
      return user.uid;
    });

    if (
      claim.operator === currentUser &&
      boss.includes(currentUser) &&
      Number(claim.status) === 5
    )
      return true;
    return false;
  };

  //上司と事務局のみ編集可
  const enabledBossAndOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    const boss = isoBossUsers.map((user: { uid: string }) => {
      return user.uid;
    });

    if (
      ((claim.operator === currentUser || boss.includes(currentUser)) &&
        Number(claim.status) === 5) ||
      office.includes(currentUser)
    )
      return true;
    return false;
  };

  //管理者のみ編集可
  const enabledManager = () => {
    const manager = isoManagerUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser || manager.includes(currentUser)) &&
      Number(claim.status) === 6
    )
      return true;
    return false;
  };

  //Top Managementのみ編集可
  const enabledTopManegment = () => {
    const tm = isoTopManegmentUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser || tm.includes(currentUser)) &&
      Number(claim.status) === 7
    )
      return true;
    return false;
  };

  //編集ボタンを押したときに、データベースの値をsetに入れる
  const isEdit = () => {
    setCustomer(claim.customer);
    setOccurrenceDate(claim.occurrenceDate);
    setOccurrenceSelect(claim.occurrenceSelect);
    setOccurrenceContent(claim.occurrenceContent);
    setAmendmentSelect(claim.amendmentSelect);
    setAmendmentContent(claim.amendmentContent);
    setCounterplanSelect(claim.counterplanSelect);
    setCounterplanContent(claim.counterplanContent);
    setReceptionNum(claim.receptionNum);
    setReceptionDate(claim.receptionDate);
    setCauseDepartmentSelect(claim.causeDepartmentSelect);
    setCompletionDate(claim.completionDate);
    setImageUrl1(claim.imageUrl1);
    setImageUrl2(claim.imageUrl2);
    setImageUrl3(claim.imageUrl3);
    setImagePath1(claim.imagePath1);
    setImagePath2(claim.imagePath2);
    setImagePath3(claim.imagePath3);
  };

  //編集をキャンセルしたときに、setを空にする
  const editCancel = () => {
    setCustomer("");
    setOccurrenceDate("");
    setOccurrenceSelect("");
    setOccurrenceContent("");
    setAmendmentSelect("");
    setAmendmentContent("");
    setCounterplanSelect("");
    setCounterplanContent("");
    setReceptionNum("");
    setReceptionDate("");
    setCompletionDate("");
    setImageUrl1("");
    setImageUrl2("");
    setImageUrl3("");
    setImagePath1("");
    setImagePath2("");
    setImagePath3("");
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
            <ClaimMessage
              claim={claim}
              currentUser={currentUser}
              users={users}
              enabledOffice={enabledOffice}
              enabledManager={enabledManager}
              enabledTopManegment={enabledTopManegment}
            />
            {/* ステータスの進捗 */}
            <ClaimProgress claim={claim} users={users} />

            {/* 編集ボタン 未処理以外「担当者」と「事務局」と「作業者」のみ*/}
            <ClaimEditButton
              claim={claim}
              currentUser={currentUser}
              queryId={queryId}
              edit={edit}
              isEdit={isEdit}
              setEdit={setEdit}
              updateClaim={updateClaim}
              updateOccurrenceClaim={updateOccurrenceClaim}
              updateAmendmentClaim={updateAmendmentClaim}
              updateCounterplanClaim={updateCounterplanClaim}
              editCancel={editCancel}
              enabledOffice={enabledOffice}
            />

            {/* レポート部分メイン */}
            <Box
              w={{ base: "100%", md: "750px" }}
              mx="auto"
              p={6}
              backgroundColor="white"
              borderRadius={6}
            >
              {/* 受付ナンバー　受付日 */}
              {Number(claim.status) >= 1 && (
                <>
                  {!edit && (
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="100%"
                    >
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
                </>
              )}

              {/* 通常画面 */}
              {!edit && <ClaimReport claim={claim} />}

              {/* 編集画面 */}
              {edit && (
                <>
                  <ClaimEditReport claim={claim} />
                </>
              )}

              {/*'未処理 受付NO. 受付日 入力欄*/}
              <ClaimAccept
                claim={claim}
                queryId={queryId}
                enabledOffice={enabledOffice}
                receptionNum={receptionNum}
                setReceptionNum={setReceptionNum}
                receptionDate={receptionDate}
                setReceptionDate={setReceptionDate}
                acceptClaim={acceptClaim}
              />

              {!edit && (
                <>
                  {/*決定ボタン*/}
                  <ClaimConfirmSendButton
                    claim={claim}
                    users={users}
                    currentUser={currentUser}
                    queryId={queryId}
                    receptionDate={receptionDate}
                    receptionNum={receptionNum}
                    counterplanSelect={counterplanSelect}
                    counterplanContent={counterplanContent}
                    completionDate={completionDate}
                    stampOffice={stampOffice}
                    operator={claim.operator}
                    enabledOffice={enabledOffice}
                    enabledBossAndOffice={enabledBossAndOffice}
                    enabledManager={enabledManager}
                    enabledTopManegment={enabledTopManegment}
                  />

                  {/* 担当者セレクトボタン　未処理以外　事務局のみ */}
                  {Number(claim.status) !== 0 && enabledOffice() && (
                    <ClaimSelectSendButton
                      queryId={queryId}
                      users={users}
                      selectUser={selectUser}
                      setSelectUser={setSelectUser}
                      selectTask={selectTask}
                      setSelectTask={setSelectTask}
                      taskflow={taskflow}
                      switchStatus={switchStatus}
                    />
                  )}
                </>
              )}
            </Box>

            {/* スタンプエリア */}
            <ClaimStampArea claim={claim} users={users} />

            {/* 編集ボタン 未処理以外「担当者」と「事務局」と「作業者」のみ*/}
            <ClaimEditButton
              claim={claim}
              currentUser={currentUser}
              queryId={queryId}
              edit={edit}
              isEdit={isEdit}
              setEdit={setEdit}
              updateClaim={updateClaim}
              updateOccurrenceClaim={updateOccurrenceClaim}
              updateAmendmentClaim={updateAmendmentClaim}
              updateCounterplanClaim={updateCounterplanClaim}
              editCancel={editCancel}
              enabledOffice={enabledOffice}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ClaimId;
