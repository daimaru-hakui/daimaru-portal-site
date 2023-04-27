import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { auth } from "../../firebase";
import { Administrator } from "../../data";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { User } from "../../types";

export const HeaderMenuButton: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);

  //アルコールチェック権限
  const userAlcoholAuthority = (userId: string) => {
    const newUsers = users.map((user: User) => {
      if (user.alcoholChecker === true) return user.uid;
    });
    return newUsers.includes(userId);
  };

  //営業マン権限
  const userSalesAuthority = (userId: string) => {
    const newUsers = users.map((user: User) => {
      if (user.isoSalesStaff === true) return user.uid;
    });
    return newUsers.includes(userId);
  };

  const logout = (e: any) => {
    e.preventDefault();
    auth.signOut();
  };

  const MenuItemEL = (title: string, href: string) => (
    <Link href={href}>
      <MenuItem pl={6}>{title}</MenuItem>
    </Link>
  );

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="blue" pb={1}>
        <HamburgerIcon />
      </MenuButton>
      <MenuList fontSize="xs">
        <Box mx="4">
          <Box fontSize="xs">ユーザー名</Box>
          {users.map(
            (user: User) =>
              currentUser === user.uid && <Box key={user.uid}>{user.name}</Box>
          )}
        </Box>
        <MenuDivider />
        {MenuItemEL("トップページ", "/")}
        <MenuDivider />
        {currentUser && userAlcoholAuthority(currentUser) && (
          <>
            <MenuGroup title="アルコールチェック" fontSize="xs">
              {MenuItemEL("一覧", "/alcohol-checker")}
            </MenuGroup>
            <MenuDivider />
          </>
        )}
        <MenuGroup title="クレーム報告書" fontSize="xs">
          {MenuItemEL("作成", "/claims/new")}
          {MenuItemEL("一覧", "/claims")}
          {MenuItemEL("集計（グラフ）", "/claims/graph")}
        </MenuGroup>
        <MenuDivider />

        <MenuGroup title="売上表(今月）" fontSize="xs">
          {MenuItemEL("一覧・登録", "/sales")}
        </MenuGroup>
        <MenuDivider />
        {MenuItemEL("デジタルマーケティング進捗", "/progress")}

        {Administrator.includes(currentUser || "") && (
          <>
            {MenuItemEL("管理者ページ", "/admin")}
            {/* {MenuItemEL("profile", "/profile")} */}
            <MenuDivider />
          </>
        )}
        <MenuItem onClick={logout}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  );
};
