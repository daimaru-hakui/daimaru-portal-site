import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import { AdminEditModal } from "../../components/admin/AdminEditModal";
import { useAuthStore } from "../../../store/useAuthStore";
import { User } from "../../../types";

const Admin = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);

  //権限
  const isAuthority = async (user: any, prop: string) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      let toggle = user[prop] === true ? false : true;
      await updateDoc(docRef, {
        [prop]: toggle,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const buttonEL = (user: User & any, prop: string) => (
    <Button
      size="xs"
      onClick={() => isAuthority(user, prop)}
      colorScheme={user[prop] ? "blue" : "gray"}
    >
      {user[prop] ? "有効" : "無効"}
    </Button>
  );

  return (
    <>
      {Administrator.includes(currentUser || "") && (
        <Box
          p={6}
          mx="auto"
          w={{ base: "100%", md: "1000px" }}
          bg="white"
          rounded="md"
        >
          <Box as="h1" fontSize="4xl">
            管理者設定画面
          </Box>
          <Box mt={12}>
            <Text as="h2" fontSize="2xl">
              権限設定
            </Text>
            <Box p={6}>
              <TableContainer>
                <Table size="sm" width="full">
                  <Thead>
                    <Tr>
                      <Th>id</Th>
                      <Th>名前</Th>
                      <Th>ISO TM</Th>
                      <Th>ISO 管理者</Th>
                      <Th>ISO 上長</Th>
                      <Th>ISO 事務局</Th>
                      <Th>営業・販売</Th>
                      <Th>ALチェック管理</Th>
                      <Th>編集</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user.uid}>
                        <Td>{user?.rank}</Td>
                        <Td>{user.name}</Td>
                        <Td>{buttonEL(user, "isoTopManegment")}</Td>
                        <Td>{buttonEL(user, "isoManager")}</Td>
                        <Td>{buttonEL(user, "isoBoss")}</Td>
                        <Td>{buttonEL(user, "isoOffice")}</Td>
                        <Td>{buttonEL(user, "isoSalesStaff")}</Td>
                        <Td>{buttonEL(user, "alcoholChecker")}</Td>
                        <Td>
                          <AdminEditModal user={user} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Admin;
