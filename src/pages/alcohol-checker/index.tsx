import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { AlcoholCheckList } from "../../../types";

const Alcohol = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const [posts, setPosts] = useState<AlcoholCheckList[]>([]);

  //アルコールチェッカーリスト
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckList");
    const q = query(collectionRef, orderBy("id", "desc"), limit(60));
    try {
      getDocs(q).then((querySnapshot) => {
        setPosts(
          querySnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              } as AlcoholCheckList)
          )
        );
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  //アルコールチェッカー権限者
  const userAuthority = (userId: string) => {
    const newUsers = users.map((user) => {
      if (user.alcoholChecker == true) {
        return user.uid;
      }
    });
    return newUsers.includes(userId);
  };

  return (
    <>
      {userAuthority(currentUser || "") && (
        <Flex flexDirection="column" alignItems="center">
          <TableContainer backgroundColor="white" borderRadius={6} p={6}>
            <Box as="h1" fontSize="lg">
              アルコールチェック一覧
            </Box>

            <Table size="sm" mt={6}>
              <Thead>
                <Tr>
                  <Th minW="130x">日付</Th>
                  <Th minW="50px">提出者</Th>
                  <Th minW="50px">未提出者</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {posts?.map((post) => (
                  <Tr key={post.id}>
                    <Td>{post.id}</Td>
                    <Td>{post.member.length}名</Td>
                    <Td>{users.length - post.member.length}名</Td>
                    <Td>
                      <Link href={`alcohol-checker/${post.id}`}>
                        <Button size="xs">詳細</Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      )}
    </>
  );
};

export default Alcohol;
