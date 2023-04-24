import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Button, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { RecruitmentPostList } from "../recruitment/RecruitmentPostList";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useRecoilState } from "recoil";
import { hideRequestsState, requestsState } from "../../../store";
import { Request } from "../../../types";

const RecruitmentArea = () => {
  const [requests, setRequests] = useRecoilState<Request[]>(requestsState); //リクエスト一覧リスト
  const [hideRequests, setHideRequests] =
    useRecoilState<any>(hideRequestsState); //リクエスト一覧リスト
  const [display, setDisplay] = useState<boolean>(true);

  //掲載中（表示）案件
  useEffect(() => {
    const requestsCollectionRef = collection(db, "requestList");
    const q = query(
      requestsCollectionRef,
      where("display", "==", true),
      orderBy("sendAt", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
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
    return unsub;
  }, [setRequests]);

  //終了（非表示）案件
  useEffect(() => {
    const requestCollectionRef = collection(db, "requestList");
    const q = query(
      requestCollectionRef,
      where("display", "==", false),
      orderBy("sendAt", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setHideRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, [setHideRequests]);
  const isDisplay = () => {
    setDisplay(true);
  };
  const isHide = () => {
    setDisplay(false);
  };
  return (
    <Box p={{ base: 3, md: 6 }} boxShadow="xs" rounded="md" bg="white">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "row",
        }}
        mb={3}
      >
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={3}
        >
          <Text fontSize="2xl" mr="3">
            お手伝い依頼一覧
          </Text>
          <Tabs size="sm" variant="soft-rounded" colorScheme="gray">
            <TabList>
              <Tab onClick={isDisplay} _focus={{ outline: "none" }}>
                掲載中
              </Tab>
              <Tab onClick={isHide} _focus={{ outline: "none" }}>
                掲載終了
              </Tab>
            </TabList>
          </Tabs>
        </Flex>
        <Box p={3}>
          <Link href="/recruitment">
            <Button colorScheme="blue">お手伝い依頼を作成</Button>
          </Link>
        </Box>
      </Flex>
      {display ? (
        <RecruitmentPostList requests={requests} />
      ) : (
        <RecruitmentPostList requests={hideRequests} />
      )}
    </Box>
  );
};

export default RecruitmentArea;
