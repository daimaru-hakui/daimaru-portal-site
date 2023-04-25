import {
  Box,
  Button,
  Flex,
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
import React, { FC } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { User } from "../../../types";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoadingStore } from "../../../store/useLoadingStore";
import { FaEdit } from "react-icons/fa";

type Props = {
  user: User;
};

type Inputs = {
  rank: number;
  name: string;
};

export const AdminEditModal: FC<Props> = ({ user }) => {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      rank: user.rank,
      name: user.name,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateAuthority(data, user.id);
    onClose();
  };

  const updateAuthority = async (data: Inputs, userId: string) => {
    setIsLoading(true);
    const docRef = doc(db, "authority", `${userId}`);
    try {
      await updateDoc(docRef, {
        rank: Number(data.rank),
        name: data.name,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FaEdit cursor="pointer" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>名前編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <Box>
                  <Text>id</Text>
                  <NumberInput
                    {...register("rank")}
                    min={1}
                    max={10000}
                    onChange={getValues}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
                <Box>
                  <Text>名前</Text>
                  <Input {...register("name", { required: true })} />
                  {errors.name && (
                    <Box color="red">※名前を入力してください</Box>
                  )}
                </Box>
                <Flex gap={3}>
                  <Box>email</Box> {user?.email}
                </Flex>
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
                閉じる
              </Button>
              <Button type="submit" colorScheme="blue">
                更新
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
