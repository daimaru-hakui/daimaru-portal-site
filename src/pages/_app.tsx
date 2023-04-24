/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Layout from "../components/Layout";
import { auth } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

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
    console.log("login");
  }, [session]);

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
