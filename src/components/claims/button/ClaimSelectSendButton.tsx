import { Box, Button, Flex, Select } from "@chakra-ui/react";
import React, { FC } from "react";
import { Claim } from "../../../../types";
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateClaimStatus(data, claim);
  };

  //クレーム報告書のステータスを変更
  const updateClaimStatus = async (data: Inputs, claim: Claim) => {
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: Number(data.selectTask),
      operator: data.selectUser,
    });
    router.push("/claims");
  };

  const selectUsers = () => (
    users.map((user) => (
      <option key={user.uid} value={user.uid}>
        {user.name}
      </option>
    ))
  );

  const filterSelectUsers = (prop: string) => (
    users.filter((user: any) => (
      user[prop] === true
    )).map((user) => (
      <option key={user.uid} value={user.uid}>
        {user.name}
      </option>
    ))
  );

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
          <Box>
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
            <Box color="red" fontSize="xs">{errors.selectTask && "※タスクを選択してください"}</Box>
          </Box>

          <Box>

            <Select
              w={{ base: "full", md: "48" }}
              placeholder="送信先を選択"
              {...register("selectUser", { required: true })}
            >
              {Number(watch("selectTask")) <= 4 &&
                selectUsers()
              }
              {Number(watch("selectTask")) === 5 &&
                filterSelectUsers('isoBoss')
              }
              {Number(watch("selectTask")) === 6 &&
                filterSelectUsers('isoManager')
              }
              {Number(watch("selectTask")) === 7 &&
                filterSelectUsers('isoTopManegment')
              }
            </Select>
            <Box color="red" fontSize="xs">{errors.selectUser && "※送信先を選択"}</Box>
          </Box>

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
