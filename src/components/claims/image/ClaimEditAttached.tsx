/* eslint-disable @next/next/no-img-element */
import { Box, Button, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { Claim } from "../../../../types";

type Props = {
  claim: Claim;
  imageObj: {
    num: number;
    url: string;
    path: string;
    upload: any;
    setUpload: Function;
  };
  onFileUpload: Function;
  onFileDelete: Function;
};

export const ClaimEditAttached: FC<Props> = ({
  claim,
  imageObj,
  onFileUpload,
  onFileDelete,
}) => {
  return (
    <Box>
      <Box w="full" mt={9}>
        {imageObj.url && (
          <Box mt={9} p={6} boxShadow="xs">
            <a href={imageObj.url} target="_blank" rel="noreferrer">
              <img src={imageObj.url} alt="画像" width="100%" height="100%" />
            </a>
          </Box>
        )}
      </Box>
      {imageObj.url ? (
        <Flex w="full" justifyContent="center">
          <Button
            mt={3}
            mx="auto"
            colorScheme="red"
            onClick={() => {
              onFileDelete(claim, imageObj.path, imageObj.num);
            }}
          >
            削除
          </Button>
        </Flex>
      ) : (
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
        >
          <Box w="full" p={3}>
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={(e) => {
                imageObj.setUpload(e.target.files);
              }}
            />
          </Box>
          {imageObj.upload && imageObj.upload.length == 1 && (
            <Flex w="full" p={3}>
              <Button
                mr={3}
                colorScheme="telegram"
                onClick={() =>
                  onFileUpload(claim, imageObj.upload, imageObj.num)
                }
              >
                アップロード
              </Button>
            </Flex>
          )}
        </Flex>
      )}
    </Box>
  );
};
