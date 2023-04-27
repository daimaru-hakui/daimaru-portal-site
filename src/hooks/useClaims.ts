import React, { useState } from "react";
import { Claim } from "../../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useLoadingStore } from "../../store/useLoadingStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/router";
import { useUtils } from "./useUtils";
import { useDisp } from "./useDisp";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

type Inputs = {
  receptionNum: string;
  receptionDate: string;
  customer: string;
  occurrenceDate: string;
  occurrenceSelect: string;
  occurrenceContent: string;
  amendmentSelect: string;
  amendmentContent: string;
  causeDepartmentSelect: string;
  counterplanSelect: string;
  counterplanContent: string;
  completionDate: string;
};

export const useClaims = () => {
  const router = useRouter();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { todayDate } = useUtils();
  const { getUserName } = useDisp();
  const [fileUpload1, setFileUpload1] = useState<any>();
  const [fileUpload2, setFileUpload2] = useState<any>();
  const [fileUpload3, setFileUpload3] = useState<any>();

  const addClaim = async (data: Claim) => {
    const result = window.confirm("提出して宜しいでしょうか？");
    if (!result) return;
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "claimList"), {
        customer: data.customer, //顧客名
        occurrenceDate: data.occurrenceDate, //発生日
        occurrenceSelect: Number(data.occurrenceSelect), //発生選択
        occurrenceContent: data.occurrenceContent, //発生内容
        amendmentSelect: Number(data.amendmentSelect) || "", //修正処置選択
        amendmentContent: data.amendmentContent, //修正処置内容
        causeDepartmentSelect: "", //起因部署
        counterplanSelect: "", //対策選択
        counterplanContent: "", //対策内容
        completionDate: "", //完了日
        receptionDate: "", //受付日
        receptionist: "", //受付者
        receptionNum: "未設定", //受付NO.
        author: currentUser, //記入者
        stampStaff: data.stampStaff, //担当者ハンコ
        stampOffice: "", //事務局ハンコ
        stampBoss: "", //上司ハンコ
        stampManager: "", //管理者ハンコ
        stampTm: "", //TMハンコ
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
    } finally {
      setIsLoading(false);
    }
  };

  // 画像をアップロード;
  const onFileUpload = (id: string, fileUpload: any, num: number) => {
    const file = fileUpload[0];
    const storageRef = ref(
      storage,
      `images/claims/${id}/${fileUpload[0].name}`
    );
    uploadBytes(storageRef, file).then(() => {
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

  //クレーム報告書を削除
  const deleteClaim = async (claim: Claim) => {
    const result = window.confirm("削除して宜しいでしょうか？");
    if (!result) return;
    await deleteDoc(doc(db, "claimList", claim.id));
    fileDelete(claim.imagePath1);
    fileDelete(claim.imagePath2);
    fileDelete(claim.imagePath3);
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

  //クレーム報告書を更新
  const updateClaim = async (data: Inputs, claim: Claim) => {
    setIsLoading(true);
    const docRef = doc(db, "claimList", claim.id);
    try {
      await updateDoc(docRef, {
        customer: data.customer,
        receptionNum: data.receptionNum,
        occurrenceDate: data.occurrenceDate,
        occurrenceSelect: data.occurrenceSelect,
        occurrenceContent: data.occurrenceContent,
        amendmentSelect: data.amendmentSelect,
        amendmentContent: data.amendmentContent,
        counterplanSelect: data.counterplanSelect,
        counterplanContent: data.counterplanContent,
        completionDate: data.completionDate,
        causeDepartmentSelect: data.causeDepartmentSelect,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  //クレーム報告書の発生内容を更新
  const updateOccurrence = async (data: Inputs, claim: Claim) => {
    setIsLoading(true);
    const docRef = doc(db, "claimList", claim.id);
    try {
      await updateDoc(docRef, {
        occurrenceSelect: data.occurrenceSelect,
        occurrenceContent: data.occurrenceContent,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  //クレーム報告書の修正処置を更新
  const updateAmendment = async (data: Inputs, claim: Claim) => {
    setIsLoading(true);
    const docRef = doc(db, "claimList", claim.id);
    try {
      await updateDoc(docRef, {
        amendmentSelect: data.amendmentSelect,
        amendmentContent: data.amendmentContent,
        causeDepartmentSelect: data.causeDepartmentSelect,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  //クレーム報告書を対策者・上司入力欄の更新
  const updateCounterplan = async (data: Inputs, claim: Claim) => {
    setIsLoading(true);
    const docRef = doc(db, "claimList", claim.id);
    try {
      await updateDoc(docRef, {
        counterplanSelect: data.counterplanSelect,
        counterplanContent: data.counterplanContent,
        completionDate: data.completionDate,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  //修正処置完了 事務局へ渡す
  const AmendmentDoneSendToOffice = async (claim: Claim) => {
    const result = window.confirm("提出して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 2,
      operator: "事務局",
    });
    router.push(`/claims`);
  };

  //対策完了 事務局へ渡す
  const counterplanDoneSendToOffice = async (claim: Claim) => {
    const result = window.confirm("提出して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      stampCounterplan: currentUser,
    });
    router.push(`/claims`);
  };

  //上司承認
  const bossApproval = async (claim: Claim) => {
    const result = window.confirm("承認して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 6,
      operator: "管理者",
      stampBoss: currentUser,
      message: "",
    });
    router.push(`/claims`);
  };

  //上司却下
  const bossRejected = async (claim: Claim, message: string) => {
    const result = window.confirm("却下して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      message: `${todayDate()} \n${getUserName(
        currentUser
      )}に却下されました。\n${message}`,
    });
    router.push(`/claims`);
  };

  //管理者承認
  const mgrApproval = async (claim: Claim) => {
    const result = window.confirm("承認して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 7,
      operator: "TM",
      stampManager: currentUser,
      message: "",
    });
    router.push(`/claims`);
  };

  //管理者却下
  const mgrRejected = async (claim: Claim, message: string) => {
    const result = window.confirm("却下して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      message: `${todayDate()} \n${getUserName(
        currentUser
      )}（管理者）に却下されました。\n${message}`,
    });
    router.push(`/claims`);
  };

  //TOP マネジメント承認
  const tmApproval = async (claim: Claim) => {
    const result = window.confirm("承認して宜しいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 8,
      operator: "",
      stampTm: currentUser,
      message: "",
    });
    router.push(`/claims`);
  };

  //TOP マネジメント却下
  const tmRejected = async (claim: Claim, message: string) => {
    const result = window.confirm(`却下して宜しいでしょうか？`);
    if (!result) return;
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 4,
      operator: "事務局",
      message: `${todayDate()} \n${getUserName(
        currentUser
      )}（トップマネジメント）に却下されました。\n${message}`,
    });
    router.push(`/claims`);
  };
  return {
    fileUpload1,
    fileUpload2,
    fileUpload3,
    setFileUpload1,
    setFileUpload2,
    setFileUpload3,
    addClaim,
    deleteClaim,
    updateClaim,
    updateOccurrence,
    updateAmendment,
    updateCounterplan,
    AmendmentDoneSendToOffice,
    counterplanDoneSendToOffice,
    bossApproval,
    bossRejected,
    mgrApproval,
    mgrRejected,
    tmApproval,
    tmRejected,
  };
};
