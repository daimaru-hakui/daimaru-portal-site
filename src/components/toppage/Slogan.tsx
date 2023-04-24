import { Box, Text } from "@chakra-ui/react";
import type { NextPage } from "next";

const Slogan: NextPage = () => {
  return (
    <Box
      width="100%"
      boxShadow="xs"
      p={{ base: 3, md: 6 }}
      rounded="md"
      bg="white"
    >
      <Text fontSize="2xl" mt="1" ml="1">
        スローガン
      </Text>

      <Box my="3" lineHeight={6}>
        <Text>
          ①
          <Box as="span" color="red">
            売上予算
          </Box>
          及び
          <Box as="span" color="red">
            利益予算
          </Box>
          に対し常に
          <Box as="span" color="red">
            最新かつ正確な現状を把握
          </Box>
          する
        </Text>
        <Text mt={2}>
          ②目標達成に伴う
          <Box as="span" color="red">
            問題・課題を即分析し解決に向け全力で行動
          </Box>
          する
        </Text>
        <Text mt={2}>
          ③
          <Box as="span" color="red">
            情報
          </Box>
          の伝達・共有は相手に伝わったかを
          <Box as="span" color="red">
            何度も何度も確認
          </Box>
          する
        </Text>
      </Box>
    </Box>
  );
};

export default Slogan;
