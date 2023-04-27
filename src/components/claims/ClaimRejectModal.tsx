import React, { FC, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Claim } from "../../../types";

type Props = {
  claim: Claim;
  onRejectFunc: (claim: Claim, message: string) => void;
};

export const ClaimRejectModal: FC<Props> = ({ claim, onRejectFunc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [message, setMessage] = useState("");
  return (
    <>
      <Button bg="red" colorScheme="white" onClick={onOpen}>
        却下する
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>却下理由</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              mt="4"
              rounded="md"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={2}
              onClick={() => {
                onClose();
                setMessage("");
              }}
            >
              キャンセル
            </Button>
            <Button
              colorScheme="red"
              onClick={() => onRejectFunc(claim, message)}
            >
              却下する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
