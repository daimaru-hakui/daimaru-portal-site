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
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { NextPage } from "next";
import React from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from "../../../data";
import { db, storage } from "../../../firebase";
import { ClaimStateProps } from "../../../types/ClaimStateProps";
import ClaimEditAttached from "./ClaimEditAttached";

const ClaimEditReport: NextPage<ClaimStateProps> = ({
  queryId,
  customer,
  setCustomer,
  occurrenceDate,
  setOccurrenceDate,
  occurrenceSelect,
  setOccurrenceSelect,
  occurrenceContent,
  setOccurrenceContent,
  amendmentSelect,
  setAmendmentSelect,
  amendmentContent,
  setAmendmentContent,
  counterplanSelect,
  setCounterplanSelect,
  counterplanContent,
  setCounterplanContent,
  receptionNum,
  setReceptionNum,
  receptionDate,
  setReceptionDate,
  completionDate,
  causeDepartmentSelect,
  setCauseDepartmentSelect,
  setCompletionDate,
  enabledOffice,
  enabledAuthor,
  enabledStaff,
  enabledCounterplan,
  enabledBoss,
  fileUpload1,
  fileUpload2,
  fileUpload3,
  setFileUpload1,
  setFileUpload2,
  setFileUpload3,
  imageUrl1,
  imageUrl2,
  imageUrl3,
  setImageUrl1,
  setImageUrl2,
  setImageUrl3,
  imagePath1,
  imagePath2,
  imagePath3,
  setImagePath1,
  setImagePath2,
  setImagePath3,
  deleteClaim,
}) => {
  //添付ファイルをアップロード
  const onFileUpload = (fileUpload: any, num: number) => {
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
      `images/claims/${queryId}/${fileUpload[0].name}`
    );
    uploadBytes(storageRef, file).then((snapshot: any) => {
      getDownloadURL(
        ref(storage, `images/claims/${queryId}/${fileUpload[0].name}`)
      ).then((url) => {
        const docRef = doc(db, "claimList", `${queryId}`);
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
  const onFileDelete = (imagePath: string, num: number) => {
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
    const docRef = doc(db, "claimList", `${queryId}`);
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
      {/* 受付NO. 受付日 */}
      <Box>
        <Box mt={10} fontSize="lg" fontWeight="semibold">
          受付NO
        </Box>
        <Input
          type="text"
          w="100%"
          p={2}
          mt={3}
          placeholder="受付ナンバー 例 4-001"
          value={receptionNum}
          disabled={!enabledOffice()}
          onChange={(e) => setReceptionNum(e.target.value)}
        />
      </Box>
      <Box>
        <Box mt={9} fontSize="lg" fontWeight="semibold">
          受付日
        </Box>
        <Input
          type="date"
          w="100%"
          p={2}
          mt={3}
          value={receptionDate}
          disabled={!enabledOffice()}
          onChange={(e) => setReceptionDate(e.target.value)}
        />
      </Box>

      {/* 顧客名 */}
      <Box>
        <Box mt={10} fontSize="lg" fontWeight="semibold">
          顧客名
        </Box>
        <Input
          type="text"
          w="100%"
          p={2}
          mt={3}
          placeholder="顧客名を入力"
          value={customer}
          disabled={!enabledOffice()}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </Box>

      <Box>
        <Box mt={9} fontSize="lg" fontWeight="semibold">
          発生日
        </Box>

        <Input
          type="date"
          w="100%"
          p={2}
          mt={3}
          value={occurrenceDate}
          disabled={!enabledOffice()}
          onChange={(e) => setOccurrenceDate(e.target.value)}
        />
      </Box>

      {/* 発生内容 */}
      <Box mt={10}>
        <Box as="h2" fontSize="lg" fontWeight="semibold">
          発生内容
        </Box>
        <Box w="100%" mt={6}>
          <RadioGroup
            colorScheme="green"
            value={occurrenceSelect}
            onChange={(e) => setOccurrenceSelect(e)}
          >
            <Box mt={3}>①製品起因</Box>
            <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
              {claimSelectList1.map(
                (list, index) =>
                  index <= 3 && (
                    <Radio
                      key={list.id}
                      value={list.id}
                      isDisabled={!enabledAuthor() && !enabledOffice()}
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
                      isDisabled={!enabledAuthor() && !enabledOffice()}
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
                      isDisabled={!enabledAuthor() && !enabledOffice()}
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
          w="100%"
          placeholder="内容を入力"
          value={occurrenceContent}
          isDisabled={!enabledAuthor() && !enabledOffice()}
          onChange={(e) => setOccurrenceContent(e.target.value)}
        />
      </Box>

      {/*修正処置 */}
      <Box mt={10}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          修正処置
        </Flex>
        <Box w="100%" mt={3}>
          <RadioGroup
            colorScheme="green"
            defaultValue="1"
            value={amendmentSelect}
            onChange={(e) => setAmendmentSelect(e)}
          >
            <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
              {claimSelectList2.map((list) => (
                <Radio
                  key={list.id}
                  value={list.id}
                  isDisabled={!enabledStaff() && !enabledOffice()}
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
          w="100%"
          placeholder="内容を入力"
          value={amendmentContent}
          disabled={!enabledStaff() && !enabledOffice()}
          onChange={(e) => setAmendmentContent(e.target.value)}
        />
      </Box>

      {/* 起因部署 */}
      <Box mt={9}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          起因部署
        </Flex>
        <Box w="100%" mt={3}>
          <RadioGroup
            colorScheme="green"
            value={causeDepartmentSelect}
            onChange={(e) => setCauseDepartmentSelect(e)}
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
                      isDisabled={!enabledStaff() && !enabledOffice()}
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
                      isDisabled={!enabledStaff() && !enabledOffice()}
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
        <Box w="100%" mt={3}>
          <RadioGroup
            colorScheme="green"
            defaultValue="1"
            value={counterplanSelect}
            onChange={(e) => setCounterplanSelect(e)}
          >
            <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
              {claimSelectList3.map((list) => (
                <Radio
                  key={list.id}
                  value={list.id}
                  isDisabled={
                    !enabledBoss() && !enabledCounterplan() && !enabledOffice()
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
              w="100%"
              placeholder="内容を入力"
              value={counterplanContent}
              disabled={!enabledCounterplan() && !enabledOffice()}
              onChange={(e) => setCounterplanContent(e.target.value)}
            />
          </Box>
        </Box>
      </Box>

      {/* 添付書類 */}
      <Box mt={9}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          添付書類（※画像形式 jpeg jpg png）
        </Flex>
        <ClaimEditAttached
          imageUrl={imageUrl1}
          imagePath={imagePath1}
          fileUpload={fileUpload1}
          setFileUpload={setFileUpload1}
          onFileUpload={onFileUpload}
          onFileDelete={onFileDelete}
          num={1}
        />
        <ClaimEditAttached
          imageUrl={imageUrl2}
          imagePath={imagePath2}
          fileUpload={fileUpload2}
          setFileUpload={setFileUpload2}
          onFileUpload={onFileUpload}
          onFileDelete={onFileDelete}
          num={2}
        />
        <ClaimEditAttached
          imageUrl={imageUrl3}
          imagePath={imagePath3}
          fileUpload={fileUpload3}
          setFileUpload={setFileUpload3}
          onFileUpload={onFileUpload}
          onFileDelete={onFileDelete}
          num={3}
        />
      </Box>

      {/* 完了日 */}
      <Box>
        <Box mt={9} fontSize="lg" fontWeight="semibold">
          完了日
        </Box>
        <Input
          type="date"
          w="100%"
          p={2}
          mt={3}
          value={completionDate}
          disabled={!enabledBoss() && enabledOffice()}
          onChange={(e) => setCompletionDate(e.target.value)}
        />
      </Box>

      {/* 削除ボタン */}
      {enabledOffice() && (
        <Flex justifyContent="center">
          <Button
            mt={12}
            colorScheme="red"
            onClick={() =>
              deleteClaim(queryId, imagePath1, imagePath2, imagePath3)
            }
          >
            クレーム報告書を削除する
          </Button>
        </Flex>
      )}
    </>
  );
};

export default ClaimEditReport;
