/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { FC, useState } from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from "../../../data";
import { db, storage } from "../../../firebase";
import ClaimEditAttached from "./ClaimEditAttached";
import { useForm, SubmitHandler } from "react-hook-form";
import { Claim } from "../../../types";
import { useRouter } from "next/router";
import { useUtils } from "@/hooks/useUtils";
import { useAuthStore } from "../../../store/useAuthStore";

type Props = {
  claim: Claim;
  setEdit: (payload: boolean) => void;
};

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

export const ClaimEditReport: FC<Props> = ({ claim, setEdit }) => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isAuth, isAuthor, isStampStaff, isOperator } = useUtils();
  const [fileUpload1, setFileUpload1] = useState<any>();
  const [fileUpload2, setFileUpload2] = useState<any>();
  const [fileUpload3, setFileUpload3] = useState<any>();
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imagePath1, setImagePath1] = useState("");
  const [imagePath2, setImagePath2] = useState("");
  const [imagePath3, setImagePath3] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      receptionNum: claim.receptionNum,
      receptionDate: claim.receptionDate,
      customer: claim.customer,
      occurrenceDate: claim.occurrenceDate,
      occurrenceSelect: String(claim.occurrenceSelect),
      occurrenceContent: claim.occurrenceContent,
      amendmentSelect: String(claim.amendmentSelect),
      amendmentContent: claim.amendmentContent,
      causeDepartmentSelect: String(claim.causeDepartmentSelect),
      counterplanSelect: String(claim.counterplanSelect),
      counterplanContent: claim.counterplanContent,
      completionDate: claim.completionDate,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {

  };

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

  //添付ファイルをアップロード
  const onFileUpload = (claim: Claim, fileUpload: any, num: number) => {
    const result = window.confirm("アップロードして宜しいでしょうか？");
    if (!result) return;

    const file = fileUpload[0];
    if (num === 1) {
      setImageUrl1(window.URL.createObjectURL(file));
    }
    if (num === 2) {
      setImageUrl2(window.URL.createObjectURL(file));
    }
    if (num === 3) {
      setImageUrl3(window.URL.createObjectURL(file));
    }

    const storageRef = ref(
      storage,
      `images/claims/${claim.id}/${fileUpload[0].name}`
    );
    uploadBytes(storageRef, file).then((snapshot: any) => {
      getDownloadURL(
        ref(storage, `images/claims/${claim.id}/${fileUpload[0].name}`)
      ).then((url) => {
        const docRef = doc(db, "claimList", `${claim.id}`);
        updateDoc(docRef, {
          ["imageUrl" + num]: url,
          ["imagePath" + num]: storageRef.fullPath,
        });

        if (num === 1) {
          setFileUpload1(null);
          setImagePath1(storageRef.fullPath);
        }
        if (num === 2) {
          setFileUpload2(null);
          setImagePath2(storageRef.fullPath);
        }
        if (num === 3) {
          setFileUpload3(null);
          setImagePath3(storageRef.fullPath);
        }

        console.log("アップロード成功");
      });
    });
  };

  //添付ファイルを削除
  const onFileDelete = (claim: Claim, imagePath: string, num: number) => {
    const result = window.confirm("削除して宜しいでしょうか？");
    if (!result) return;
    if (num === 1) {
      setFileUpload1("");
      setImageUrl1("");
    }
    if (num === 2) {
      setFileUpload2("");
      setImageUrl2("");
    }
    if (num === 3) {
      setFileUpload3("");
      setImageUrl3("");
    }
    const docRef = doc(db, "claimList", `${claim.id}`);
    updateDoc(docRef, {
      ["imageUrl" + num]: "",
      ["imagePath" + num]: "",
    }).then(() => {
      const desertRef = ref(storage, imagePath);
      deleteObject(desertRef)
        .then(() => {
          console.log("削除成功");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  //クレーム報告書を更新
  const updateClaim = async (data: Inputs, claim: Claim) => {
    const docRef = doc(db, "claimList", claim.id);
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
  };

  //クレーム報告書の発生内容を更新
  const updateOccurrenceClaim = async (data: Inputs, claim: Claim) => {
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      occurrenceSelect: data.occurrenceSelect,
      occurrenceContent: data.occurrenceContent,
    });
  };

  //クレーム報告書の修正処置を更新
  const updateAmendmentClaim = async (data: Inputs, claim: Claim) => {
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      amendmentSelect: data.amendmentSelect,
      amendmentContent: data.amendmentContent,
      causeDepartmentSelect: data.causeDepartmentSelect,
    });
  };

  //クレーム報告書を対策者・上司入力欄の更新
  const updateCounterplanClaim = async (data: Inputs, claim: Claim) => {
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      counterplanSelect: data.counterplanSelect,
      counterplanContent: data.counterplanContent,
      completionDate: data.completionDate,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Box mt={10} fontSize="lg" fontWeight="semibold">
            受付NO
          </Box>
          <Input
            p={2}
            mt={3}
            placeholder="受付ナンバー 例 4-001"
            // disabled={!enabledOffice()}
            {...register("receptionNum")}
          />
        </Box>
        <Box>
          <Box mt={9} fontSize="lg" fontWeight="semibold">
            受付日
          </Box>
          <Input
            type="date"
            p={2}
            mt={3}
            // disabled={!enabledOffice()}
            {...register("receptionDate")}
          />
        </Box>

        <Box>
          <Box mt={10} fontSize="lg" fontWeight="semibold">
            顧客名
          </Box>
          <Input
            p={2}
            mt={3}
            placeholder="顧客名を入力"
            // disabled={!enabledOffice()}
            {...register("customer")}
          />
        </Box>

        <Box>
          <Box mt={9} fontSize="lg" fontWeight="semibold">
            発生日
          </Box>
          <Input
            type="date"
            p={2}
            mt={3}
            // disabled={!enabledOffice()}
            {...register("occurrenceDate")}
          />
        </Box>

        {/* 発生内容 */}
        <Box mt={10}>
          <Box as="h2" fontSize="lg" fontWeight="semibold">
            発生内容
          </Box>
          <Box mt={6}>
            <RadioGroup
              colorScheme="green"
              {...register("occurrenceSelect")}
              defaultValue={getValues("occurrenceSelect")}
              onChange={(e: any) => getValues(e)}
            >
              <Box mt={3}>①製品起因</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList1.map(
                  (list, index) =>
                    index <= 3 && (
                      <Radio
                        key={list.id}
                        value={list.id}
                        {...register("occurrenceSelect")}
                      // isDisabled={!enabledAuthor() && !enabledOffice()}
                      >
                        {list.title}
                      </Radio>
                    )
                )}
              </Stack>
              <Box mt={3}>②受発注</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList1.map(
                  (list, index) =>
                    index >= 4 &&
                    index <= 6 && (
                      <Radio
                        key={list.id}
                        value={list.id}
                        {...register("occurrenceSelect")}
                      // isDisabled={!enabledAuthor() && !enabledOffice()}
                      >
                        {list.title}
                      </Radio>
                    )
                )}
              </Stack>
              <Box mt={3}>③その他</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList1.map(
                  (list, index) =>
                    index === 7 && (
                      <Radio
                        key={list.id}
                        value={list.id}
                        {...register("occurrenceSelect")}
                      // isDisabled={!enabledAuthor() && !enabledOffice()}
                      >
                        {list.title}
                      </Radio>
                    )
                )}
              </Stack>
            </RadioGroup>
          </Box>
          <Textarea
            mt={3}
            p={2}
            placeholder="内容を入力"
            // isDisabled={!enabledAuthor() && !enabledOffice()}
            {...register("occurrenceContent")}
          />
        </Box>

        {/*修正処置 */}
        <Box mt={10}>
          <Flex as="h2" fontSize="lg" fontWeight="semibold">
            修正処置
          </Flex>
          <Box mt={3}>
            <RadioGroup
              colorScheme="green"
              {...register("amendmentSelect")}
              onChange={getValues}
            >
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList2.map((list) => (
                  <Radio
                    key={list.id}
                    value={list.id}
                    {...register("amendmentSelect")}
                  // isDisabled={!enabledStaff() && !enabledOffice()}
                  >
                    {list.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
          <Textarea
            mt={3}
            p={2}
            placeholder="内容を入力"
            // disabled={!enabledStaff() && !enabledOffice()}
            {...register("amendmentContent")}
          />
        </Box>

        <Box mt={9}>
          <Flex as="h2" fontSize="lg" fontWeight="semibold">
            起因部署
          </Flex>
          <Box mt={3}>
            <RadioGroup
              colorScheme="green"
              {...register("causeDepartmentSelect")}
              onChange={getValues}
            >
              <Stack
                spacing={[1, 5]}
                direction={["column", "row"]}
                px={2}
                py={{ md: "2" }}
              >
                {claimSelectList4.map(
                  (list, index) =>
                    index < 4 && (
                      <Radio
                        key={list.id}
                        value={list.id}
                        {...register("causeDepartmentSelect")}
                      // isDisabled={!enabledStaff() && !enabledOffice()}
                      >
                        {list.title}
                      </Radio>
                    )
                )}
              </Stack>
              <Stack
                spacing={[1, 5]}
                direction={["column", "row"]}
                px={2}
                py={{ md: "2" }}
              >
                {claimSelectList4.map(
                  (list, index) =>
                    index >= 4 && (
                      <Radio
                        key={list.id}
                        value={list.id}
                        {...register("causeDepartmentSelect")}
                      // isDisabled={!enabledStaff() && !enabledOffice()}
                      >
                        {list.title}
                      </Radio>
                    )
                )}
              </Stack>
            </RadioGroup>
          </Box>
        </Box>

        {/* 対策 */}
        <Box mt={9}>
          <Flex as="h2" fontSize="lg" fontWeight="semibold">
            対策
          </Flex>
          <Box mt={3}>
            <RadioGroup
              colorScheme="green"
              {...register("counterplanSelect")}
              onChange={getValues}
            >
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList3.map((list) => (
                  <Radio
                    key={list.id}
                    value={list.id}
                    {...register("counterplanSelect")}
                  // isDisabled={
                  //   !enabledBoss() &&
                  //   !enabledCounterplan() &&
                  //   !enabledOffice()
                  // }
                  >
                    {list.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Box>
              <Textarea
                mt={3}
                p={2}
                placeholder="内容を入力"
                // disabled={!enabledCounterplan() && !enabledOffice()}
                {...register("counterplanContent")}
              />
            </Box>
          </Box>
        </Box>

        <Box mt={9}>
          <Flex as="h2" fontSize="lg" fontWeight="semibold">
            添付書類（※画像形式 jpeg jpg png）
          </Flex>
          <ClaimEditAttached
            imageUrl={claim.imageUrl1}
            imagePath={claim.imagePath1}
            fileUpload={fileUpload1}
            setFileUpload={setFileUpload1}
            onFileUpload={onFileUpload}
            onFileDelete={onFileDelete}
            num={1}
          />
          <ClaimEditAttached
            imageUrl={claim.imageUrl2}
            imagePath={claim.imagePath2}
            fileUpload={fileUpload2}
            setFileUpload={setFileUpload2}
            onFileUpload={onFileUpload}
            onFileDelete={onFileDelete}
            num={2}
          />
          <ClaimEditAttached
            imageUrl={claim.imageUrl3}
            imagePath={claim.imagePath3}
            fileUpload={fileUpload3}
            setFileUpload={setFileUpload3}
            onFileUpload={onFileUpload}
            onFileDelete={onFileDelete}
            num={3}
          />
        </Box>

        <Box>
          <Box mt={9} fontSize="lg" fontWeight="semibold">
            完了日
          </Box>
          <Input
            type="date"
            p={2}
            mt={3}
            // disabled={!enabledBoss() && enabledOffice()}
            {...register("completionDate")}
          />
        </Box>

        <Flex justifyContent="space-between" mt={10}>
          <Button
            w="full"
            mx={1}
            colorScheme="gray"
            onClick={() => {
              reset();
              setEdit(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            w="full"
            mx={1}
            colorScheme="telegram"
          // onClick={() => {
          //   isAuth(["isoOffice"]) && updateClaim(data, claim); //事務局用アップデート（すべて）

          //   isAuthor(currentUser, claim) && updateOccurrenceClaim(data, claim); //記入者アップデート（発生内容）

          //   isStampStaff(currentUser, claim) && updateAmendmentClaim(data, claim); //担当者アップデート（修正処置）

          //   (Number(claim.status) === 3 || Number(claim.status) === 5) &&
          //     isOperator(currentUser, claim) &&
          //     updateCounterplanClaim(data, claim); //対策者用・上司用アップデート（対策）
          // }}
          >
            OK
          </Button>
        </Flex>
        {isAuth(["isoOffice"]) && (
          <Flex justifyContent="center">
            <Button
              mt={12}
              colorScheme="red"
              onClick={() =>
                deleteClaim(claim.id, imagePath1, imagePath2, imagePath3)
              }
            >
              クレーム報告書を削除する
            </Button>
          </Flex>
        )}
      </form>
    </>
  );
};
