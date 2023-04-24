import React, { FC } from "react";
import { Button } from "@chakra-ui/react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";

type Props = {
  request: Request;
};

export const RecruitmentButton: FC<Props> = ({ request }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  //参加する
  const addRequest = async (id: string) => {
    const docRef = doc(db, "requestList", id);
    await updateDoc(docRef, {
      member: arrayUnion(currentUser),
    });
  };

  //参加を取り消す
  const removeRequest = async (id: string) => {
    const docRef = doc(db, "requestList", id);
    await updateDoc(docRef, {
      member: arrayRemove(currentUser),
    });
  };

  return (
    <>
      {request.recruitment && (
        <Button
          mt={{ base: "10px", md: "0" }}
          color="white"
          fontSize={{ base: "sm" }}
          bg={request.member.includes(currentUser || "") ? "#17a6ca" : "orange"}
          _focus={{ outline: "none" }}
          _hover={{
            bg: request.member.includes(currentUser || "")
              ? "#17a6ca"
              : "orange",
          }}
          onClick={() => {
            request.member.includes(currentUser || "")
              ? removeRequest(request.id)
              : addRequest(request.id);
          }}
        >
          {request.member.includes(currentUser || "")
            ? "参加を取り消す"
            : "参加する"}
        </Button>
      )}
    </>
  );
};
