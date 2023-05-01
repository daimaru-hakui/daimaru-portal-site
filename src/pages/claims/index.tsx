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

import { NextPage } from "next";
import React from "react";
import { claimSelectList4 } from "../../../data";
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from "../../../data";
import Link from "next/link";
import { ClaimFilterArea } from "@/components/claims/ClaimFilterArea";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClaimStore } from "../../../store/useClaimStore";
import { useUtils } from "@/hooks/useUtils";
import { Claim } from "../../../types";

const Claim: NextPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const claims = useClaimStore((state) => state.claims);
  const filterClaims = useClaimStore((state) => state.filterClaims);
  const { isAuth } = useUtils();

  //作業者を表示する関数
  const currentOperator = (claim: Claim) => {
    switch (claim.operator) {
      case claim.operator:
        switch (claim.status) {
          case 0:
            return "事務局";
          case 2:
            return "事務局";
          case 4:
            return "事務局";
          case 6:
            return "管理者";
          case 7:
            return "TM";
          case 8:
            return "";
          default:
            return users.map((user) => {
              if (user.uid == claim.operator) return user.name;
            });
        }
      default:
        return "事務局";
    }
  };

  return (
    <>
      <Flex flexDirection="column" alignItems="center">
        <TableContainer w="1800px" bg="white" rounded={6} p={6}>
          <Flex mb={6} justifyContent="space-between">
            <Box fontSize="lg">
              {filterClaims.length}件/全{claims.length}件
            </Box>
            <Box>
              <ClaimFilterArea />
            </Box>
          </Flex>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>詳細</Th>
                <Th minW="80px">作業者</Th>
                <Th minW="95px">ステータス</Th>
                <Th minW="105px">受付日</Th>
                <Th minW="80px">受付NO.</Th>
                <Th minW="100px">担当</Th>
                <Th minW="260px">顧客名</Th>
                <Th minW="105px">発生日</Th>
                <Th minW="150px">発生内容</Th>
                <Th minW="160px">修正処置</Th>
                <Th minW="120px">対策</Th>
                <Th minW="120px">起因部署</Th>
                <Th minW="105px">完了日</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filterClaims.map((claim) => (
                <Tr
                  key={claim.id}
                  bg={
                    claim.operator === currentUser ||
                    (isAuth(["isoOffice"]) &&
                      [0, 2, 4].includes(claim.status)) ||
                    (isAuth(["isoManager"]) && claim.status === 6) ||
                    (isAuth(["isoTopManegment"]) && claim.status === 7)
                      ? "yellow.100"
                      : "white"
                  }
                >
                  <Td>
                    <Link href={`/claims/${claim.id}`}>
                      <Button size="sm">詳細</Button>
                    </Link>
                  </Td>
                  <Td>{currentOperator(claim)}</Td>
                  <Td>
                    {taskflow.map(
                      (task) => task.id == claim.status && task.status
                    )}
                  </Td>
                  <Td>{claim.receptionDate}</Td>
                  <Td>{claim.receptionNum}</Td>
                  <Td>
                    {users.map(
                      (user) => user.uid == claim.stampStaff && user.name
                    )}
                  </Td>
                  <Td>{claim.customer}</Td>
                  <Td>{claim.occurrenceDate}</Td>
                  <Td>
                    {claimSelectList1.map(
                      (c) =>
                        Number(c.id) === Number(claim.occurrenceSelect) &&
                        c.headline + " " + c.title
                    )}
                  </Td>
                  <Td>
                    {claimSelectList2.map(
                      (c) =>
                        Number(c.id) === Number(claim.amendmentSelect) &&
                        c.title
                    )}
                  </Td>
                  <Td>
                    {claimSelectList3.map(
                      (c) =>
                        Number(c.id) === Number(claim.counterplanSelect) &&
                        c.title
                    )}
                  </Td>
                  <Td>
                    {claimSelectList4.map(
                      (c) =>
                        Number(c.id) === Number(claim.causeDepartmentSelect) &&
                        c.title
                    )}
                  </Td>
                  <Td>{claim.completionDate}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </>
  );
};

export default Claim;
