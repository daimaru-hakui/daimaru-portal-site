import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from "../../../data";
import { beginningDate, todayDate } from "../../../functions";

const ClaimFilterArea = ({
  users,
  claims,
  filterClaims,
  receptionDateStart,
  setReceptionDateStart,
  receptionDateEnd,
  setReceptionDateEnd,
  stampStaffFilter,
  setStampStaffFilter,
  customerFilter,
  setCustomerFilter,
  occurrenceFilter,
  setOccurrenceFilter,
  amendmentFilter,
  setAmendmentFilter,
  counterplanFilter,
  setCounterplanFilter,
  causeDepartmentFilter,
  setCauseDepartmentFilter,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();
  const [stampStaffList, setStampStaffList] = useState<any>([]);

  const onFilterReset = () => {
    setReceptionDateStart("");
    setReceptionDateEnd("");
    setStampStaffFilter("");
    setCustomerFilter("");
    setOccurrenceFilter("");
    setAmendmentFilter("");
    setCounterplanFilter("");
    setCauseDepartmentFilter("");
  };

  //担当フィルターのリストを作成
  useEffect(() => {
    const newUsers = claims.map((claim: { stampStaff: string }) => {
      return claim.stampStaff;
    });
    const setUsers = new Set(newUsers);
    const arrayUsers = Array.from(setUsers).map((user) => {
      return user;
    });

    setStampStaffList(arrayUsers);
  }, [claims]);
  return (
    <>
      {claims.length !== filterClaims.length && (
        <Button onClick={onFilterReset} mr={2}>
          フィルター解除
        </Button>
      )}
      <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
        絞り込み
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>絞り込み検索</DrawerHeader>

          <DrawerBody>
            <FormLabel mt={6}>受付日</FormLabel>
            <Input
              type="date"
              w="100%"
              p={2}
              mt={3}
              value={receptionDateStart ? receptionDateStart : beginningDate()}
              onChange={(e) => setReceptionDateStart(e.target.value)}
            />
            <Input
              type="date"
              w="100%"
              p={2}
              mt={3}
              value={receptionDateEnd ? receptionDateEnd : todayDate()}
              onChange={(e) => setReceptionDateEnd(e.target.value)}
            />

            <FormLabel mt={6}>担当</FormLabel>
            <Select
              placeholder="全て選択"
              value={stampStaffFilter}
              onChange={(e) => setStampStaffFilter(e.target.value)}
            >
              {stampStaffList.map((stampStaffUser: string, index: number) => (
                <option key={index} value={stampStaffUser}>
                  {users.map(
                    (user: { uid: string; name: string }) =>
                      user.uid === stampStaffUser && user.name
                  )}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>顧客名</FormLabel>
            <Input
              type="text"
              w="100%"
              p={2}
              mt={3}
              placeholder="顧客名を入力"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            />

            <FormLabel mt={6}>発生内容</FormLabel>
            <Select
              placeholder="全て選択"
              value={occurrenceFilter}
              onChange={(e) => setOccurrenceFilter(e.target.value)}
            >
              {claimSelectList1.map((list) => (
                <option key={list.id} value={list.id}>
                  {`${list.headline} ${list.title}`}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>修正処置</FormLabel>
            <Select
              placeholder="全て選択"
              value={amendmentFilter}
              onChange={(e) => setAmendmentFilter(e.target.value)}
            >
              {claimSelectList2.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>対策</FormLabel>
            <Select
              placeholder="全て選択"
              value={counterplanFilter}
              onChange={(e) => setCounterplanFilter(e.target.value)}
            >
              {claimSelectList3.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>起因部署</FormLabel>
            <Select
              placeholder="全て選択"
              value={causeDepartmentFilter}
              onChange={(e) => setCauseDepartmentFilter(e.target.value)}
            >
              {claimSelectList4.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Select>
          </DrawerBody>

          <DrawerFooter>
            <Flex mt={6} justifyContent="center" w="100%">
              <Button onClick={onFilterReset} mr={3}>
                リセット
              </Button>
              <Button variant="outline" onClick={onClose}>
                閉じる
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ClaimFilterArea;
