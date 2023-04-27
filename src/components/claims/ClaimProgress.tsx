import { Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { taskflow } from "../../../data";
import { Claim } from "../../../types";

type Props = {
  claim: Claim;
};

export const ClaimProgress: FC<Props> = ({ claim }) => {
  return (
    <Flex w={{ md: "750px" }} mx="auto" py={6} justifyContent="space-between">
      {taskflow.map((task, index) => (
        <Flex
          key={task.id}
          w="full"
          py={3}
          px={1}
          justifyContent="center"
          alignItems="center"
          color="white"
          fontSize="xs"
          borderLeft="1px"
          borderLeftRadius={index === 0 ? 6 : 0}
          borderRightRadius={index === taskflow.length - 1 ? 6 : 0}
          bg={task.id === Number(claim.status) ? "#ffc107" : "gray"}
        >
          {task.status}
        </Flex>
      ))}
    </Flex>
  );
};
