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
import React, { useEffect, useState } from "react";
import { claimSelectList4 } from "../../../data";
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from "../../../data";
import Link from "next/link";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  amendmentState,
  causeDepartmentState,
  claimsState,
  counterplanState,
  customerState,
  occurrenceState,
  receptionDateEndState,
  receptionDateStartState,
  stampStaffState,
} from "../../../store";
import ClaimFilterArea from "../../components/claims/ClaimFilterArea";
import { useAuthStore } from "../../../store/useAuthStore";

const Claim: NextPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const claims = useRecoilValue(claimsState); //クレーム一覧リスト

  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagerUsers] = useState<any>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

  const [filterClaims, setFilterClaims] = useState<any>(claims);
  const [receptionDateStart, setReceptionDateStart] = useRecoilState(
    receptionDateStartState
  );
  const [receptionDateEnd, setReceptionDateEnd] = useRecoilState(
    receptionDateEndState
  );
  const [stampStaffFilter, setStampStaffFilter] =
    useRecoilState(stampStaffState);
  const [customerFilter, setCustomerFilter] = useRecoilState(customerState);
  const [occurrenceFilter, setOccurrenceFilter] =
    useRecoilState(occurrenceState);
  const [amendmentFilter, setAmendmentFilter] = useRecoilState(amendmentState);
  const [counterplanFilter, setCounterplanFilter] =
    useRecoilState(counterplanState);
  const [causeDepartmentFilter, setCauseDepartmentFilter] =
    useRecoilState(causeDepartmentState);

  //フィルターでクレーム一覧を絞り込み
  useEffect(() => {
    //受付日の開始日で絞り込み
    let newClaims = claims.filter((claim: any) => {
      if (!receptionDateStart) return claim;
      const date1 = new Date(receptionDateStart);
      const date2 = new Date(claim.receptionDate);
      if (date1.getTime() <= date2.getTime()) return claim;
    });
    //受付日の終了日で絞り込み
    newClaims = newClaims.filter((claim: any) => {
      if (!receptionDateEnd) return claim;
      const date1 = new Date(claim.receptionDate);
      const date2 = new Date(receptionDateEnd);
      if (date1.getTime() <= date2.getTime()) return claim;
    });
    //担当者で絞り込み
    newClaims = newClaims.filter((claim: { stampStaff: string }) => {
      if (!stampStaffFilter) return claim;
      if (claim.stampStaff == stampStaffFilter) return claim;
    });
    newClaims = newClaims.filter((claim: { customer: string }) => {
      if (!customerFilter) return claim;
      if (claim.customer.includes(customerFilter)) return claim;
    });
    //発生内容を絞り込み
    newClaims = newClaims.filter((claim: { occurrenceSelect: string }) => {
      if (!occurrenceFilter) return claim;
      if (claim.occurrenceSelect == occurrenceFilter) return claim;
    });
    //修正処置を絞り込み
    newClaims = newClaims.filter((claim: { amendmentSelect: string }) => {
      if (!amendmentFilter) return claim;
      if (claim.amendmentSelect == amendmentFilter) return claim;
    });
    //対策を絞り込み
    newClaims = newClaims.filter((claim: any) => {
      if (!counterplanFilter) return claim;
      if (claim.counterplanSelect == counterplanFilter) return claim;
    });
    //起因部署を絞り込み
    newClaims = newClaims.filter((claim: any) => {
      if (!causeDepartmentFilter) return claim;
      if (claim.causeDepartmentSelect == causeDepartmentFilter) return claim;
    });
    setFilterClaims(newClaims);
  }, [
    receptionDateStart,
    receptionDateEnd,
    stampStaffFilter,
    customerFilter,
    occurrenceFilter,
    amendmentFilter,
    counterplanFilter,
    causeDepartmentFilter,
    claims,
    setFilterClaims,
  ]);

  //作業者を表示する関数
  const currentOperator = (claim: any) => {
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
            return users.map((user: { uid: string; name: string }) => {
              if (user.uid == claim.operator) return user.name;
            });
        }
      default:
        return "事務局";
    }
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
    setIsoBossUsers(
      users.filter((user: any) => {
        return user.isoBoss === true;
      })
    );
  }, [users]);

  //iso（事務局・管理者・TM）のオブジェクトからuidのみ取り出して配列にする
  const searchUsers = (array: { uid: string }[]) => {
    const newUsers = array.map((user: { uid: string }) => {
      return user.uid;
    });
    return newUsers;
  };

  return (
    <>
      {currentUser && (
        <>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <TableContainer
              w="1800px"
              backgroundColor="white"
              borderRadius={6}
              p={6}
            >
              <Flex mb={6} justifyContent="space-between">
                <Box fontSize="lg">
                  {filterClaims.length}件/全{claims.length}件
                </Box>
                <Box>
                  <ClaimFilterArea
                    users={users}
                    claims={claims}
                    filterClaims={filterClaims}
                    receptionDateStart={receptionDateStart}
                    setReceptionDateStart={setReceptionDateStart}
                    receptionDateEnd={receptionDateEnd}
                    setReceptionDateEnd={setReceptionDateEnd}
                    stampStaffFilter={stampStaffFilter}
                    customerFilter={customerFilter}
                    setCustomerFilter={setCustomerFilter}
                    setStampStaffFilter={setStampStaffFilter}
                    occurrenceFilter={occurrenceFilter}
                    setOccurrenceFilter={setOccurrenceFilter}
                    amendmentFilter={amendmentFilter}
                    setAmendmentFilter={setAmendmentFilter}
                    counterplanFilter={counterplanFilter}
                    setCounterplanFilter={setCounterplanFilter}
                    causeDepartmentFilter={causeDepartmentFilter}
                    setCauseDepartmentFilter={setCauseDepartmentFilter}
                  />
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
                  {filterClaims.map((claim: any) => (
                    <Tr
                      key={claim.id}
                      backgroundColor={
                        claim.operator === currentUser ||
                        (searchUsers(isoOfficeUsers).includes(currentUser) &&
                          (claim.status === 0 ||
                            claim.status === 2 ||
                            claim.status === 4)) ||
                        (searchUsers(isoManagerUsers).includes(currentUser) &&
                          claim.status === 6) ||
                        (searchUsers(isoTopManegmentUsers).includes(
                          currentUser
                        ) &&
                          claim.status === 7)
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
                          (user: { uid: string; name: string }) =>
                            user.uid == claim.stampStaff && user.name
                        )}
                      </Td>
                      <Td>{claim.customer}</Td>
                      <Td>{claim.occurrenceDate}</Td>
                      <Td>
                        {claimSelectList1.map(
                          (c) =>
                            c.id == claim.occurrenceSelect &&
                            c.headline + " " + c.title
                        )}
                      </Td>
                      <Td>
                        {claimSelectList2.map(
                          (c) => c.id == claim.amendmentSelect && c.title
                        )}
                      </Td>
                      <Td>
                        {claimSelectList3.map(
                          (c) => c.id == claim.counterplanSelect && c.title
                        )}
                      </Td>
                      <Td>
                        {claimSelectList4.map(
                          (c) => c.id == claim.causeDepartmentSelect && c.title
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
      )}
    </>
  );
};

export default Claim;
