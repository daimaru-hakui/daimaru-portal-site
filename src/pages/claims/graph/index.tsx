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
import React, { useState, useEffect } from "react";
import { claimSelectList3, claimSelectList4 } from "../../../../data";
import { useUtils } from "@/hooks/useUtils";
import PieChart from "../../../components/claims/chart/PieChart";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { Claim } from "../../../../types";

const GraphClaim = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const { beginningDate, todayDate } = useUtils();
  const [startAtDate, setStartAtDate] = useState(beginningDate);
  const [endAtDate, setEndAtDate] = useState(todayDate);

  const countClaim = (str: string, num: number) => {
    let count: string[] = [];
    claims.forEach((claim: any) => {
      if (Number(claim[str]) === num) count.push(claim[str]);
    });
    return count.length;
  };

  const countClaimSum = (str: string) => {
    let count: string[] = [];
    claims.forEach((claim: any) => {
      if (Number(claim[str])) count.push(claim[str]);
    });
    return count.length;
  };

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
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as Claim)
        )
      );
    });
  }, [startAtDate, endAtDate]);

  return (
    <Flex flexWrap="wrap" justifyContent="center">
      <Flex
        flexDirection="column"
        alignItems="center"
        w={{ base: "100%", lg: "45%" }}
        mx={{ base: 0, lg: 3 }}
        p={6}
        rounded={6}
        bg="white"
      >
        <Flex w="full" fontSize="xl">
          <Box mr="2" fontWeight="bold">
            集計期間 :
          </Box>
          <Box>クレーム数 {claims.length} 件</Box>
        </Flex>
        <Flex
          mt={3}
          w="full"
          flexDirection={{ base: "column" }}
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
        bg="white"
        rounded={6}
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box w={{ lg: "30%" }}>
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
                    <Td>{countClaim("causeDepartmentSelect", index + 1)}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th fontSize="sm" py="2">
                    合計
                  </Th>
                  <Th fontSize="sm">
                    {countClaimSum("causeDepartmentSelect")}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={{ base: 6 }} w={{ lg: "65%" }}>
          <PieChart
            values={[
              countClaim("causeDepartmentSelect", 1),
              countClaim("causeDepartmentSelect", 2),
              countClaim("causeDepartmentSelect", 3),
              countClaim("causeDepartmentSelect", 4),
              countClaim("causeDepartmentSelect", 5),
              countClaim("causeDepartmentSelect", 6),
              countClaim("causeDepartmentSelect", 7),
              countClaim("causeDepartmentSelect", 8),
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
        bg="white"
        rounded={6}
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box w={{ lg: "30%" }}>
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
                  <Td>{countClaim("occurrenceSelect", 1)}</Td>
                </Tr>
                <Tr>
                  <Td>納品書</Td>
                  <Td>{countClaim("occurrenceSelect", 2)}</Td>
                </Tr>
                <Tr>
                  <Td>商品間違い</Td>
                  <Td>{countClaim("occurrenceSelect", 3)}</Td>
                </Tr>
                <Tr>
                  <Td>住所等</Td>
                  <Td>{countClaim("occurrenceSelect", 5)}</Td>
                </Tr>
                <Tr>
                  <Td>未納品</Td>
                  <Td>{countClaim("occurrenceSelect", 6)}</Td>
                </Tr>
                <Tr>
                  <Td>その他</Td>
                  <Td>
                    {countClaim("occurrenceSelect", 4) +
                      countClaim("occurrenceSelect", 7) +
                      countClaim("occurrenceSelect", 8)}
                  </Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th fontSize="sm" py="2">
                    合計
                  </Th>
                  <Th fontSize="sm">
                    {<Td>{countClaimSum("occurrenceSelect")}</Td>}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={{ base: 6 }} w={{ lg: "65%" }}>
          <PieChart
            values={[
              countClaim("occurrenceSelect", 1),
              countClaim("occurrenceSelect", 2),
              countClaim("occurrenceSelect", 3),
              countClaim("occurrenceSelect", 5),
              countClaim("occurrenceSelect", 6),
              countClaim("occurrenceSelect", 4) +
                countClaim("occurrenceSelect", 7) +
                countClaim("occurrenceSelect", 8),
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
        bg="white"
        rounded={6}
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box w={{ lg: "30%" }}>
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
                    <Td>{countClaim("counterplanSelect", index + 1)}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th fontSize="sm" py="2">
                    合計
                  </Th>
                  <Th fontSize="sm">{countClaimSum("counterplanSelect")}</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={{ base: 6 }} w={{ lg: "65%" }}>
          <PieChart
            values={[
              countClaim("counterplanSelect", 1),
              countClaim("counterplanSelect", 2),
              countClaim("counterplanSelect", 3),
              countClaim("counterplanSelect", 4),
            ]}
            labels={["修正処置", "書面提出", "改善の機会", "是正処置"]}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default GraphClaim;
