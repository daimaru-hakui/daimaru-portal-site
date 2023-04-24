import { Box, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import { ClaimProps } from "../../../types/ClaimProps";

const ClaimStampArea: NextPage<ClaimProps> = ({ claim, users }) => {
  return (
    <>
      <Box
        w={{ base: "100%", md: "750px" }}
        mt={2}
        p={2}
        mx="auto"
        backgroundColor="white"
        borderRadius={6}
      >
        <Flex
          justifyContent="space-around"
          flexDirection={{ base: "column-reverse", md: "row" }}
        >
          <Box textAlign="center">
            <Box fontSize="xs">記入者</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.author &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.author && user.name
                )}
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="xs">担当者</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.stampStaff &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampStaff && user.name
                )}
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="xs">事務局</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.stampOffice &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampOffice && user.name
                )}
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="xs">対策記入者</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.stampOffice &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampCounterplan && user.name
                )}
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="xs">常務・部長</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.stampBoss &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampBoss && user.name
                )}
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="xs">管理者</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.stampManager &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampManager && user.name
                )}
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="xs">TM</Box>
            <Box py={2} color="red" fontWeight="bold">
              {claim.stampTm &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampTm && user.name
                )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ClaimStampArea;
