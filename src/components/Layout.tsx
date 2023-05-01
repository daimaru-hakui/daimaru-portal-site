import React, { ReactNode } from "react";
import { Header } from "./Header";

import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { useAuthStore } from "../../store/useAuthStore";
import SpinnerLoading from "./SpinnerLoading";
import { useLoadingStore } from "../../store/useLoadingStore";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isLoading = useLoadingStore((state) => state.isLoading);
  return (
    <>
      {isLoading && <SpinnerLoading />}
      {router.pathname === "/login" ? (
        <Box bg="#f7f7f7" p={6} pb={6} minH="100vh">
          {children}
        </Box>
      ) : (
        currentUser && (
          <>
            <Header />
            <Box bg="#f7f7f7" p={6} pb={6} minH="100vh">
              {children}
            </Box>
          </>
        )
      )}
    </>
  );
};

export default Layout;
