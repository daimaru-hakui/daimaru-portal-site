import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { RecruitmentPostList } from "@/components/recruitments/RecruitmentPostList";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";
import { RecruitmentForm } from "@/components/recruitments/RecruitmentForm";
import Link from "next/link";

const RecruitmentNew = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [requests, setRequests] = useState<Request[]>([]);
  const requestInputs = {
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
  };
  const [currentRequests, setCurrentRequests] = useState<Request[]>([]);

  //管理者用投稿リストを取得
  useEffect(() => {
    const requestsRef = collection(db, "requestList");
    const q = query(requestsRef, orderBy("sendAt", "desc"));
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

  //作成者用投稿リストを取得
  useEffect(() => {
    setCurrentRequests(
      requests.filter(
        (request: { author: string; }) => request.author === currentUser
      )
    );
  }, [currentUser, requests]);

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box w={{ base: "100%", md: "800px" }} p={6} bg="white" rounded="md">
        <Flex flexDirection="column" alignItems="center" p={0} w="100%">
          <Box minW="100%" my={6}>
            <Flex alignItems="center" justifyContent="space-between" mb={6}>
              <Heading>お手伝い依頼</Heading>
              <Link href="/">
                <Button>トップへ戻る</Button>
              </Link>
            </Flex>
            <RecruitmentForm pageType="new" requestInputs={requestInputs} />
          </Box>
        </Flex>
      </Box>
      <Box
        w={{ base: "100%", md: "800px" }}
        mt="6"
        p={3}
        bg="white"
        rounded="md"
      >
        <RecruitmentPostList requests={currentRequests} />
      </Box>
    </Flex>
  );
};

export default RecruitmentNew;
