import { Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { HeaderMenuList } from "./HeaderMenuList";
import { useAuthStore } from "../../store/useAuthStore";

export const Header: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  return (
    <>
      {currentUser && (
        <Flex
          w="100%"
          h="60px"
          px={6}
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          boxShadow="sm"
          position="sticky"
          top={0}
          zIndex={100}
        >
          <Flex alignItems="center">
            <Link href="/">
              <Text fontSize="large" fontWeight="bold">
                社内用ポータルサイト
              </Text>
            </Link>
          </Flex>
          <Flex alignItems="center">
            <HeaderMenuList />
            <HeaderMenuButton />
          </Flex>
        </Flex>
      )}
    </>
  );
};
