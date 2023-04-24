import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { db } from "../../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUtils } from "@/hooks/useUtils";
import { useForm, SubmitHandler } from "react-hook-form";
import { Request } from "../../../types";

export const RecruitmentForm: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { dateTime } = useUtils();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Request>({
    defaultValues: {
      title: "",
      startDay: "",
      startTime: "",
      endDay: "",
      endTime: "",
      applicant: "1",
      person: "",
      moreless: "",
      level: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<Request> = (data) => {
    addRequest(data);
  };

  const addRequest = async (data: Request) => {
    try {
      await addDoc(collection(db, "requestList"), {
        title: data.title,
        startDay: data.startDay,
        startTime: data.startTime,
        endDay: data.endDay,
        endTime: data.endTime,
        applicant: data.applicant,
        person: data.person,
        moreless: data.moreless,
        level: data.level,
        content: data.content,
        member: [],
        display: true,
        editAt: false,
        sendAt: serverTimestamp(),
        author: currentUser,
        recruitment: true,
      });
      router.push("/");
      reset();
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
    }
  };
  const validate = () => {
    return watch("title") && watch("content") && watch("person") ? false : true;
  };

  return (
    <Flex flexDirection="column" alignItems="center" p={0} w="100%">
      <Box minW="100%" my={6}>
        <Flex alignItems="center" justifyContent="space-between" mb={6}>
          <Heading>お手伝い依頼</Heading>
          <Link href="/">
            <Button>トップへ戻る</Button>
          </Link>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel htmlFor="title">タイトル</FormLabel>
            <Input
              id="title"
              placeholder="タイトルを入力してください。"
              mb={6}
              {...register("title")}
            />
            <Flex flexDirection={{ base: "column", md: "row" }}>
              <Flex flex={1}>
                <Box flex={1} mr={1}>
                  <FormLabel htmlFor="startDay">開始時刻</FormLabel>
                  <Input
                    id="startDay"
                    type="date"
                    placeholder="開始時刻"
                    mb={6}
                    {...register("startDay")}
                  />
                </Box>
                <Box flex={1} mr={{ base: "0", md: 1 }}>
                  <FormLabel htmlFor="startTime">　</FormLabel>
                  <Select placeholder="---" {...register("startTime")}>
                    {dateTime.map((d, index) => (
                      <option key={index} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
              <Flex flex={1}>
                <Box flex={1} mr={1}>
                  <FormLabel htmlFor="endDay">終了時刻</FormLabel>
                  <Input
                    id="endDay"
                    type="date"
                    placeholder="終了時刻"
                    mb={6}
                    {...register("endDay")}
                  />
                </Box>
                <Box flex={1} mr={{ base: "0", md: 1 }}>
                  <FormLabel htmlFor="endTime">　</FormLabel>
                  <Select placeholder="---" {...register("endTime")}>
                    {dateTime.map((d, index) => (
                      <option key={index} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
            </Flex>
            <Flex flexDirection={{ base: "column", md: "row" }}>
              <Flex flex={1}>
                <Box flex={1} mr={1}>
                  <FormLabel htmlFor="person">タスク責任者</FormLabel>
                  <Input
                    id="person"
                    placeholder="タスク責任者"
                    mb={6}
                    {...register("person")}
                  />
                </Box>
                <Box flex={1} mr={{ base: "0", md: 1 }}>
                  <FormLabel htmlFor="level">レベル</FormLabel>
                  <Select placeholder="---" {...register("level")}>
                    <option value="3">★★★</option>
                    <option value="2">★★</option>
                    <option value="1">★</option>
                  </Select>
                </Box>
              </Flex>
              <Flex flex={1}>
                <Box flex={1} mr={1} mb={{ base: 6, md: "0" }}>
                  <FormLabel htmlFor="applicant">募集人数</FormLabel>
                  <NumberInput
                    placeholder="募集人数"
                    {...register("applicant")}
                    min={0}
                    max={100}
                    onChange={getValues}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
                <Box flex={1}>
                  <FormLabel htmlFor="moreless">　</FormLabel>
                  <Select placeholder="---" {...register("moreless")}>
                    <option value="以上">以上</option>
                    <option value="まで">まで</option>
                  </Select>
                </Box>
              </Flex>
            </Flex>
            <FormLabel htmlFor="content">内容</FormLabel>
            <Textarea
              id="content"
              placeholder="内容を入力してください。"
              mb={6}
              h={48}
              {...register("content")}
            />
          </FormControl>
          <Button
            type="submit"
            width="100%"
            rounded="md"
            colorScheme="blue"
            isDisabled={validate()}
          >
            登録
          </Button>
        </form>
      </Box>
    </Flex>
  );
};
