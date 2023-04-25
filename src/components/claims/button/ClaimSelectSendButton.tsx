import { Box, Button, Flex, Select, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { User } from "../../../../types";

type Props = {
  queryId: string | string[] | undefined;
  users: User[];
  selectUser: string;
  setSelectUser: any;
  selectTask: number;
  setSelectTask: any;
  taskflow: { id: number; status: string }[];
  switchStatus: any;
};

const ClaimSelectSendButton: NextPage<Props> = ({
  queryId,
  users,
  selectUser,
  setSelectUser,
  selectTask,
  setSelectTask,
  taskflow,
  switchStatus,
}) => {
  const [isoManagerUsers, setIsoManagereUsers] = useState<any>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);

  useEffect(() => {
    //ISOマネージャーのリスト
    setIsoManagereUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO 上司のリスト
    setIsoBossUsers(
      users.filter((user: any) => {
        return user.isoBoss === true;
      })
    );
    //ISO トップマネジメントのリスト
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 事務局のリスト
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
  }, [users]);

  return (
    <>
      <Box mt={12}>
        <Text w="100%" mx="auto" textAlign="center">
          タスクと送信先を選択して送信してください。
        </Text>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={"center"}
          mt={2}
        >
          <Flex mt={2}>
            <Select
              value={selectTask}
              onChange={(e) => setSelectTask(e.target.value)}
              placeholder="タスクを選択"
              w={48}
              mr={2}
            >
              {taskflow.map(
                (task: { id: number; status: string }) =>
                  0 < task.id &&
                  task.id < 8 && (
                    <option key={task.id} value={task.id}>
                      {task.status}
                    </option>
                  )
              )}
            </Select>

            <Select
              value={selectUser}
              onChange={(e) => setSelectUser(e.target.value)}
              placeholder="送信先を選択"
              w={48}
              mr={2}
            >
              {Number(selectTask) <= 4 &&
                users.map((user: { uid: string; name: string }) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              {selectTask == 5 &&
                isoBossUsers.map((user: { uid: string; name: string }) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              {selectTask == 6 &&
                isoManagerUsers.map((user: { uid: string; name: string }) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              {selectTask == 7 &&
                isoTopManegmentUsers.map(
                  (user: { uid: string; name: string }) => (
                    <option key={user.uid} value={user.uid}>
                      {user.name}
                    </option>
                  )
                )}
            </Select>
          </Flex>
          <Button
            mt={2}
            onClick={() => switchStatus(queryId)}
            disabled={selectTask && selectUser ? false : true}
          >
            送信する
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default ClaimSelectSendButton;
