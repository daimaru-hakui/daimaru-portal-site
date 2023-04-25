import React, { FC } from "react";
import Link from "next/link";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { RecruitmentPostList } from "../recruitments/RecruitmentPostList";
import { useRecruitmentStore } from "../../../store/useRecruitmentStore";

export const RecruitmentArea: FC = () => {
  const requests = useRecruitmentStore((state) => state.requests);

  return (
    <Box p={{ base: 3, md: 6 }} boxShadow="xs" rounded="md" bg="white">
      <Flex
        mb={3}
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "row",
        }}
      >
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={3}
        >
          <Text fontSize="2xl" mr="3">
            お手伝い依頼一覧
          </Text>
        </Flex>
        <Flex gap={3} p={3}>
          <Link href="/recruitments/stopped-list">
            <Button>掲載終了一覧</Button>
          </Link>
          <Link href="/recruitments/new">
            <Button colorScheme="blue">お手伝い依頼を作成</Button>
          </Link>
        </Flex>
      </Flex>
      <RecruitmentPostList requests={requests} />
    </Box>
  );
};
