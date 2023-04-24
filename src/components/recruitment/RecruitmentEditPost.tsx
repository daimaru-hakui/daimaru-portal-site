import {
  Button,
  Divider,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Textarea,
  NumberInputStepper,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect, FC } from "react";
import { db } from "../../../firebase";
import { dateTime } from "../../../functions";
import { Request } from "../../../types";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {
  request: Request;
  setEdit: Function;
};

export const RecruitmentEditPost: FC<Props> = ({ request, setEdit }) => {
  const [inputs, setInputs] = useState<Request>();
  const [initValues, setInitValues] = useState<Request>();
  const requestId = request.id;
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Request>();
  const onSubmit: SubmitHandler<Request> = (data) => console.log(data);

  // 編集用inputに初期値を入力
  useEffect(() => {
    const obj = {
      title: request.title,
      startDay: request.startDay,
      startTime: request.startTime,
      endDay: request.endDay,
      endTime: request.endTime,
      applicant: request.applicant,
      person: request.person,
      moreless: request.moreless,
      level: request.level,
      content: request.content,
    } as Request;
    setInputs(obj);
    setInitValues(obj);
  }, [request]);

  //編集を確定する
  const confirm = async () => {
    const docRef = doc(db, "requestList", `${requestId}`);
    await updateDoc(docRef, {
      title: inputs?.title,
      startDay: inputs?.startDay || "未定",
      startTime: inputs?.startTime,
      endDay: inputs?.endDay || "未定",
      endTime: inputs?.endTime,
      applicant: inputs?.applicant,
      person: inputs?.person,
      moreless: inputs?.moreless,
      level: inputs?.level,
      content: inputs?.content,
    });
    setEdit(false);
  };

  // 編集をキャンセルする;
  const cancel = () => {
    setInputs(initValues as Request);
    setEdit(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Input
          w="100%"
          placeholder="タイトル"
          fontSize="md"
          {...register("title")}
        />
        <Flex gap={3}>
          <Input
            id="startDay"
            type="date"
            placeholder="開始時刻"
            {...register("startDay")}
          />
          <Select placeholder="---" {...register("startTime")}>
            {dateTime.map((d, index) => (
              <option key={index} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex gap={3}>
          <Input
            id="endDay"
            type="date"
            placeholder="終了時刻"
            {...register("endDay")}
          />
          <Select placeholder="---" {...register("endTime")}>
            {dateTime.map((d, index) => (
              <option key={index} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex gap={3}>
          <Input
            id="person"
            type="string"
            placeholder="タスク責任者"
            {...register("person")}
          />
          <Select placeholder="---" {...register("level")}>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </Select>
        </Flex>
        <Flex gap={3}>
          <NumberInput
            flex={1}
            placeholder="募集人数"
            {...register("applicant")}
            min={0}
            max={100}
            onChange={getValues}
            // onChange={(e) => handleNumberChange(e, "applicant")}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select flex={1} placeholder="---" {...register("moreless")}>
            <option value="以上">以上</option>
            <option value="まで">まで</option>
          </Select>
        </Flex>
        <Textarea
          h={48}
          fontSize="sm"
          whiteSpace="pre-wrap"
          {...register("content")}
        >
          {inputs?.content}
        </Textarea>
        <Flex gap={3}>
          <Button flex={1} colorScheme="blue" onClick={confirm}>
            OK
          </Button>
          <Button flex={1} colorScheme="red" onClick={cancel}>
            キャンセル
          </Button>
        </Flex>
        <Divider mb={3} />
      </Stack>
    </form>
  );
};
