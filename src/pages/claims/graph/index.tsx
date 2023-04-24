import {
  Box,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  claimSelectList1,
  claimSelectList3,
  claimSelectList4,
} from "../../../../data";
import { auth, db } from "../../../../firebase";
import { beginningDate, todayDate } from "../../../../functions";
import PieChart from "../../../components/claims/chart/PieChart";

const GraphClaim = () => {
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト
  const [startAtDate, setStartAtDate] = useState(beginningDate());
  const [endAtDate, setEndAtDate] = useState(todayDate());

  //クレーム一覧を取得
  useEffect(() => {
    const claimsCollectionRef = collection(db, "claimList");
    const q = query(
      claimsCollectionRef,
      orderBy("receptionDate"),
      startAt(startAtDate),
      endAt(endAtDate)
    );
    getDocs(q).then((querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [startAtDate, endAtDate]);

  const countClaims = (str: any, num: number) => {
    let count: string[] = [];
    claims.forEach((claim: any) => {
      if (Number(claim[str]) === num) count.push(claim[str]);
    });
    return count.length;
  };

  return (
    <Flex flexWrap="wrap" justifyContent="center">
      <Flex
        flexDirection="column"
        alignItems="center"
        w={{ base: "100%", lg: "45%" }}
        mx={{ base: 0, lg: 3 }}
        p={6}
        borderRadius={6}
        backgroundColor="white"
      >
        <Flex w="full" fontSize="xl">
          <Box mr="2" fontWeight="bold">
            集計期間 :
          </Box>
          <Box>クレーム数 {claims.length} 件</Box>
        </Flex>
        <Flex
          flexDirection={{ base: "column" }}
          mt={3}
          w="full"
          justifyContent="space-between"
        >
          <Box mt={6} mr={3} w={{ base: "100%" }}>
            <Box>開始日</Box>
            <Input
              type="date"
              value={startAtDate}
              onChange={(e) => setStartAtDate(e.target.value)}
              mt={3}
            />
          </Box>
          <Box mt={6} mr={3} w={{ base: "100%" }}>
            <Box>終了日</Box>
            <Input
              type="date"
              value={endAtDate}
              onChange={(e) => setEndAtDate(e.target.value)}
              mt={3}
            />
          </Box>
        </Flex>
      </Flex>

      {/* 起因部署 */}
      <Flex
        w={{ base: "100%", lg: "45%" }}
        mt={{ base: 6, lg: 0 }}
        mx={{ base: 0, lg: 3 }}
        p={6}
        backgroundColor="white"
        borderRadius={6}
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box w={{ base: "100%", lg: "30%" }}>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th fontSize="sm">■起因部署</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {claimSelectList4.map((list, index) => (
                  <Tr key={list.id}>
                    <Td>{list.title}</Td>
                    <Td>{countClaims("causeDepartmentSelect", index + 1)}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th fontSize="sm" py="2">
                    合計
                  </Th>
                  <Th fontSize="sm">
                    {countClaims("causeDepartmentSelect", 1) +
                      countClaims("causeDepartmentSelect", 2) +
                      countClaims("causeDepartmentSelect", 3) +
                      countClaims("causeDepartmentSelect", 4) +
                      countClaims("causeDepartmentSelect", 5) +
                      countClaims("causeDepartmentSelect", 6) +
                      countClaims("causeDepartmentSelect", 7) +
                      countClaims("causeDepartmentSelect", 8)}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={{ base: 6 }} w={{ base: "100%", lg: "65%" }}>
          <PieChart
            values={[
              countClaims("causeDepartmentSelect", 1),
              countClaims("causeDepartmentSelect", 2),
              countClaims("causeDepartmentSelect", 3),
              countClaims("causeDepartmentSelect", 4),
              countClaims("causeDepartmentSelect", 5),
              countClaims("causeDepartmentSelect", 6),
              countClaims("causeDepartmentSelect", 7),
              countClaims("causeDepartmentSelect", 8),
            ]}
            labels={[
              "R&D事業部",
              "他社・メーカー",
              "徳島工場",
              "営業部",
              "配送センター",
              "経理部",
              "顧客",
              "不明",
            ]}
          />
        </Box>
      </Flex>

      {/* 発生内容 */}
      <Flex
        w={{ base: "100%", lg: "45%" }}
        mt={6}
        mx={{ base: 0, lg: 3 }}
        p={6}
        backgroundColor="white"
        borderRadius={6}
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box w={{ base: "100%", lg: "30%" }}>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th fontSize="sm">■発生内容</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>製品不良</Td>
                  <Td>{countClaims("occurrenceSelect", 1)}</Td>
                </Tr>
                <Tr>
                  <Td>納品書</Td>
                  <Td>{countClaims("occurrenceSelect", 2)}</Td>
                </Tr>
                <Tr>
                  <Td>商品間違い</Td>
                  <Td>{countClaims("occurrenceSelect", 3)}</Td>
                </Tr>
                <Tr>
                  <Td>住所等</Td>
                  <Td>{countClaims("occurrenceSelect", 5)}</Td>
                </Tr>
                <Tr>
                  <Td>未納品</Td>
                  <Td>{countClaims("occurrenceSelect", 6)}</Td>
                </Tr>
                <Tr>
                  <Td>その他</Td>
                  <Td>
                    {countClaims("occurrenceSelect", 4) +
                      countClaims("occurrenceSelect", 7) +
                      countClaims("occurrenceSelect", 8)}
                  </Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th fontSize="sm" py="2">
                    合計
                  </Th>
                  <Th fontSize="sm">
                    {countClaims("occurrenceSelect", 1) +
                      countClaims("occurrenceSelect", 2) +
                      countClaims("occurrenceSelect", 3) +
                      countClaims("occurrenceSelect", 4) +
                      countClaims("occurrenceSelect", 5) +
                      countClaims("occurrenceSelect", 6) +
                      countClaims("occurrenceSelect", 7) +
                      countClaims("occurrenceSelect", 8)}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={{ base: 6 }} w={{ base: "100%", lg: "65%" }}>
          <PieChart
            values={[
              countClaims("occurrenceSelect", 1),
              countClaims("occurrenceSelect", 2),
              countClaims("occurrenceSelect", 3),
              countClaims("occurrenceSelect", 5),
              countClaims("occurrenceSelect", 6),

              countClaims("occurrenceSelect", 4) +
                countClaims("occurrenceSelect", 7) +
                countClaims("occurrenceSelect", 8),
            ]}
            labels={[
              "製品不良",
              "納品書",
              "商品間違い",
              "住所等",
              "未納品",
              "その他",
            ]}
          />
        </Box>
      </Flex>

      {/* 対策 */}
      <Flex
        w={{ base: "100%", lg: "45%" }}
        mt={6}
        mx={{ base: 0, lg: 3 }}
        p={6}
        backgroundColor="white"
        borderRadius={6}
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box w={{ base: "100%", lg: "30%" }}>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th fontSize="sm">■対策</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {claimSelectList3.map((list, index) => (
                  <Tr key={list.id}>
                    <Td>{list.title}</Td>
                    <Td>{countClaims("counterplanSelect", index + 1)}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th fontSize="sm" py="2">
                    合計
                  </Th>
                  <Th fontSize="sm">
                    {countClaims("counterplanSelect", 1) +
                      countClaims("counterplanSelect", 2) +
                      countClaims("counterplanSelect", 3) +
                      countClaims("counterplanSelect", 4)}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={{ base: 6 }} w={{ base: "100%", lg: "65%" }}>
          <PieChart
            values={[
              countClaims("counterplanSelect", 1),
              countClaims("counterplanSelect", 2),
              countClaims("counterplanSelect", 3),
              countClaims("counterplanSelect", 4),
            ]}
            labels={["修正処置", "書面提出", "改善の機会", "是正処置"]}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default GraphClaim;
