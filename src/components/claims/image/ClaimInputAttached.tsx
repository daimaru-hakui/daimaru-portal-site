import { Box } from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  fileUpload: any;
  setFileUpload: Function;
};

export const ClaimInputAttached: FC<Props> = ({
  fileUpload,
  setFileUpload,
}) => {
  return (
    <>
      <Box mt={3}>
        {fileUpload && fileUpload.length === 1 && (
          <Box mt={6}>
            <img src={window.URL.createObjectURL(fileUpload[0])} width="100%" />
          </Box>
        )}
      </Box>
      <Box mt={3}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFileUpload(e.target.files)}
        />
      </Box>
    </>
  );
};
