/* eslint-disable react/display-name */
import React, { FC } from "react";
import { Box } from "@chakra-ui/react";
import { RecruitmentPost } from "./RecruitmentPost";
import { Request } from "../../../types";

type Props = {
  requests: Request[];
};

export const RecruitmentPostList: FC<Props> = ({ requests }) => {
  return (
    <>
      {requests.map((request) => (
        <Box key={request.id} w="100%">
          <RecruitmentPost request={request} />
        </Box>
      ))}
    </>
  );
};
