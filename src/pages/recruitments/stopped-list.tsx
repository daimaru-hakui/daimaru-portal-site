import { RecruitmentPostList } from "@/components/recruitments/RecruitmentPostList";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { Request } from "../../../types";
import Link from "next/link";

const StoppedList = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const requestsRef = collection(db, "requestList");
    const q = query(
      requestsRef,
      orderBy("createdAt", "desc"),
      where("display", "==", false)
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
    <Flex flexDirection="column" alignItems="center">
      <Box w={{ base: "100%", md: "800px" }} p={6} bg="white" rounded="md">
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
              【募集終了】お手伝い依頼一覧
            </Text>
          </Flex>
          <Flex gap={3} p={3}>
            <Link href="/">
              <Button>トップページへ</Button>
            </Link>
          </Flex>
        </Flex>
        <RecruitmentPostList requests={requests} />
      </Box>
    </Flex>
  );
};

export default StoppedList;
