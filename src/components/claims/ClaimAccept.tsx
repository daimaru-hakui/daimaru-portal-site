import { useUtils } from "@/hooks/useUtils";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Claim } from "../../../types";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClaims } from "@/hooks/useClaims";

type Props = {
  claim: Claim;
};

type Inputs = {
  receptionNum: string;
  receptionDate: string;
};

export const ClaimAccept: FC<Props> = ({ claim }) => {
  const router = useRouter();
  const { isAuth } = useUtils();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { deleteClaim } = useClaims();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateClaimAccept(data, claim);
  };

  //クレーム報告書を受付、担当者に修正処置を依頼
  const updateClaimAccept = async (data: Inputs, claim: Claim) => {
    const docRef = doc(db, "claimList", claim.id);
    await updateDoc(docRef, {
      status: 1,
      receptionist: currentUser,
      receptionNum: data.receptionNum,
      receptionDate: data.receptionDate,
      stampOffice: currentUser,
      operator: claim.stampStaff, //作業者
    });
    router.push(`/claims`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Number(claim.status) === 0 && isAuth(["isoOffice"]) && (
        <>
          <Flex
            justifyContent="center"
            w="100%"
            mt={10}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Flex mr={{ base: "0", md: "5" }} alignItems="center">
              <Box fontSize="lg" fontWeight="semibold" minW="70px">
                受付NO
              </Box>
              <Input
                placeholder="例 4-001"
                {...register("receptionNum", { required: true })}
              />
            </Flex>
            <Flex alignItems="center" mt={{ base: "6", md: "0" }}>
              <Box fontSize="lg" fontWeight="semibold" minW="70px">
                受付日
              </Box>
              <Input
                type="date"
                {...register("receptionDate", { required: true })}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="center">
            <Button type="submit" mt={6} mr={3} colorScheme="blue">
              受け付ける
            </Button>
            <Button mt={6} colorScheme="red" onClick={() => deleteClaim(claim)}>
              削除する
            </Button>
          </Flex>
        </>
      )}
    </form>
  );
};
