import { Box, Button, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  imageUrl: string;
  imagePath: string;
  fileUpload: any;
  setFileUpload: any;
  onFileUpload: any;
  onFileDelete: any;
  num: number;
};

const ClaimEditAttached: NextPage<Props> = ({
  imageUrl,
  imagePath,
  fileUpload,
  setFileUpload,
  onFileUpload,
  onFileDelete,
  num,
}) => {
  return (
    <>
      <Box>
        <Box w='100%' mt={9}>
          {imageUrl && (
            <Box mt={9} p={6} boxShadow='xs'>
              <a href={imageUrl} target='_blank' rel='noreferrer'>
                <img src={imageUrl} alt='画像' width='100%' height='100%' />
              </a>
            </Box>
          )}
        </Box>

        {imageUrl ? (
          <Flex w={'100%'} justifyContent='center'>
            <Button
              mt={3}
              mx='auto'
              colorScheme='red'
              onClick={() => {
                onFileDelete(imagePath, num);
              }}
            >
              削除
            </Button>
          </Flex>
        ) : (
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems='center'
            justifyContent='center'
          >
            <Box w={'100%'} p={3}>
              <input
                type='file'
                accept='.png, .jpeg, .jpg'
                onChange={(e) => {
                  setFileUpload(e.target.files);
                }}
              />
            </Box>
            {fileUpload && fileUpload.length == 1 && (
              <Flex w={'100%'} p={3}>
                <Button
                  mr={3}
                  colorScheme='telegram'
                  onClick={() => onFileUpload(fileUpload, num)}
                >
                  アップロード
                </Button>
              </Flex>
            )}
          </Flex>
        )}
      </Box>
    </>
  );
};

export default ClaimEditAttached;
