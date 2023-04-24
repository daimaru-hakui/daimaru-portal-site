import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState, FC } from "react";
import { useRecoilValue } from "recoil";
import { usersState } from "../../../store";
import { Request, User } from "../../../types";

type Props = {
  request: Request;
};

export const RecruitmentMemberList: FC<Props> = ({ request }) => {
  const [usersfilter, setUsersfilter] = useState<User[]>([]);
  const users = useRecoilValue(usersState);

  useEffect(() => {
    const userList = users.filter((user: User) => {
      if (!user.uid) return;
      if (request.member.includes(user.uid)) {
        return user.name;
      }
    });
    setUsersfilter(userList);
  }, [request.member, users]);

  return (
    <>
      <Flex wrap="wrap" rounded="md" color="white" fontSize="sm" gap={2}>
        {usersfilter.map((user: User, index: number) => (
          <Box key={index} p={1} rounded="md" bg={"gray.500"}>
            {user.name}
          </Box>
        ))}
      </Flex>
    </>
  );
};
