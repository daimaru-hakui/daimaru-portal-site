import { Flex, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import { useLoadingStore } from "../../store/useLoadingStore";

const SpinnerLoading: NextPage = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);
  return (
    <>
      {isLoading && (
        <Flex
          position="fixed"
          width="full"
          height="100vh"
          justifyContent="center"
          alignItems="center"
          zIndex={100000}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            position="absolute"
            zIndex={1000000}
            style={{ transform: "translate(-50%,-50%)" }}
          />
        </Flex>
      )}
    </>
  );
};

export default SpinnerLoading;
