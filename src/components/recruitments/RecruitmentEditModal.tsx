import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  MenuItem,
} from '@chakra-ui/react';
import React, { FC } from "react";
import { Request } from "../../../types";
import { RecruitmentForm } from "./RecruitmentForm";
import { useDisclosure } from "@chakra-ui/react";

type Props = {
  request: Request;
};

export const RecruitmentEditModal: FC<Props> = ({ request }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const requestId = request?.id;
  const requestInputs = {
    title: request?.title,
    startDay: request?.startDay,
    startTime: request?.startTime,
    endDay: request?.endDay,
    endTime: request?.endTime,
    applicant: request?.applicant,
    person: request?.person,
    moreless: request?.moreless,
    level: request?.level,
    content: request?.content,
  };

  return (
    <>
      <MenuItem onClick={onOpen}>編集</MenuItem>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RecruitmentForm requestId={requestId} pageType="edit" requestInputs={requestInputs} onClose={onClose} />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" colorScheme='blue' mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  );
};
