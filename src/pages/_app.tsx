/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Layout from "../components/Layout";
import { auth, db } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { useDataList } from "@/hooks/useDataList";
import { useRecruitmentStore } from "../../store/useRecruitmentStore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setUsers = useAuthStore((state) => state.setUsers);
  const setRequests = useRecruitmentStore((state) => state.setRequests);
  const { getUsers, getRequests } = useDataList();

  console.log("login");

  useEffect(() => {
    const getSession = async () => {
      setSession(auth.currentUser);
      setCurrentUser(auth.currentUser?.uid);
      onAuthStateChanged(auth, (session) => {
        if (session) {
          setSession(session);
          setCurrentUser(session?.uid);
          router.push("/");
        } else {
          setSession(null);
          setCurrentUser(undefined);
          router.push("/login");
        }
      });
    };
    getSession();
  }, [session]);

  // 未登録であればauthorityに登録
  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "authority", `${currentUser}`);
      const addAuthority = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return;
        await setDoc(docRef, {
          uid: currentUser,
          name: session?.email,
          rank: 1000,
        });
      };
      addAuthority();
    }
  }, [session]);

  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "authority", `${currentUser}`);
      const updateAuthority = async () => {
        await updateDoc(docRef, {
          email: session?.email,
        });
      };
      updateAuthority();
    }
  }, [session]);

  useEffect(() => {
    getUsers();
  }, [setUsers]);

  useEffect(() => {
    getRequests();
  }, [setRequests]);

  return (
    <ChakraProvider>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default MyApp;
