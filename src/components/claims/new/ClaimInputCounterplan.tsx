import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { claimSelectList3 } from "../../../../data";

const ClaimInputCounterplan = ({
  counterplanSelect,
  setCounterplanSelect,
  counterplanContent,
  setCounterplanContent,
}: any) => {
  return (
    <>
      <Box mt={9}>
        <Flex as="h2" fontSize="lg" fontWeight="semibold">
          対策
        </Flex>
        <Box w="100%" mt={3}>
          <RadioGroup
            colorScheme="green"
            defaultValue="1"
            value={counterplanSelect}
            onChange={(e) => setCounterplanSelect(e)}
          >
            <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
              {claimSelectList3.map((list) => (
                <Radio key={list.id} value={list.id}>
                  {list.title}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          <Textarea
            mt={3}
            p={2}
            w="100%"
            placeholder="内容を入力"
            value={counterplanContent}
            onChange={(e) => setCounterplanContent(e.target.value)}
          />
        </Box>
      </Box>
    </>
  );
};

export default ClaimInputCounterplan;
