import { Box, Button, Flex, Text, keyframes } from "@chakra-ui/react";
import {
  collection,
  endAt,
  onSnapshot,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClaimStore } from "../../../store/useClaimStore";
import { useUtils } from "@/hooks/useUtils";

const animationKeyframes = keyframes`
0% { background-color: yellow; }
50% { background-color: white; }
100% { background-color: yellow;  }
`;
const animation = `${animationKeyframes} 2s ease-in-out infinite`;

export const ClaimArea = () => {
  const claims = useClaimStore((state) => state.claims);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isAuth } = useUtils();
  const [claimCount, setClaimCount] = useState(0);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    let monthStr = "0" + month;
    monthStr.slice(-2);
    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-${lastDate.getDate()}`;
    const q = query(
      collection(db, "claimList"),
      orderBy("receptionDate"),
      startAt(startDate),
      endAt(endDate)
    );

    onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setClaimCount(count.length);
    });
  }, []);

  //【クレーム】各自クレーム処理件数
  const myClaimCount = () => {
    let sum = 0;
    claims.forEach((claim) => {
      if (
        claim.operator === currentUser ||
        (isAuth(["isoOffice"]) && claim.status === 0) ||
        (isAuth(["isoOffice"]) && claim.status === 2) ||
        (isAuth(["isoOffice"]) && claim.status === 4) ||
        (isAuth(["isoManager"]) && claim.status === 6) ||
        (isAuth(["isoTopManegment"]) && claim.status === 7)
      ) {
        sum++;
      }
    });
    if (sum === 0) return;
    return sum;
  };

  return (
    <>
      {myClaimCount() && (
        <Box boxShadow="xs" p="6" rounded="md" bg="white">
          <Flex
            gap={3}
            fontSize="md"
            flexDirection={{
              base: "column",
              md: "row",
              lg: "column",
              xl: "row",
            }}
          >
            <Box>
              クレーム報告書 未処理件数：
              <Box as="span" color="red" fontWeight="bold">
                {myClaimCount()}
              </Box>
              件
            </Box>
            <Box>
              <Link href="/claims">
                <Box
                  as="span"
                  p={2}
                  fontWeight="bold"
                  rounded="md"
                  textDecoration="underline"
                  animation={animation}
                >
                  クレーム報告書一覧
                </Box>
              </Link>
              を check してください。
            </Box>
          </Flex>
        </Box>
      )}
      <Flex
        w="full"
        p="6"
        alignItems="center"
        justifyContent={{ base: "flex-start", md: "space-between" }}
        flexDirection={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "column",
          "2xl": "row",
        }}
        gap={6}
        boxShadow="xs"
        rounded="md"
        bg="white"
      >
        <Flex fontSize="lg" alignItems="center">
          <Text>今月のクレーム報告件数:</Text>
          <Text fontSize="3xl" fontWeight="bold" mx={2} color="red">
            {claimCount}
          </Text>
          <Text>件</Text>
        </Flex>
        <Flex flex="1" flexDirection={{ base: "column", sm: "row" }} gap={6}>
          <Box w="full">
            <Link href="/claims/">
              <Button colorScheme="blue" variant="outline" w="100%">
                クレーム報告書一覧
              </Button>
            </Link>
          </Box>
          <Box w="full">
            <Link href="/claims/new">
              <Button colorScheme="blue" w="100%">
                クレーム報告書を作成
              </Button>
            </Link>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
