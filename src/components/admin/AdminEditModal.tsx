import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

type Props = {
  uid: string;
};

const AdminEditModal: NextPage<Props> = ({ uid }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<any>();

  // authorityデータ 取得
  useEffect(() => {
    const docRef = doc(db, "authority", `${uid}`);
    const getAuthority = async () => {
      const docSnap = await getDoc(docRef);
      setUser({ ...docSnap.data() });
    };
    getAuthority();
  }, [uid]);

  // リセット
  const reset = () => {
    const docRef = doc(db, "authority", `${uid}`);
    const getAuthority = async () => {
      const docSnap = await getDoc(docRef);
      setUser({ ...docSnap.data() });
    };
    getAuthority();
  };

  const updateAuthority = async () => {
    const docRef = doc(db, "authority", `${uid}`);
    await updateDoc(docRef, {
      rank: Number(user.rank),
      name: user.name,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleIncrementChange = (e: any) => {
    const value = e;
    setUser({ ...user, rank: value });
  };

  return (
    <>
      <Button size="xs" onClick={onOpen}>
        編集
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>名前編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>id</Text>
              <NumberInput
                name="rank"
                onChange={handleIncrementChange}
                value={user?.rank}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text>名前</Text>
              <Input
                name="name"
                value={user?.name}
                onChange={handleInputChange}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                updateAuthority();
                onClose();
              }}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminEditModal;
