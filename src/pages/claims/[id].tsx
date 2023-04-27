/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import { useUtils } from "@/hooks/useUtils";
import { NextPage } from "next";
import { Claim } from "../../../types";

import { ClaimSelectSendButton } from "@/components/claims/button/ClaimSelectSendButton";
import { ClaimReport } from "@/components/claims/ClaimReport";
import { ClaimConfirmSendButton } from "@/components/claims/button/ClaimConfirmSendButton";
import { ClaimEditButton } from "@/components/claims/button/ClaimEditButton";
import { ClaimProgress } from "@/components/claims/ClaimProgress";
import { ClaimMessage } from "@/components/claims/ClaimMessage";
import { ClaimStampArea } from "@/components/claims/ClaimStampArea";
import { ClaimAccept } from "@/components/claims/ClaimAccept";
import { ClaimNextPrev } from "@/components/claims/ClaimNextPrev";

const ClaimId: NextPage = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const { isAuth } = useUtils();
  const [claim, setClaim] = useState<Claim>();

  useEffect(() => {
    onSnapshot(doc(db, "claimList", `${queryId}`), (doc) => {
      setClaim({ ...doc.data(), id: doc.id } as Claim);
    });
  }, [queryId]);

  return (
    <>
      {claim && (
        <Box position="relative">
          <ClaimNextPrev claim={claim} />
          <ClaimMessage claim={claim} />
          <ClaimProgress claim={claim} />
          <ClaimEditButton claim={claim} />

          <Box
            w={{ md: "750px" }}
            mx="auto"
            p={6}
            bg="white"
            rounded="md"
            boxShadow="md"
          >
            <ClaimReport claim={claim} />

            <ClaimAccept claim={claim} />

            <ClaimConfirmSendButton claim={claim} />

            {Number(claim.status) !== 0 && isAuth(["isoOffice"]) && (
              <ClaimSelectSendButton claim={claim} />
            )}
          </Box>
          <ClaimStampArea claim={claim} />
          <ClaimEditButton claim={claim} />
        </Box>
      )}
    </>
  );
};

export default ClaimId;
