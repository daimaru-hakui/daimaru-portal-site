import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  claim: {
    status: number;
    imagePath1: string;
    imagePath2: string;
    imagePath3: string;
  };
  queryId: string | string[] | undefined;
  enabledOffice: any;
  receptionNum: string;
  setReceptionNum: any;
  receptionDate: string;
  setReceptionDate: any;
  acceptClaim: any;
  deleteClaim: any;
};

const ClaimAccept: NextPage<Props> = ({
  claim,
  queryId,
  enabledOffice,
  receptionNum,
  setReceptionNum,
  receptionDate,
  setReceptionDate,
  acceptClaim,
  deleteClaim,
}) => {
  return (
    <>
      {Number(claim.status) === 0 && enabledOffice() && (
        <>
          <Flex
            justifyContent='center'
            w='100%'
            mt={10}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Flex mr={{ base: '0', md: '5' }} alignItems='center'>
              <Box fontSize='lg' fontWeight='semibold' minW='70px'>
                受付NO
              </Box>
              <Input
                type='text'
                placeholder='例 4-001'
                value={receptionNum}
                onChange={(e) => setReceptionNum(e.target.value)}
              />
            </Flex>
            <Flex alignItems='center' mt={{ base: '6', md: '0' }}>
              <Box fontSize='lg' fontWeight='semibold' minW='70px'>
                受付日
              </Box>
              <Input
                type='date'
                value={receptionDate}
                onChange={(e) => setReceptionDate(e.target.value)}
              />
            </Flex>
          </Flex>
          <Flex justifyContent='center'>
            <Button
              mt={6}
              mr={3}
              colorScheme='blue'
              onClick={() => {
                acceptClaim(queryId);
              }}
              disabled={receptionNum && receptionDate ? false : true}
            >
              受け付ける
            </Button>
            <Button
              mt={6}
              colorScheme='red'
              onClick={() =>
                deleteClaim(
                  queryId,
                  claim.imagePath1,
                  claim.imagePath2,
                  claim.imagePath3
                )
              }
            >
              削除する
            </Button>
          </Flex>
        </>
      )}
    </>
  );
};

export default ClaimAccept;
