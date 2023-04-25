import React, { FC } from "react";
import { Badge, Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Administrator } from "../../../data";
import { dayOfWeek, starLevel } from "../../../functions";
import { RecruitmentRegisterButton } from "./RecruitmentRegisterButton";
import { RecruitmentMemberList } from "./RecruitmentMemberList";
import { RecruitmentMenu } from "./RecruitmentMenu";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";

type Props = {
  request: Request;
};

export const RecruitmentPost: FC<Props> = ({ request }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);

  // 作成者を表示;
  const getAuthor = (authorId: string) => {
    const usersfilter = users.find((user) => user.uid === authorId);
    return usersfilter?.name || "";
  };

  // newラベルを表示(期限三日)
  const newLabel = (time: any) => {
    const currentDay = new Date();
    const requestDay = new Date(time);
    const difference = currentDay.getTime() - requestDay.getTime();
    const date = difference / 86400000;
    return date <= 3 ? true : false;
  };

  return (
    <Box w="100%" p={3}>
      <Flex justifyContent="space-between">
        <Flex flexDirection="column" width="100%">
          {newLabel(request?.sendAt?.toDate()) && (
            <Badge colorScheme="red" w="100px" textAlign="center" p={1}>
              New
            </Badge>
          )}
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl">{starLevel(request.level)}</Text>
            {/* メニューボタン  投稿者と管理者のみ表示*/}
            {(currentUser === request.author ||
              Administrator.includes(currentUser || "")) && (
              <RecruitmentMenu request={request} />
            )}
          </Flex>
          <Heading fontSize="xl" pb={6} mt={2}>
            {!request.display && "【募集終了】"}
            {request.title}
          </Heading>
          <Flex
            flexDirection={{
              base: "column",
              md: "row",
              lg: "column",
              "2xl": "row",
            }}
            fontSize="sm"
            gap={2}
          >
            <Text>
              【開始】{request.startDay}
              {request.startTime && `-${request.startTime}`}
              {dayOfWeek(request.startDay)}
            </Text>
            <Text>
              【終了】{request.endDay}
              {request.endTime && `-${request.endTime}`}
              {dayOfWeek(request.endDay)}
            </Text>
            <Text>
              【募集人数】{request.applicant}人{request.moreless}
            </Text>
          </Flex>
          <Flex flexDirection={{ base: "column", md: "row" }} fontSize="sm">
            <Text>【責任者】{request.person}</Text>
            {Administrator.includes(currentUser || "") && (
              <Text>【作成者】{getAuthor(request.author)}</Text>
            )}
          </Flex>
          <Text py={3} whiteSpace="pre-wrap" fontSize="sm">
            {request.content}
          </Text>
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap={3}
            py={3}
          >
            <Flex flexWrap="wrap">
              <RecruitmentMemberList request={request} />
            </Flex>
            <RecruitmentRegisterButton request={request} />
          </Flex>
        </Flex>
      </Flex>
      <Divider mb={3} />
    </Box>
  );
};
