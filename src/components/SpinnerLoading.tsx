import { Flex, Spinner } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { spinnerAtom } from '../../store';

const SpinnerLoading: NextPage = () => {
  const spinner = useRecoilValue(spinnerAtom);
  return (
    <>
      {spinner && (
        <Flex
          position='fixed'
          width='100%'
          height='100vh'
          justifyContent='center'
          alignItems='center'
          zIndex={100000}
        >
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
            position='absolute'
            zIndex={1000000}
            style={{ transform: 'translate(-50%,-50%)' }}
          />
        </Flex>
      )}
    </>
  );
};

export default SpinnerLoading;
