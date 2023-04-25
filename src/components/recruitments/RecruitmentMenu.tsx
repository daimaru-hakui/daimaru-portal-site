import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { FC } from "react";
import { db } from "../../../firebase";
import { Administrator } from "../../../data";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";
import { RecruitmentEditModal } from "./RecruitmentEditModal";
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = {
  request: Request;
};

export const RecruitmentMenu: FC<Props> = ({ request }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  //リクエストを表示・非表示
  const isDisplayRequestToggle = async (uid: string, display: boolean) => {
    let result = display ? true : false;
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      display: !result,
    });
  };

  //募集を再開・停止
  const isRecruitmentToggle = async (uid: string, recruitment: boolean) => {
    let result = recruitment ? true : false;
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      recruitment: !result,
    });
  };

  const deleteRequest = async (id: string) => {
    const result = window.confirm("削除してよろしいでしょうか？");
    if (!result) return;
    try {
      const docRef = doc(db, "requestList", `${id}`);
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="MenuButton"
        icon={<BsThreeDotsVertical />}
        variant="outline"
      />
      <MenuList>
        {request.display === true && (
          <RecruitmentEditModal request={request} />
        )}
        <MenuItem onClick={() => isDisplayRequestToggle(request.id, request.display)}>
          {request.display ? "非表示" : "表示"}</MenuItem>
        <MenuItem onClick={() => isRecruitmentToggle(request.id, request.recruitment)}>
          {request.recruitment ? "募集を終了" : "募集を再開"}
        </MenuItem>
        {Administrator.includes(currentUser || "") && (
          <MenuItem onClick={() => deleteRequest(request.id)}>削除</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
