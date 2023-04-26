import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ClaimInputAttached from "../../components/claims/new/ClaimInputAttached";
import { useAuthStore } from "../../../store/useAuthStore";
import { Claim, User } from "../../../types";
import { useDisp } from "@/hooks/useDisp";
import { useForm, SubmitHandler } from "react-hook-form";
import { claimSelectList2 } from "../../../data";
import { useLoadingStore } from "../../../store/useLoadingStore";

const ClaimNew = () => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [filterUsers, setFilterUsers] = useState<User[]>([]); //絞り込んだユーザー一覧リスト
  const { getUserName } = useDisp();
  const [fileUpload1, setFileUpload1] = useState<any>();
  const [fileUpload2, setFileUpload2] = useState<any>();
  const [fileUpload3, setFileUpload3] = useState<any>();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Claim>();
  const onSubmit: SubmitHandler<Claim> = (data) => {
    console.log(data);
    AddClaim(data);
  };

  const AddClaim = async (data: Claim) => {
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

  //ユーザーリストを取得
  useEffect(() => {
    setFilterUsers(users.filter((user) => user.isoSalesStaff === true));
  }, [users]);

  return (
    <Box
      w={{ base: "full", md: "700px" }}
      mx="auto"
      p={6}
      bg="white"
      rounded="md"
      boxShadow="md"
    >
      <Box textAlign="right">作成者：{getUserName(currentUser)}</Box>
      <Box
        as="h1"
        mt={6}
        fontSize="3xl"
        fontWeight="semibold"
        textAlign="center"
      >
        クレーム報告書
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={10} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            担当者名
          </FormLabel>
          <Select
            mt={2}
            placeholder="担当者を選択"
            {...register("stampStaff", { required: true })}
          >
            {filterUsers.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.name}
              </option>
            ))}
          </Select>
          {errors.stampStaff && (
            <Box color="red">※担当者を選択してください</Box>
          )}
        </FormControl>

        <FormControl mt={10} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            顧客名
          </FormLabel>
          <Input
            p={2}
            mt={3}
            placeholder="顧客名を入力"
            {...register("customer", { required: true })}
          />
        </FormControl>
        {errors.customer && <span>This field is required</span>}
        <FormControl isRequired>
          <FormLabel mt={9} fontSize="lg" fontWeight="semibold">
            発生日
          </FormLabel>
          <Input
            type="date"
            p={2}
            mt={3}
            {...register("occurrenceDate", { required: true })}
          />
        </FormControl>
        <FormControl mt={10} isRequired>
          <FormLabel as="h2" fontSize="lg" fontWeight="semibold">
            発生内容
          </FormLabel>
          <Box w="full" mt={6}>
            <RadioGroup
              colorScheme="blue"
              defaultValue="1"
              {...register("occurrenceSelect", { required: true })}
              onChange={getValues}
            >
              <Box mt={3}>①製品起因</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                <Radio value="1" {...register("occurrenceSelect")}>
                  製品不良
                </Radio>
                <Radio value="2" {...register("occurrenceSelect")}>
                  納品書
                </Radio>
                <Radio value="3" {...register("occurrenceSelect")}>
                  商品間違い
                </Radio>
                <Radio value="4" {...register("occurrenceSelect")}>
                  その他
                </Radio>
              </Stack>
              <Box mt={3}>②受発注</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                <Radio value="5" {...register("occurrenceSelect")}>
                  住所等
                </Radio>
                <Radio value="6" {...register("occurrenceSelect")}>
                  未納品
                </Radio>
                <Radio value="7" {...register("occurrenceSelect")}>
                  その他
                </Radio>
              </Stack>
              <Box mt={3}>③その他</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                <Radio value="8" {...register("occurrenceSelect")}>
                  その他
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </FormControl>
        <Textarea
          mt={3}
          p={2}
          placeholder="内容を入力"
          {...register("occurrenceContent")}
        />

        <FormControl mt={10}>
          <FormLabel as="h2" fontSize="lg" fontWeight="semibold">
            修正処置
          </FormLabel>
          <Box mt={3}>
            <RadioGroup
              colorScheme="blue"
              {...register("amendmentSelect")}
              onChange={getValues}
            >
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList2.map((list) => (
                  <Radio
                    key={list.id}
                    value={list.id}
                    {...register("amendmentSelect")}
                  >
                    {list.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Textarea
              mt={3}
              p={2}
              placeholder="内容を入力"
              {...register("amendmentContent")}
            />
          </Box>
        </FormControl>

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
        <Box mt={12} textAlign="center">
          <Button
            type="submit"
            colorScheme="blue"
            // disabled={
            //   customer &&
            //   occurrenceDate &&
            //   occurrenceSelect &&
            //   occurrenceContent &&
            //   stampStaff
            //     ? false
            //     : true
            // }
          >
            提出する
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ClaimNew;
