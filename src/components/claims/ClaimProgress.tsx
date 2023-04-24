import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import { taskflow } from "../../../data";
import { ClaimProps } from "../../../types/ClaimProps";

const ClaimProgress: NextPage<ClaimProps> = ({ claim }) => {
  return (
    <Flex
      w={{ base: "100%", md: "750px" }}
      mx="auto"
      py={6}
      justifyContent="space-between"
    >
      {taskflow.map((task, index) => (
        <Flex
          key={task.id}
          justifyContent="center"
          alignItems="center"
          py={3}
          px={1}
          w={"100%"}
          borderLeft="1px"
          borderLeftRadius={index === 0 ? 6 : 0}
          borderRightRadius={index === taskflow.length - 1 ? 6 : 0}
          backgroundColor={
            task.id === Number(claim.status) ? "#ffc107" : "gray"
          }
          color="white"
          fontSize="xs"
        >
          {task.status}
        </Flex>
      ))}
    </Flex>
  );
};

export default ClaimProgress;
