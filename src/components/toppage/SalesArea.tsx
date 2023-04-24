import { Box, Button } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import { usersState } from "../../../store";
import { useAuthStore } from "../../../store/useAuthStore";

const SalesArea = () => {
  const users = useRecoilValue(usersState);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [filterUsers, setFilterUsers] = useState<any>();
  const [saleFlag, setSaleFlag] = useState<any>();
  useEffect(() => {
    setFilterUsers(
      users
        .filter((user: { isoSalesStaff: boolean }) => user.isoSalesStaff)
        .map((user: { uid: string }) => user.uid)
    );
  }, [users]);

  useEffect(() => {
    const getSale = async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const result = year + "-" + month;
      const docRef = doc(db, "sales", `${result}_${currentUser}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const result =
          Number(docSnap.data().currentTarget) === 0 ? true : false;
        setSaleFlag(result);
      }
    };
    getSale();
  }, [currentUser]);

  // 点滅
  // let label: any = document.getElementById("saleLabel");
  // label?.animate(
  //   {
  //     background: ["white", "#ffce00"],
  //   },
  //   {
  //     iterations: Infinity,
  //     duration: 1000,
  //   }
  // );

  return (
    <>
      {(filterUsers?.includes(currentUser) ||
        Administrator.includes(currentUser || "")) && (
        <Box
          width="100%"
          boxShadow="xs"
          p={{ base: 3, md: 6 }}
          rounded="md"
          bg="white"
        >
          {saleFlag && (
            <Box id="saleLabel" textAlign="center" p={3} mb={6} bg="red">
              月初になりました。下記ボタンをクリックして
              <Box as="span" fontWeight="bold">
                目標額
              </Box>
              を入力してください。
            </Box>
          )}
          <Link href="/sales/">
            <Button w="100%" colorScheme="blue">
              売上着地金額の入力
            </Button>
          </Link>
        </Box>
      )}
    </>
  );
};

export default SalesArea;
