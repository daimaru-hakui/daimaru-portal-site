import { Box, Input } from '@chakra-ui/react';
import React from 'react';

const ClaimsInputCustomer = ({
  customer,
  setCustomer,
  occurrenceDate,
  setOccurrenceDate,
}: any) => {
  return (
    <>
      <Box>
        <Box mt={10} fontSize='lg' fontWeight='semibold'>
          顧客名
          <Box as='span' color='red'>
            （必須）
          </Box>
        </Box>
        <Input
          type='text'
          w='100%'
          p={2}
          mt={3}
          placeholder='顧客名を入力'
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </Box>
      <Box>
        <Box mt={9} fontSize='lg' fontWeight='semibold'>
          発生日
          <Box as='span' color='red'>
            （必須）
          </Box>
        </Box>
        <Input
          type='date'
          w='100%'
          p={2}
          mt={3}
          value={occurrenceDate}
          onChange={(e) => setOccurrenceDate(e.target.value)}
        />
      </Box>
    </>
  );
};

export default ClaimsInputCustomer;
