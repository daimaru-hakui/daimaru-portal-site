import { Box, Button, Flex, Select } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { Claim, User } from "../../../../types";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { taskflow } from "../../../../data";
import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

type Props = {
  claim: Claim;
};

type Inputs = {
  selectTask: number;
  selectUser: string;
};

export const ClaimSelectSendButton: FC<Props> = ({ claim }) => {
  const users = useAuthStore((state) => state.users);
  const router = useRouter();
  const [isoManagerUsers, setIsoManagereUsers] = useState<User[]>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<User[]>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<User[]>([]);
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    switchStatus(data, claim.id);
  };

  useEffect(() => {
    //ISOマネージャーのリスト
    setIsoManagereUsers(
      users.filter((user) => {
        return user.isoManager === true;
      })
    );
    //ISO 上司のリスト
    setIsoBossUsers(
      users.filter((user) => {
        return user.isoBoss === true;
      })
    );
    //ISO トップマネジメントのリスト
    setIsoTopManegmentUsers(
      users.filter((user) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 事務局のリスト
    setIsoOfficeUsers(
      users.filter((user) => {
        return user.isoOffice === true;
      })
    );
  }, [users]);

  //クレーム報告書のステータスを変更
  const switchStatus = async (data: Inputs, id: string) => {
    const docRef = doc(db, "claimList", id);
    await updateDoc(docRef, {
      status: Number(data.selectTask),
      operator: data.selectUser,
    });
    router.push("/claims");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mt={12}>
        <Box mx="auto" textAlign="center">
          タスクと送信先を選択して送信してください。
        </Box>
        <Flex
          mt={2}
          gap={3}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="center"
        >
          <Select
            w={{ base: "full", md: "48" }}
            placeholder="タスクを選択"
            {...register("selectTask", { required: true })}
          >
            {taskflow.map(
              (task) =>
                0 < task.id &&
                task.id < 8 && (
                  <option key={task.id} value={task.id}>
                    {task.status}
                  </option>
                )
            )}
          </Select>
          <Select
            w={{ base: "full", md: "48" }}
            placeholder="送信先を選択"
            {...register("selectUser", { required: true })}
          >
            {Number(watch("selectTask")) <= 4 &&
              users.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {Number(watch("selectTask")) === 5 &&
              isoBossUsers.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {Number(watch("selectTask")) === 6 &&
              isoManagerUsers.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {Number(watch("selectTask")) === 7 &&
              isoTopManegmentUsers.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
          </Select>

          <Button
            type="submit"
            disabled={watch("selectTask") && watch("selectUser") ? false : true}
          >
            送信する
          </Button>
        </Flex>
      </Box>
    </form>
  );
};
