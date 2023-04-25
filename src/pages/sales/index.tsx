import {
  Box,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  endAt,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import { SalesEditModal } from "../../components/sales/SalesEditModal";
import { useAuthStore } from "../../../store/useAuthStore";
import { Sale } from "../../../types";
import { useDisp } from "@/hooks/useDisp";

const Sales = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const { getUserName } = useDisp();
  const [sales, setSeles] = useState<Sale[]>([]);
  const [registeredUser, setRegisteredUser] = useState<string[]>([]);
  const [targetSum, setTargetSum] = useState<number>(0);
  const [AchiveSum, setAchiveSum] = useState<number>(0);
  const [ExpectSum, setExpectSum] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState(""); //今月 2022-10

  // salesデータを取得
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    let monthStr = "0" + String(month);
    monthStr.slice(-2);
    const startAtDate = `${year}-${monthStr}-01`;
    const endAtDate = `${year}-${monthStr}-${lastDate.getDate()}`;
    setCurrentMonth(`${year}-${month}`);

    // 売上登録データ取得
    const collectionRef = collection(db, "sales");
    // 今月1日から末日までのデータを取得
    const q = query(
      collectionRef,
      orderBy("datetime"),
      startAt(startAtDate),
      endAt(endAtDate)
    );
    try {
      onSnapshot(q, (querySnapshot) => {
        setSeles(
          querySnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              } as Sale)
          )
        );
        setRegisteredUser(
          querySnapshot.docs.map((doc) => doc.data().currentUser)
        );
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  // 営業担当を登録する
  const addSales = async (uid: string, rank: number) => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let monthStr = "0" + month;
    // monthStr = monthStr.slice(-2);
    const result = year + "-" + month;

    let day = date.getDate();
    let dayStr = "0" + day;
    dayStr = dayStr.slice(-2);

    const docRef = doc(db, "sales", `${result}_${uid}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("add");
      try {
        await setDoc(docRef, {
          currentUser: uid,
          currentTarget: 0,
          currentAchieve: 0,
          currentExpect: 0,
          createdAt: serverTimestamp(),
          datetime: `${year}-${monthStr}-${dayStr}`,
          rank,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  // フィルターを掛けたusersを一人ずつ登録していく
  useEffect(() => {
    users
      .filter(
        (user) => user.isoSalesStaff && !registeredUser?.includes(user.uid)
      )
      .forEach((user) => {
        addSales(user.uid, user.rank);
        console.log("mukai");
      });
  }, [registeredUser, users]);

  // 目標・着地・予定
  useEffect(() => {
    let target = 0,
      achive = 0,
      expect = 0;
    sales?.forEach((sale) => {
      target += Number(sale.currentTarget);
      achive += Number(sale.currentAchieve);
      expect += Number(sale.currentExpect);
    });
    setTargetSum(target);
    setAchiveSum(achive);
    setExpectSum(expect);
  }, [sales]);

  const getAchievementRate = (
    expect: number,
    achive: number,
    target: number
  ) => {
    const result = (((expect + achive) / target) * 100).toString().slice(0, 4);
    return Number(result);
  };

  return (
    <Container maxW="1100px">
      <Flex justifyContent="space-between" alignItems="center">
        <Box my={3} fontSize="xl">
          {currentMonth}月 売上一覧
        </Box>
        <Box>（単位:万円）</Box>
      </Flex>
      <TableContainer bg="white" rounded="md" p={6} boxShadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>担当</Th>
              <Th>予算</Th>
              <Th>実績</Th>
              <Th>計上予定</Th>
              <Th>合計</Th>
              <Th>差額</Th>
              <Th>達成率</Th>
              <Th>更新日</Th>
              <Th>編集</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sales
              ?.sort((a, b) => a.rank - b.rank)
              ?.map((sale) => (
                <Tr
                  key={sale.id}
                  bgColor={
                    getAchievementRate(
                      Number(sale.currentExpect),
                      Number(sale.currentAchieve),
                      Number(sale.currentTarget)
                    ) >= 100
                      ? "#d4bf0096"
                      : ""
                  }
                >
                  <Td mr={6}>{getUserName(sale.currentUser)}</Td>
                  <Td isNumeric>
                    {Number(sale.currentTarget).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {Number(sale.currentAchieve).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {Number(sale.currentExpect).toLocaleString()}
                  </Td>
                  <Td fontWeight="bold" isNumeric>
                    {(
                      Number(sale.currentAchieve) + Number(sale.currentExpect)
                    ).toLocaleString()}
                  </Td>
                  <Td fontWeight="bold" isNumeric>
                    {(
                      Number(sale.currentExpect) -
                      Number(sale.currentTarget) +
                      Number(sale.currentAchieve)
                    ).toLocaleString()}
                  </Td>
                  <Td fontWeight="bold" isNumeric>
                    {getAchievementRate(
                      Number(sale.currentExpect),
                      Number(sale.currentAchieve),
                      Number(sale.currentTarget)
                    )}
                    %
                  </Td>
                  <Td>{sale?.updatedAt?.toDate().toLocaleString()}</Td>
                  <Td>
                    {(Administrator.includes(currentUser || "") ||
                      sale.currentUser === currentUser) && (
                      <SalesEditModal sale={sale} />
                    )}
                  </Td>
                </Tr>
              ))}
            <Tr
              fontWeight="bold"
              bgColor={
                getAchievementRate(ExpectSum, AchiveSum, targetSum) >= 100
                  ? "#00f3a0"
                  : ""
              }
            >
              <Td mr={6}>合計</Td>
              <Td isNumeric>{targetSum?.toLocaleString()}</Td>
              <Td isNumeric>{AchiveSum?.toLocaleString()}</Td>
              <Td isNumeric>{ExpectSum?.toLocaleString()}</Td>
              <Td isNumeric>{(AchiveSum + ExpectSum).toLocaleString()}</Td>
              <Td isNumeric>
                {(AchiveSum + ExpectSum - targetSum).toLocaleString()}
              </Td>
              <Td isNumeric>
                {getAchievementRate(ExpectSum, AchiveSum, targetSum)}%
              </Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Sales;
