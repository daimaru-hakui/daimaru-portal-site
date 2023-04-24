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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import AdminEditModal from "../../components/admin/AdminEditModal";
import { useAuthStore } from "../../../store/useAuthStore";

const Admin = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [usersRegisterList, setUsersRegisterList] = useState<any>([]);

  //権限
  const isAuthority = async (user: any, prop: string) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      let toggle;
      if (user[prop] && user[prop] === true) {
        toggle = false;
      } else {
        toggle = true;
      }
      await updateDoc(docRef, {
        [prop]: toggle,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //firestore authority 情報の取得
  useEffect(() => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setUsersRegisterList(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  return (
    <>
      {Administrator.includes(currentUser || "") && (
        <Box
          p={6}
          mx="auto"
          w={{ base: "100%", md: "1200px" }}
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
                <Table size="sm" width={"100%"}>
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
                    {usersRegisterList.map(
                      (user: {
                        uid: string;
                        name: string;
                        isoTopManegment: boolean;
                        isoManager: boolean;
                        isoBoss: boolean;
                        isoOffice: boolean;
                        isoSalesStaff: boolean;
                        alcoholChecker: boolean;
                        rank: number;
                      }) => (
                        <Tr key={user.uid}>
                          <Td>{user?.rank}</Td>
                          <Td>{user.name}</Td>
                          <Td>
                            {user.isoTopManegment ? (
                              <Button
                                size="xs"
                                onClick={() =>
                                  isAuthority(user, "isoTopManegment")
                                }
                                colorScheme="blue"
                              >
                                有効
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() =>
                                  isAuthority(user, "isoTopManegment")
                                }
                              >
                                無効
                              </Button>
                            )}
                          </Td>
                          <Td>
                            {user.isoManager ? (
                              <Button
                                size="xs"
                                onClick={() => isAuthority(user, "isoManager")}
                                colorScheme="blue"
                              >
                                有効
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() => isAuthority(user, "isoManager")}
                              >
                                無効
                              </Button>
                            )}
                          </Td>
                          <Td>
                            {user.isoBoss ? (
                              <Button
                                size="xs"
                                onClick={() => isAuthority(user, "isoBoss")}
                                colorScheme="blue"
                              >
                                有効
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() => isAuthority(user, "isoBoss")}
                              >
                                無効
                              </Button>
                            )}
                          </Td>
                          <Td>
                            {user.isoOffice ? (
                              <Button
                                size="xs"
                                onClick={() => isAuthority(user, "isoOffice")}
                                colorScheme="blue"
                              >
                                有効
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() => isAuthority(user, "isoOffice")}
                              >
                                無効
                              </Button>
                            )}
                          </Td>
                          <Td>
                            {user.isoSalesStaff ? (
                              <Button
                                size="xs"
                                onClick={() =>
                                  isAuthority(user, "isoSalesStaff")
                                }
                                colorScheme="blue"
                              >
                                有効
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() =>
                                  isAuthority(user, "isoSalesStaff")
                                }
                              >
                                無効
                              </Button>
                            )}
                          </Td>
                          <Td>
                            {user.alcoholChecker ? (
                              <Button
                                size="xs"
                                onClick={() =>
                                  isAuthority(user, "alcoholChecker")
                                }
                                colorScheme="blue"
                              >
                                有効
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() =>
                                  isAuthority(user, "alcoholChecker")
                                }
                              >
                                無効
                              </Button>
                            )}
                          </Td>
                          <Td>
                            <AdminEditModal uid={user.uid} />
                          </Td>
                        </Tr>
                      )
                    )}
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
