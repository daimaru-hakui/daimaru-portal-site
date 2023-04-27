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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
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
import { ClaimEditAttached } from "./image/ClaimEditAttached";
import { useForm, SubmitHandler } from "react-hook-form";
import { Claim } from "../../../types";
import { useUtils } from "@/hooks/useUtils";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClaims } from "@/hooks/useClaims";

type Props = {
  claim: Claim;
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

export const ClaimEditReport: FC<Props> = ({ claim }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    deleteClaim,
    updateClaim,
    updateOccurrence,
    updateAmendment,
    updateCounterplan,
  } = useClaims();
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
    //事務局用アップデート（すべて）
    if (isAuth(["isoOffice"])) updateClaim(data, claim);

    //記入者アップデート（発生内容）
    if (isAuthor(currentUser, claim)) updateOccurrence(data, claim);

    //担当者アップデート（修正処置）
    if (isStampStaff(currentUser, claim)) updateAmendment(data, claim);

    //対策者用・上司用アップデート（対策）
    if ([3, 5].includes(Number(claim.status)) && isOperator(currentUser, claim))
      updateCounterplan(data, claim);
    onClose();
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
      `images/claims/${claim.id}/${fileUpload[0]?.name}`
    );
    uploadBytes(storageRef, file).then(() => {
      getDownloadURL(
        ref(storage, `images/claims/${claim.id}/${fileUpload[0]?.name}`)
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

  return (
    <>
      <Button w="full" onClick={onOpen}>
        編集
      </Button>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mt={9} fontSize="lg" fontWeight="semibold">
                受付NO
              </Box>
              <Input
                p={2}
                mt={3}
                placeholder="受付ナンバー 例 4-001"
                isDisabled={!isAuth(["isoOffice"])}
                {...register("receptionNum")}
              />

              <Box mt={9} fontSize="lg" fontWeight="semibold">
                受付日
              </Box>
              <Input
                type="date"
                p={2}
                mt={3}
                isDisabled={!isAuth(["isoOffice"])}
                {...register("receptionDate")}
              />

              <Box mt={10} fontSize="lg" fontWeight="semibold">
                顧客名
              </Box>
              <Input
                p={2}
                mt={3}
                placeholder="顧客名を入力"
                isDisabled={
                  !isAuth(["isoOffice"]) &&
                  !isAuthor(currentUser, claim) &&
                  !isStampStaff(currentUser, claim)
                }
                {...register("customer")}
              />

              <Box mt={9} fontSize="lg" fontWeight="semibold">
                発生日
              </Box>
              <Input
                type="date"
                p={2}
                mt={3}
                isDisabled={
                  !isAuth(["isoOffice"]) && !isAuthor(currentUser, claim)
                }
                {...register("occurrenceDate")}
              />

              <Box as="h2" mt={9} fontSize="lg" fontWeight="semibold">
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
                            isDisabled={
                              !isAuth(["isoOffice"]) &&
                              !isAuthor(currentUser, claim)
                            }
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
                            isDisabled={
                              !isAuth(["isoOffice"]) &&
                              !isAuthor(currentUser, claim)
                            }
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
                            isDisabled={
                              !isAuth(["isoOffice"]) &&
                              !isAuthor(currentUser, claim)
                            }
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
                isDisabled={
                  !isAuth(["isoOffice"]) && !isAuthor(currentUser, claim)
                }
                {...register("occurrenceContent")}
              />

              <Flex as="h2" mt={9} fontSize="lg" fontWeight="semibold">
                修正処置
              </Flex>
              <Box mt={3}>
                <RadioGroup
                  colorScheme="green"
                  defaultValue={getValues("amendmentSelect")}
                  {...register("amendmentSelect")}
                  onChange={getValues}
                >
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    {claimSelectList2.map((list) => (
                      <Radio
                        key={list.id}
                        value={list.id}
                        {...register("amendmentSelect")}
                        isDisabled={
                          !isAuth(["isoOffice"]) &&
                          !isStampStaff(currentUser, claim)
                        }
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
                isDisabled={
                  !isAuth(["isoOffice"]) && !isStampStaff(currentUser, claim)
                }
                {...register("amendmentContent")}
              />

              <Flex as="h2" mt={9} fontSize="lg" fontWeight="semibold">
                起因部署
              </Flex>
              <Box mt={3}>
                <RadioGroup
                  colorScheme="green"
                  defaultValue={getValues("causeDepartmentSelect")}
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
                            isDisabled={
                              !isStampStaff(currentUser, claim) &&
                              !isAuth(["isoOffice"])
                            }
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
                            isDisabled={
                              !isStampStaff(currentUser, claim) &&
                              !isAuth(["isoOffice"])
                            }
                          >
                            {list.title}
                          </Radio>
                        )
                    )}
                  </Stack>
                </RadioGroup>
              </Box>

              <Flex as="h2" mt={9} fontSize="lg" fontWeight="semibold">
                対策
              </Flex>
              <RadioGroup
                mt={3}
                colorScheme="green"
                defaultValue={getValues("counterplanSelect")}
                {...register("counterplanSelect")}
                onChange={getValues}
              >
                <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                  {claimSelectList3.map((list) => (
                    <Radio
                      key={list.id}
                      value={list.id}
                      {...register("counterplanSelect")}
                      isDisabled={
                        !isAuth(["isoOffice"]) &&
                        !isAuth(["isoBoss"]) &&
                        !(
                          [3, 5].includes(Number(claim.status)) &&
                          isOperator(currentUser, claim)
                        )
                      }
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
                  isDisabled={
                    !isAuth(["isoOffice"]) &&
                    !isAuth(["isoBoss"]) &&
                    !(
                      [3, 5].includes(Number(claim.status)) &&
                      isOperator(currentUser, claim)
                    )
                  }
                  {...register("counterplanContent")}
                />
              </Box>

              <Flex as="h2" mt={9} fontSize="lg" fontWeight="semibold">
                添付書類（※画像形式 jpeg jpg png）
              </Flex>

              {[
                {
                  num: 1,
                  url: claim.imageUrl1,
                  path: claim.imagePath1,
                  upload: fileUpload1,
                  setUpload: setFileUpload1,
                },
                {
                  num: 2,
                  url: claim.imageUrl2,
                  path: claim.imagePath2,
                  upload: fileUpload2,
                  setUpload: setFileUpload2,
                },
                {
                  num: 3,
                  url: claim.imageUrl3,
                  path: claim.imagePath3,
                  upload: fileUpload3,
                  setUpload: setFileUpload3,
                },
              ].map((imageObj) => (
                <ClaimEditAttached
                  key={imageObj.num}
                  claim={claim}
                  imageObj={imageObj}
                  onFileUpload={onFileUpload}
                  onFileDelete={onFileDelete}
                />
              ))}

              <Box mt={9} fontSize="lg" fontWeight="semibold">
                完了日
              </Box>
              <Input
                type="date"
                p={2}
                mt={3}
                isDisabled={!isAuth(["isoOffice"]) && !isAuth(["isoBoss"])}
                {...register("completionDate")}
              />

              {isAuth(["isoOffice"]) && (
                <Flex my={10} justifyContent="center">
                  <Button colorScheme="red" onClick={() => deleteClaim(claim)}>
                    クレーム報告書を削除する
                  </Button>
                </Flex>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                w="full"
                mr={3}
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                閉じる
              </Button>
              <Button type="submit" w="full" mx={1} colorScheme="telegram">
                OK
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
