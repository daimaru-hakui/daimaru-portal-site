/* eslint-disable @next/next/no-img-element */
import { Box } from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  imageUrl: string;
};

export const ClaimAttached: FC<Props> = ({ imageUrl }) => {
  return (
    <>
      {imageUrl && (
        <Box mt={9} p={6} boxShadow="xs">
          <a href={imageUrl} target="_blank" rel="noreferrer">
            <img src={imageUrl} alt="画像" width="100%" height="100%" />
          </a>
        </Box>
      )}
    </>
  );
};
