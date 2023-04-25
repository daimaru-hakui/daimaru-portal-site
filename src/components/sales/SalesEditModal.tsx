import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { FC } from "react";
import { db } from "../../../firebase";
import { Sale } from "../../../types";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEdit } from "react-icons/fa";

type Props = {
  sale: Sale;
};

type Inputs = {
  currentTarget: number;
  currentAchieve: number;
  currentExpect: number;
};

export const SalesEditModal: FC<Props> = ({ sale }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm<Inputs>({
    defaultValues: {
      currentTarget: Number(sale?.currentTarget),
      currentAchieve: Number(sale?.currentAchieve),
      currentExpect: Number(sale?.currentExpect),
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateSales(data, sale?.id);
    onClose();
  };
  // 売上データ更新
  const updateSales = async (data: Inputs, docId: string) => {
    const docRef = doc(db, "sales", `${docId}`);
    try {
      await updateDoc(docRef, {
        currentTarget: Number(data?.currentTarget),
        currentAchieve: Number(data?.currentAchieve),
        currentExpect: Number(data?.currentExpect),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <FaEdit cursor="pointer" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box fontSize="xs" textAlign="right">
                単位：万円
              </Box>
              <Stack spacing={6}>
                <Box>
                  <Text>■ 予算</Text>
                  <Input
                    mt={2}
                    placeholder="予算を入力してください"
                    {...register("currentTarget")}
                  />
                </Box>
                <Box>
                  <Text>■ 実績</Text>
                  <Input
                    mt={2}
                    placeholder="実績を入力してください"
                    {...register("currentAchieve")}
                  />
                </Box>
                <Box>
                  <Text>■ 計上予定</Text>
                  <Input
                    mt={2}
                    placeholder="計上予定を入力してください"
                    {...register("currentExpect")}
                  />
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                variant="ghost"
                onClick={() => {
                  onClose();
                  reset();
                }}
              >
                閉じる
              </Button>
              <Button colorScheme="blue" type="submit">
                更新
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
