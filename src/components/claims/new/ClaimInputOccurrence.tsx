import { Box, Radio, RadioGroup, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

const ClaimInputOccurrence = ({
  occurrenceSelect,
  setOccurrenceSelect,
  occurrenceContent,
  setOccurrenceContent,
}: any) => {
  return (
    <>
      <Box mt={10}>
        <Box as='h2' fontSize='lg' fontWeight='semibold'>
          発生内容
          <Box as='span' color='red'>
            （必須）
          </Box>
        </Box>

        <Box w='100%' mt={6}>
          <RadioGroup
            colorScheme='green'
            value={occurrenceSelect}
            onChange={(e) => setOccurrenceSelect(e)}
          >
            <Box mt={3}>①製品起因</Box>
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              <Radio value='1'>製品不良</Radio>
              <Radio value='2'>納品書</Radio>
              <Radio value='3'>商品間違い</Radio>
              <Radio value='4'>その他</Radio>
            </Stack>
            <Box mt={3}>②受発注</Box>
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              <Radio value='5'>住所等</Radio>
              <Radio value='6'>未納品</Radio>
              <Radio value='7'>その他</Radio>
            </Stack>
            <Box mt={3}>③その他</Box>
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              <Radio value='8'>その他</Radio>
            </Stack>
          </RadioGroup>
        </Box>

        <Textarea
          mt={3}
          p={2}
          w='100%'
          placeholder='内容を入力'
          value={occurrenceContent}
          onChange={(e) => setOccurrenceContent(e.target.value)}
        />
      </Box>
    </>
  );
};

export default ClaimInputOccurrence;
