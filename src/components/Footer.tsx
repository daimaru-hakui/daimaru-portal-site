import { Box, Flex } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Flex
      as="footer"
      alignItems="center"
      justifyContent="center"
      p={6}
      borderTop="1px"
      borderColor="#eaeaea"
    >
      &copy; daimaru-hakui
    </Flex>
  );
};

export default Footer;
