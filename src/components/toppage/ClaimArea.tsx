import { Box, Button, Flex, Text } from "@chakra-ui/react";
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
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { claimsState, usersState } from "../../../store";
import { useAuthStore } from "../../../store/useAuthStore";

const ClaimArea = () => {
  const claims = useRecoilValue(claimsState);
  const users = useRecoilValue(usersState);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [claimCount, setClaimCount] = useState(0);
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagerUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

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
      const count = snapshot.docs.map((doc: any) => ({ ...doc.data() }));
      setClaimCount(count.length);
    });
  }, []);

  //【クレーム】各自クレーム処理件数
  const myClaimCount = () => {
    let sum = 0;
    claims.forEach((claim: any) => {
      if (
        claim.operator == currentUser ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(0)) ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(2)) ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(4)) ||
        (searchUsers(isoManagerUsers).includes(currentUser) &&
          claim.status === Number(6)) ||
        (searchUsers(isoTopManegmentUsers).includes(currentUser) &&
          claim.status === Number(7))
      ) {
        sum++;
      }
    });
    if (sum === 0) return;
    return sum;
  };

  //各リストを取得
  useEffect(() => {
    //ISO 事務局のリスト(オブジェクト）
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
    //ISOマネージャーのリスト(オブジェクト）
    setIsoManagerUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO トップマネジメントのリスト(オブジェクト）
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 上司のリスト(オブジェクト）
  }, [users]);

  //【クレーム】iso（事務局・管理者・TM）のオブジェクトからuidのみ取り出して配列にする
  const searchUsers = (array: { uid: string | undefined }[]) => {
    const newUsers = array.map((user: { uid: string | undefined }) => {
      return user.uid;
    });
    return newUsers;
  };

  // 点滅
  // let label: any = document.getElementById("classLabel");
  // label?.animate(
  //   {
  //     background: ["white", "#ffce00"],
  //   },
  //   {
  //     iterations: Infinity,
  //     duration: 1000,
  //   }
  // );

  return (
    <>
      {myClaimCount() && (
        <Box width="100%" boxShadow="xs" p="6" rounded="md" bg="white">
          <Flex
            fontSize="md"
            mt="1"
            ml="1"
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
              件{" 　"}
            </Box>
            <Box>
              <Link href="/claims">
                <Text
                  as="span"
                  p={2}
                  fontWeight="bold"
                  rounded="md"
                  textDecoration="underline"
                  id="classLabel"
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  クレーム報告書一覧
                </Text>
              </Link>
              を check してください。
            </Box>
          </Flex>
        </Box>
      )}
      <Flex
        width="100%"
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
        <Flex w={{ base: "auto" }} fontSize="lg" alignItems="center">
          <Text>今月のクレーム報告件数:</Text>
          <Text fontSize="3xl" fontWeight="bold" mx={2} color="red">
            {claimCount}
          </Text>
          <Text>件</Text>
        </Flex>
        <Flex flex="1" flexDirection={{ base: "column", sm: "row" }} gap={6}>
          <Box w={{ base: "100%" }}>
            <Link href="/claims/">
              <Button colorScheme="blue" variant="outline" w="100%">
                クレーム報告書一覧
              </Button>
            </Link>
          </Box>
          <Box w="100%">
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

export default ClaimArea;
