import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Button, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { RecruitmentPostList } from "../recruitments/RecruitmentPostList";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useRecoilState } from "recoil";
import { Request } from "../../../types";
import { requestsState } from "../../../store";

const RecruitmentArea = () => {
  const [requests, setRequests] = useRecoilState<Request[]>(requestsState); //リクエスト一覧リスト

  //掲載中（表示）案件
  useEffect(() => {
    const requestsCollectionRef = collection(db, "requestList");
    const q = query(
      requestsCollectionRef,
      where("display", "==", true),
      orderBy("sendAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map(
          (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as Request)
        )
      );
    });
  }, [setRequests]);

  return (
    <Box p={{ base: 3, md: 6 }} boxShadow="xs" rounded="md" bg="white">
      <Flex
        mb={3}
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "row",
        }}
      >
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={3}
        >
          <Text fontSize="2xl" mr="3">
            お手伝い依頼一覧
          </Text>
        </Flex>
        <Flex gap={3} p={3}>
          <Link href="/recruitments/stopped-list"><Button>掲載終了一覧</Button></Link>
          <Link href="/recruitments/new">
            <Button colorScheme="blue">お手伝い依頼を作成</Button>
          </Link>
        </Flex>
      </Flex>
      <RecruitmentPostList requests={requests} />
    </Box>
  );
};

export default RecruitmentArea;
