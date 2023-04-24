import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { db } from "../../../firebase";

type Props = {
  progress: any;
  pageTitle: string;
  items: { title: string; startDate: string; endDate: string; contents: {}[] };
  setItems: Function;
};

const ProgressInpuArea: NextPage<Props> = ({
  progress,
  pageTitle,
  items,
  setItems,
}) => {
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleInputsChange = (e: any, rowIndex: number) => {
    const value = e.target.value;
    const name = e.target.name;
    setItems(() => {
      let newArray: any = [];
      newArray = items.contents.map((content: any, index) =>
        index === rowIndex ? { ...content, [name]: value } : content
      );
      return { ...items, contents: [...newArray] };
    });
  };

  const handleSwitchChange = (bool: boolean, rowIndex: number) => {
    const value = bool ? false : true;
    setItems(() => {
      let newArray: any = [];
      newArray = items.contents.map((content: any, index) =>
        index === rowIndex ? { ...content, result: value } : content
      );
      return { ...items, contents: [...newArray] };
    });
  };

  const deleteTitle = (rowIndex: number) => {
    setItems(() => {
      let newArray = [];
      newArray = items.contents.filter((content: any, index: number) =>
        index === rowIndex ? false : true
      );
      return {
        ...items,
        contents: [...(newArray || "")],
      };
    });
  };

  const addTitle = () => {
    setItems(() => ({
      ...items,
      contents: [...(items?.contents || ""), { title: "", result: false }],
    }));
  };
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Box fontSize="2xl">{pageTitle}</Box>
        <Link href="/progress">
          <Button size="sm">戻る</Button>
        </Link>
      </Flex>
      <Stack mt={12} spacing={6}>
        <Box>
          <Text>タイトル</Text>
          <Input
            type="text"
            name="title"
            value={items.title}
            onChange={handleInputChange}
          />
        </Box>
        <Flex gap={6}>
          <Box w="100%">
            <Text>開始日</Text>
            <Input
              type="date"
              name="startDate"
              value={items.startDate}
              onChange={handleInputChange}
            />
          </Box>
          <Box w="100%">
            <Text>終了日</Text>
            <Input
              type="date"
              name="endDate"
              value={items.endDate}
              onChange={handleInputChange}
            />
          </Box>
        </Flex>
        <Box>
          <Flex>
            <Text w="100%">項目</Text>
            <Text w="80px">達成</Text>
            <Text w="50px">削除</Text>
          </Flex>
          {items?.contents?.map((content: any, index) => (
            <Flex key={index} mt={2} gap={6} w="100%" alignItems="center">
              <Input
                w="100%"
                type="text"
                name="title"
                value={content.title}
                onChange={(e) => handleInputsChange(e, index)}
              />
              <Box w="80px" textAlign="center">
                <Switch
                  id={content.title}
                  value={content.result}
                  isChecked={content.result}
                  onChange={() => handleSwitchChange(content.result, index)}
                />
              </Box>
              <Box w="50px" textAlign="center">
                <FaTrashAlt
                  cursor="pointer"
                  onClick={() => deleteTitle(index)}
                />
              </Box>
            </Flex>
          ))}
          <Button w={36} mt={2} onClick={addTitle}>
            <FaPlusCircle />
            <Box ml={2} as="span">
              項目を追加
            </Box>
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default ProgressInpuArea;
