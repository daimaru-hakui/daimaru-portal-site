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
import React, { FC, useEffect, useState } from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from "../../../data";
import { useClaimStore } from "../../../store/useClaimStore";
import { useDisp } from "@/hooks/useDisp";
import { useUtils } from "@/hooks/useUtils";

export const ClaimFilterArea: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();
  const [stampStaffList, setStampStaffList] = useState<string[]>([]);
  const { beginningDate, todayDate } = useUtils();
  const { getUserName } = useDisp();
  const claims = useClaimStore((state) => state.claims);
  const filterClaims = useClaimStore((state) => state.filterClaims);
  const setFilterClaims = useClaimStore((state) => state.setFilterClaims);
  const receptionDateStart = useClaimStore((state) => state.receptionDateStart);
  const receptionDateEnd = useClaimStore((state) => state.receptionDateEnd);
  const stampStaff = useClaimStore((state) => state.stampStaff);
  const customer = useClaimStore((state) => state.customer);
  const occurrence = useClaimStore((state) => state.occurrence);
  const amendment = useClaimStore((state) => state.amendment);
  const causeDepartment = useClaimStore((state) => state.causeDepartment);
  const counterplan = useClaimStore((state) => state.counterplan);
  const setReceptionDateStart = useClaimStore(
    (state) => state.setReceptionDateStart
  );
  const setReceptionDateEnd = useClaimStore(
    (state) => state.setReceptionDateEnd
  );
  const setStampStaff = useClaimStore((state) => state.setStampStaff);
  const setCustomer = useClaimStore((state) => state.setCustomer);
  const setOccurrence = useClaimStore((state) => state.setOccurrence);
  const setAmendment = useClaimStore((state) => state.setAmendment);
  const setCauseDepartment = useClaimStore((state) => state.setCauseDepartment);
  const setCounterplan = useClaimStore((state) => state.setCounterplan);

  const onFilterReset = () => {
    setReceptionDateStart("");
    setReceptionDateEnd("");
    setStampStaff("");
    setCustomer("");
    setOccurrence("");
    setAmendment("");
    setCauseDepartment("");
    setCounterplan("");
  };

  //担当フィルターのリストを作成
  useEffect(() => {
    const newUsers = claims.map((claim) => claim.stampStaff);
    const setUsers = new Set(newUsers);
    const arrayUsers = Array.from(setUsers).map((user) => user);
    setStampStaffList(arrayUsers);
  }, [claims]);

  useEffect(() => {
    //受付日の開始日で絞り込み
    let newClaims = claims
      .filter((claim) => {
        if (!receptionDateStart) return claim;
        const date1 = new Date(receptionDateStart);
        const date2 = new Date(claim.receptionDate);
        if (date1.getTime() <= date2.getTime()) return claim;
      })
      .filter((claim) => {
        if (!receptionDateEnd) return claim;
        const date1 = new Date(claim.receptionDate);
        const date2 = new Date(receptionDateEnd);
        if (date1.getTime() <= date2.getTime()) return claim;
      })
      .filter((claim) => {
        if (!stampStaff) return claim;
        if (claim.stampStaff === stampStaff) return claim;
      })
      .filter((claim) => {
        if (!customer) return claim;
        if (claim.customer.includes(customer)) return claim;
      })
      .filter((claim) => {
        if (!occurrence) return claim;
        if (Number(claim.occurrenceSelect) === Number(occurrence)) return claim;
      })
      .filter((claim) => {
        if (!amendment) return claim;
        if (Number(claim.amendmentSelect) === Number(amendment)) return claim;
      })
      .filter((claim) => {
        if (!counterplan) return claim;
        if (Number(claim.counterplanSelect) === Number(counterplan))
          return claim;
      })
      .filter((claim) => {
        if (!causeDepartment) return claim;
        if (Number(claim.causeDepartmentSelect) === Number(causeDepartment))
          return claim;
      });
    setFilterClaims(newClaims);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    claims,
    receptionDateStart,
    receptionDateEnd,
    stampStaff,
    customer,
    occurrence,
    amendment,
    counterplan,
    causeDepartment,
  ]);

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
              value={receptionDateStart ? receptionDateStart : "2022-03-01"}
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
              value={stampStaff}
              onChange={(e) => setStampStaff(e.target.value)}
            >
              {stampStaffList.map((stampStaffUser, index: number) => (
                <option key={index} value={stampStaffUser}>
                  {getUserName(stampStaffUser)}
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
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />

            <FormLabel mt={6}>発生内容</FormLabel>
            <Select
              placeholder="全て選択"
              value={occurrence}
              onChange={(e) => setOccurrence(e.target.value)}
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
              value={amendment}
              onChange={(e) => setAmendment(e.target.value)}
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
              value={counterplan}
              onChange={(e) => setCounterplan(e.target.value)}
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
              value={causeDepartment}
              onChange={(e) => setCauseDepartment(e.target.value)}
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
