import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Information from "../components/toppage/Information";
import QuickLink from "../components/toppage/QuickLink";
import Slogan from "../components/toppage/Slogan";
import CatalogArea from "../components/toppage/CatalogArea";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import { claimsState, usersState } from "../../store/";
import CheckDrawer from "../components/alcohol/CheckDrawer";
import { todayDate } from "../../functions";
import ClaimArea from "../components/toppage/ClaimArea";
import RecruitmentArea from "../components/toppage/RecruitmentArea";
import SalesArea from "../components/toppage/SalesArea";
import CuttingReportArea from "../components/toppage/CuttingReportArea";
import { useAuthStore } from "../../store/useAuthStore";

const Home: NextPage<any> = ({
  categoryData,
  newsData,
  linkData,
}) => {
  const [user] = useAuthState(auth);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setUsers = useSetRecoilState<any>(usersState); //ユーザー一覧リスト
  const setClaims = useSetRecoilState<any>(claimsState); //クレーム一覧リスト

  const [alcoholObject, setAlcoholObject] = useState<any>({});
  const [alcoholArray, setAlcoholArray] = useState<any>([]);

  //users情報
  useEffect(() => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [setUsers]);

  // 未登録であればauthorityに登録
  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "authority", `${currentUser}`);
      const addAuthority = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return;
        await setDoc(docRef, {
          uid: currentUser,
          name: user?.email,
          rank: 1000,
        });
      };
      addAuthority();
    }
  }, [currentUser, user]);

  //【クレーム】クレーム一覧リスト取得
  useEffect(() => {
    const claimsCollectionRef = collection(db, "claimList");
    const q = query(claimsCollectionRef, orderBy("receptionNum", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [setClaims]);

  //アルコールチェックLIST取得
  useEffect(() => {
    onSnapshot(
      doc(db, "alcoholCheckList", `${todayDate()}`),
      (doc) => {
        setAlcoholObject(doc.data());
      }
    );
  }, [currentUser]);

  // アルコールKEYを取得して配列を作成
  useEffect(() => {
    if (alcoholObject) {
      setAlcoholArray(Object.keys(alcoholObject).map((arr) => arr));
    }
  }, [alcoholObject]);

  return (
    <>
      <Head>
        <title>大丸白衣ポータル</title>
        <meta name="description" content="大丸白衣ポータル" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {currentUser && ( */}
      <Box as="main">
        <Flex w="100%" gap={6} flexDirection={{ base: "column", lg: "row" }}>
          <Box flex={1}>
            <Stack spacing={6}>
              <CuttingReportArea />
              <CheckDrawer />
              <ClaimArea />
              <SalesArea />
              <Slogan />
              <Information news={newsData.contents} />
              <QuickLink
                links={linkData.contents}
                categories={categoryData.contents}
              />
              <CatalogArea />
            </Stack>
          </Box>
          <Box flex={1}>
            <RecruitmentArea />
          </Box>
        </Flex>
      </Box>
      {/* )} */}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const accessPoint = "https://portal-site.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "5c23d3e8eaa0448388ca527e0e00c829611f",
    },
  };

  const categoryRes = await fetch(
    `${accessPoint}/categories?limit=10`,
    options
  );
  const categoryData = await categoryRes.json();
  const newsRes = await fetch(`${accessPoint}/news?limit=100`, options);
  const newsData = await newsRes.json();
  const linkRes = await fetch(`${accessPoint}/access-link?limit=100`, options);
  const linkData = await linkRes.json();

  return {
    props: {
      categoryData,
      newsData,
      linkData,
    },
  };
}
