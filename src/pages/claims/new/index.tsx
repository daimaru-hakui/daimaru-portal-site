import { Box, Button, Select } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db, storage } from "../../../../firebase";
import { usersState } from "../../../../store";
import ClaimInputCustomer from "../../../components/claims/new/ClaimInputCustomer";
import ClaimInputOccurrence from "../../../components/claims/new/ClaimInputOccurrence";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ClaimInputAttached from "../../../components/claims/new/ClaimInputAttached";
import { useAuthStore } from "../../../../store/useAuthStore";

//クレーム報告書作成

const ClaimNew = () => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useRecoilValue<any>(usersState); //ユーザー一覧リスト
  const [filterUsers, setFilterUsers] = useState([]); //絞り込んだユーザー一覧リスト
  const [customer, setCustomer] = useState(""); //顧客名
  const [occurrenceDate, setOccurrenceDate] = useState(""); //発生日
  const [occurrenceSelect, setOccurrenceSelect] = useState(""); //発生選択
  const [occurrenceContent, setOccurrenceContent] = useState(""); //発生内容
  const [amendmentSelect, setAmendmentSelect] = useState(""); //修正処置選択
  const [amendmentContent, setAmendmentContent] = useState(""); //修正処置内容
  const [counterplanSelect, setCounterplanSelect] = useState(""); //対策選択
  const [counterplanContent, setCounterplanContent] = useState(""); //対策内容
  const [completionDate, setCompletionDate] = useState(""); //完了日
  const [receptionDate, setReceptionDate] = useState(""); //受付日
  const [receptionist, setReceptionist] = useState(""); //受付者
  const [receptionNum, setReceptionNum] = useState(""); //受付NO.
  const [author, setAuthor] = useState(""); //記入者ハンコ
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

  const AddClaim = async (e: any) => {
    const result = window.confirm("提出して宜しいでしょうか？");
    if (!result) return;
    try {
      const docRef = await addDoc(collection(db, "claimList"), {
        customer, //顧客名
        occurrenceDate, //発生日
        occurrenceSelect, //発生選択
        occurrenceContent, //発生内容
        amendmentSelect, //修正処置選択
        amendmentContent, //修正処置内容
        causeDepartmentSelect: "", //起因部署
        counterplanSelect, //対策選択
        counterplanContent, //対策内容
        completionDate, //完了日
        receptionDate, //受付日
        receptionist, //受付者
        receptionNum: "未設定", //受付NO.
        author: currentUser, //記入者
        stampStaff: stampStaff, //担当者ハンコ
        stampOffice, //事務局ハンコ
        stampBoss, //上司ハンコ
        stampManager, //管理者ハンコ
        stampTm, //TMハンコ
        status: 0, //ステータス
        deletedAt: null, //論理削除
        createdAt: serverTimestamp(), //作成日
        operator: "事務局", //作業者
      });

      fileUpload1 && onFileUpload(docRef.id, fileUpload1, 1);
      fileUpload2 && onFileUpload(docRef.id, fileUpload2, 2);
      fileUpload3 && onFileUpload(docRef.id, fileUpload3, 3);

      router.push("/claims");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 画像をアップロード;
  const onFileUpload = (id: string, fileUpload: any, num: number) => {
    const file = fileUpload[0];
    const storageRef = ref(
      storage,
      `images/claims/${id}/${fileUpload[0].name}`
    );
    uploadBytes(storageRef, file).then((snapshot: any) => {
      getDownloadURL(
        ref(storage, `images/claims/${id}/${fileUpload[0].name}`)
      ).then((url) => {
        const docRef = doc(db, "claimList", id);
        updateDoc(docRef, {
          ["imageUrl" + num]: url,
          ["imagePath" + num]: storageRef.fullPath,
        });
      });
    });
  };

  //ユーザーリストを取得
  useEffect(() => {
    const newUsers = users.filter((user: { isoSalesStaff: boolean }) => {
      if (user.isoSalesStaff === true) return user;
    });
    setFilterUsers(newUsers);
  }, [users]);

  return (
    <Box
      w={{ base: "100%", md: "700px" }}
      mx="auto"
      p={6}
      backgroundColor="white"
      borderRadius={6}
    >
      <Box w="100%" textAlign="right">
        作成者：
        {users.map(
          (user: { uid: string; name: string }) =>
            user.uid === currentUser && user.name
        )}
      </Box>
      <Box
        as="h1"
        w="100%"
        mt={9}
        p={3}
        fontSize="28px"
        fontWeight="semibold"
        textAlign="center"
      >
        クレーム報告書
      </Box>
      <Box>
        <Box mt={10} fontSize="lg" fontWeight="semibold">
          担当者名
          <Box as="span" color="red">
            （必須）
          </Box>
        </Box>
        <Box mt={2}>
          <Select
            onChange={(e) => setStampStaff(e.target.value)}
            placeholder="担当者を選択"
          >
            {filterUsers.map((user: { uid: string; name: string }) => (
              <option key={user.uid} value={user.uid}>
                {user.name}
              </option>
            ))}
          </Select>
        </Box>
      </Box>

      {/* 顧客名 */}
      <ClaimInputCustomer
        customer={customer}
        setCustomer={setCustomer}
        occurrenceDate={occurrenceDate}
        setOccurrenceDate={setOccurrenceDate}
      />

      {/* 発生内容 */}
      <ClaimInputOccurrence
        occurrenceSelect={occurrenceSelect}
        setOccurrenceSelect={setOccurrenceSelect}
        occurrenceContent={occurrenceContent}
        setOccurrenceContent={setOccurrenceContent}
      />

      {/* 修正処置
              <ClaimInputAmendment
                amendmentSelect={amendmentSelect}
                setAmendmentSelect={setAmendmentSelect}
                amendmentContent={amendmentContent}
                setAmendmentContent={setAmendmentContent}
              /> */}

      {/*対策 */}
      {/* <ClaimInputCounteClaim
                counterplanSelect={counterplanSelect}
                setCounterplanSelect={setCounterplanSelect}
                counterplanContent={counterplanContent}
                setCounterplanContent={setCounterplanContent}
              /> */}

      {/* 添付書類 */}
      <Box mt={9}>
        <Box mr={3} fontSize="lg" fontWeight="semibold">
          添付書類（※画像形式 jpeg jpg png）
        </Box>
        <ClaimInputAttached
          fileUpload={fileUpload1}
          setFileUpload={setFileUpload1}
        />
        <ClaimInputAttached
          fileUpload={fileUpload2}
          setFileUpload={setFileUpload2}
        />
        <ClaimInputAttached
          fileUpload={fileUpload3}
          setFileUpload={setFileUpload3}
        />
      </Box>

      {/*送信ボタン*/}
      <Box mt={12} textAlign="center">
        <Button
          disabled={
            customer &&
            occurrenceDate &&
            occurrenceSelect &&
            occurrenceContent &&
            stampStaff
              ? false
              : true
          }
          onClick={(e) => {
            AddClaim(e);
          }}
        >
          提出する
        </Button>
      </Box>
    </Box>
  );
};

export default ClaimNew;
