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
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { AlcoholCheckData } from "../../../types";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDisp } from "@/hooks/useDisp";

const AlcoholId = () => {
  const users = useAuthStore((state) => state.users);
  const [notUsers, setNotUsers] = useState<string[]>([]);
  const [posts, setPosts] = useState<AlcoholCheckData[]>([]);
  const router = useRouter();
  const queryId = router.query.id;
  const { getUserName } = useDisp();

  //アルコールチェックデータを取得
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckData");
    const q = query(collectionRef, where("date", "==", `${queryId}`));
    getDocs(q).then((querySnapshot) => {
      setPosts(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as AlcoholCheckData)
        )
      );
    });
  }, [queryId]);

  //未入力者一覧
  useEffect(() => {
    const newPosts = posts.map((post) => {
      return post.uid;
    });
    const newUsers = users
      .map((user) => {
        return user.uid;
      })
      .filter((user) => {
        if (!newPosts?.includes(user)) return user;
      });
    setNotUsers(newUsers);
  }, [users, posts]);

  return (
    <Flex flexDirection={"column"} alignItems={"center"}>
      <TableContainer bg="white" borderRadius={6} p={6} mt={2}>
        <Link href="/alcohol-checker">
          <Button w="100%">一覧へ戻る</Button>
        </Link>
        <Flex justifyContent="space-between" mt={6}>
          <Box fontSize="lg">{queryId}</Box>
        </Flex>
        <Table size="sm" mt={6}>
          <Thead>
            <Tr>
              <Th minW="160px">名前</Th>
              <Th minW="50px">アルコールの検査</Th>
              <Th minW="50px">酒気帯び</Th>
              <Th minW="150px">提出時刻</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts?.map((post) => (
              <Tr key={post.id}>
                <Td>{getUserName(post.uid)}</Td>
                <Td>{Number(post.alcoholCheck1) === 1 ? "済み" : "未"}</Td>
                <Td>{Number(post.alcoholCheck2) === 1 ? "なし" : "あり"}</Td>
                <Td>{post?.createdAt?.toDate().toLocaleTimeString("en-US")}</Td>
              </Tr>
            ))}
            {notUsers.map((notUser) => (
              <Tr key={notUser}>
                <Td>{getUserName(notUser)}</Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default AlcoholId;
