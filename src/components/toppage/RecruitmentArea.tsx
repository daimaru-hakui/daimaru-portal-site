import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { RecruitmentPostList } from "../recruitments/RecruitmentPostList";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Request } from "../../../types";

export const RecruitmentArea: FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  useEffect(() => {
    const requestsRef = collection(db, "requestList");
    const q = query(
      requestsRef,
      orderBy("createdAt", "desc"),
      where("display", "==", true)
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
  }, []);

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
          <Link href="/recruitments/stopped-list">
            <Button>掲載終了一覧</Button>
          </Link>
          <Link href="/recruitments/new">
            <Button colorScheme="blue">お手伝い依頼を作成</Button>
          </Link>
        </Flex>
      </Flex>
      <RecruitmentPostList requests={requests} />
    </Box>
  );
};
