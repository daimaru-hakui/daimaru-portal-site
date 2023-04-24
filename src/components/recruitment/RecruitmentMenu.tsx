import { DragHandleIcon } from "@chakra-ui/icons";
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

interface Props {
  request: Request;
  edit: boolean;
  setEdit: Function;
}

export const RecruitmentMenu: FC<Props> = ({ request, edit, setEdit }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  //リクエストを非表示
  const hideRequest = async (uid: string) => {
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      display: false,
    });
  };

  //リクエストを表示
  const displayRequest = async (uid: string) => {
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      display: true,
    });
  };

  //募集を停止
  const isRecruitmentFalse = async (uid: string) => {
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      recruitment: false,
    });
  };

  //募集を再開
  const isRecruitmentTrue = async (uid: string) => {
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      recruitment: true,
    });
  };

  //リクエストを削除
  const deleteAt = async (uid: string) => {
    const result = window.confirm("削除してよろしいでしょうか？");
    if (!result) return;
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      deleteAt: true,
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
        aria-label="Options"
        icon={<DragHandleIcon />}
        variant="outline"
      />
      <MenuList>
        {request.display === true && (
          <MenuItem
            onClick={() => {
              setEdit(!edit);
            }}
          >
            編集
          </MenuItem>
        )}
        <>
          {request.display === true ? (
            <MenuItem onClick={() => hideRequest(request.id)}>非表示</MenuItem>
          ) : (
            <MenuItem onClick={() => displayRequest(request.id)}>表示</MenuItem>
          )}

          {request.recruitment ? (
            <MenuItem onClick={() => isRecruitmentFalse(request.id)}>
              募集を終了
            </MenuItem>
          ) : (
            <MenuItem onClick={() => isRecruitmentTrue(request.id)}>
              募集を再開
            </MenuItem>
          )}
        </>
        {Administrator.includes(currentUser || "") && (
          <MenuItem onClick={() => deleteRequest(request.id)}>削除</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
