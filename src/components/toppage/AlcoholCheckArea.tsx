/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useUtils } from "../../hooks/useUtils";
import { useAuthStore } from "../../../store/useAuthStore";
import { AlcoholCheckList } from "../../../types";

export const AlcoholCheckArea: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [alcoholList, setAlcoholList] = useState<AlcoholCheckList>();
  const [alcoholCheck1, setAlcoholCheck1] = useState("1");
  const [alcoholCheck2, setAlcoholCheck2] = useState("1");
  const { todayDate } = useUtils();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //アルコールチェック登録
  const setAlcoholCheckList = async () => {
    try {
      const docListRef = doc(db, "alcoholCheckList", `${todayDate()}`);
      const docSnap = await getDoc(docListRef);
      if (docSnap.exists()) {
        await updateDoc(docListRef, {
          member: arrayUnion(currentUser),
        });
      } else {
        await setDoc(docListRef, {
          id: `${todayDate()}`,
          member: arrayUnion(currentUser),
        });
      }
      await addDoc(collection(db, "alcoholCheckData"), {
        date: `${todayDate()}`,
        uid: currentUser,
        createdAt: serverTimestamp(),
        alcoholCheck1,
        alcoholCheck2,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const docRef = doc(db, "alcoholCheckList", `${todayDate()}`);
    onSnapshot(docRef, (querySnapshot) => {
      setAlcoholList({ ...querySnapshot.data() } as AlcoholCheckList);
    });
  }, []);

  return (
    <>
      {!alcoholList?.member?.includes(currentUser || "") && (
        <>
          <Flex
            alignItems="center"
            justifyContent="center"
            p={6}
            width="100%"
            rounded="md"
            bg="white"
            boxShadow="xs"
          >
            <Box textAlign="center" mr={6}>
              アルコールチェックをしてください
            </Box>
            <Button colorScheme="blue" onClick={onOpen}>
              Click
            </Button>
          </Flex>
        </>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アルコールチェック</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <Box>
                <Box>アルコールの検査はしましたか？</Box>
                <RadioGroup
                  defaultValue="2"
                  value={alcoholCheck1}
                  onChange={(e) => setAlcoholCheck1(e)}
                >
                  <Stack spacing={8} direction="row" mt={1}>
                    <Radio colorScheme="red" value="0">
                      No
                    </Radio>
                    <Radio colorScheme="green" value="1">
                      Yes
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box mt={3}>
                <Box>酒気帯び</Box>
                <RadioGroup
                  defaultValue="2"
                  mt={1}
                  value={alcoholCheck2}
                  onChange={(e) => setAlcoholCheck2(e)}
                >
                  <Stack spacing={9} direction="row">
                    <Radio colorScheme="red" value="0">
                      有
                    </Radio>
                    <Radio colorScheme="green" value="1">
                      無
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </>
          </ModalBody>
          <ModalFooter>
            <Button
              width="100px"
              colorScheme="facebook"
              onClick={() => {
                setAlcoholCheckList();
                onClose();
              }}
            >
              提出
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
