import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";

type Props = {
  fileUpload: any;
  setFileUpload: any;
};

const ClaimInputAttached: NextPage<Props> = ({ fileUpload, setFileUpload }) => {
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

export default ClaimInputAttached;
