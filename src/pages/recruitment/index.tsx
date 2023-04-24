import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { RecruitmentPostList } from "@/components/recruitment/RecruitmentPostList";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";
import { RecruitmentForm } from "@/components/recruitment/RecruitmentForm";

const Recruitment = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [requests, setRequests] = useState<Request[]>([]);
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
        (request: { author: string }) => request.author === currentUser
      )
    );
  }, [currentUser, requests]);

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box w={{ base: "100%", md: "800px" }} p={6} bg="white" rounded="md">
        <RecruitmentForm />
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

export default Recruitment;
