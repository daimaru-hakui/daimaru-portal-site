import React, { FC } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useDisp } from "@/hooks/useDisp";
import { Claim } from "../../../types";

type Props = {
  claim: Claim;
};

export const ClaimStampArea: FC<Props> = ({ claim }) => {
  const { getUserName } = useDisp();
  const stampList = [
    {
      id: 0,
      title: "記入者",
      uid: claim.author,
    },
    {
      id: 1,
      title: "担当者",
      uid: claim.stampStaff,
    },
    {
      id: 2,
      title: "事務局",
      uid: claim.stampOffice,
    },
    {
      id: 3,
      title: "対策記入者",
      uid: claim.stampCounterplan,
    },
    {
      id: 4,
      title: "常務・部長",
      uid: claim.stampBoss,
    },
    {
      id: 5,
      title: "管理者",
      uid: claim.stampManager,
    },
    {
      id: 6,
      title: "TM",
      uid: claim.stampTm,
    },
  ];
  return (
    <Box
      w={{ md: "750px" }}
      mt={2}
      p={2}
      mx="auto"
      bg="white"
      rounded="md"
      boxShadow="md"
    >
      <Flex
        justifyContent="space-around"
        flexDirection={{ base: "column-reverse", md: "row" }}
      >
        {stampList.map(({ id, title, uid }) => (
          <Box key={id} textAlign="center">
            <Box fontSize="xs">{title}</Box>
            <Box py={2} color="red" fontWeight="bold">
              {getUserName(uid)}
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
