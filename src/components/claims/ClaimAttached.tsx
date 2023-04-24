import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  imageUrl: string;
};

const ClaimAttached: NextPage<Props> = ({ imageUrl }) => {
  return (
    <>
      {imageUrl && (
        <Box mt={9} p={6} boxShadow='xs'>
          <a href={imageUrl} target='_blank' rel='noreferrer'>
            <img src={imageUrl} alt='画像' width='100%' height='100%' />
          </a>
        </Box>
      )}
    </>
  );
};

export default ClaimAttached;
