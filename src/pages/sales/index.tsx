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
import { usersState } from "../../../store";
import SalesEditModal from "../../components/sales/SalesEditModal";
import { useAuthStore } from "../../../store/useAuthStore";

const Sales = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useRecoilValue(usersState); //ユーザー一覧リスト
  const [sales, setSeles] = useState<any>();
  const [registeredUser, setRegisteredUser] = useState<any>();
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
    const salesCollectionRef = collection(db, "sales");
    const q = query(
      salesCollectionRef,
      orderBy("datetime"),
      startAt(startAtDate),
      endAt(endAtDate)
    );
    try {
      onSnapshot(q, (querySnapshot) => {
        setSeles(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        console.log(q);
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
    monthStr.slice(-2);
    let day = String(date.getDate());
    day = "0" + day;
    day.slice(-2);
    const result = year + "-" + month;

    const docRef = doc(db, "sales", `${result}_${uid}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      try {
        await setDoc(docRef, {
          currentTarget: 0,
          currentAchieve: 0,
          currentExpect: 0,
          currentUser: uid,
          createdAt: serverTimestamp(),
          datetime: `${year}-${monthStr}-${day}`,
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
    const filterUsers = users
      .filter((user: { isoSalesStaff: boolean }) => user.isoSalesStaff)
      .filter((user: { uid: string }) => !registeredUser?.includes(user.uid));

    filterUsers.forEach((user: { uid: string; rank: number }) => {
      addSales(user.uid, user.rank);
    });
  }, [registeredUser, users]);

  // 名前表示
  const dispName = (uid: string) => {
    const userName: any = users.find((user: { uid: string; name: string }) => {
      if (user.uid === uid) return true;
    });
    return userName?.name;
  };

  // 目標・着地・予定
  useEffect(() => {
    let target = 0;
    sales?.forEach((sale: { currentTarget: string }) => {
      target += Number(sale.currentTarget);
    });
    setTargetSum(target);

    let achive = 0;
    sales?.forEach((sale: { currentAchieve: string }) => {
      achive += Number(sale.currentAchieve);
    });
    setAchiveSum(achive);

    let expect = 0;
    sales?.forEach((sale: { currentExpect: string }) => {
      expect += Number(sale.currentExpect);
    });
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
              ?.sort(
                (a: { rank: number }, b: { rank: number }) => a.rank - b.rank
              )
              ?.map(
                (sale: {
                  id: string;
                  currentUser: string;
                  currentExpect: string;
                  currentAchieve: string;
                  currentTarget: string;
                  updatedAt: any;
                }) => (
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
                    <Td mr={6}>{dispName(sale.currentUser)}</Td>
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
                        <SalesEditModal
                          docId={`${currentMonth}_${sale.currentUser}`}
                        />
                      )}
                    </Td>
                  </Tr>
                )
              )}
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
