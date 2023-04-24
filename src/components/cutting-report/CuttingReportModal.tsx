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
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { CuttingReportType } from "../../../types/CuttingReportType";
import { useCuttingReport } from "../../hooks/useCuttingReport";
import CuttingReportTr from "./CuttingReportTr";

type Props = {
  report: CuttingReportType;
};

const CuttingReportModal: NextPage<Props> = ({ report }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getSerialNumber } = useCuttingReport();

  return (
    <>
      <Button
        size="xs"
        variant="outline"
        colorScheme="facebook"
        onClick={onOpen}
      >
        詳細
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex alignItems="center" gap={3}>
              裁断報告書
            </Flex>
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <Flex
                gap={6}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent={{ base: "flex-start", md: "space-between" }}
              >
                <Flex
                  gap={6}
                  flex="1"
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <Box>
                    <Text fontWeight="bold">裁断報告書</Text>
                    <Box>No.{getSerialNumber(report?.serialNumber)}</Box>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">裁断日</Text>
                    <Box>{report?.cuttingDate}</Box>
                  </Box>
                </Flex>
                <Box>
                  <Text fontWeight="bold">担当者</Text>
                  <Box>{report?.username}</Box>
                </Box>
              </Flex>
              <Flex
                alignItems="stretch"
                flexDirection={{ base: "column", md: "row" }}
                gap={6}
              >
                <Stack spacing={6} w="full">
                  <Flex gap={6} flexDirection={{ base: "column", md: "row" }}>
                    <Box>
                      <Text fontWeight="bold">加工指示書</Text>
                      <Box>No.{report?.processNumber}</Box>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">受注先名</Text>
                      <Box>{report?.client}</Box>
                    </Box>
                  </Flex>
                  <Flex gap={6} flexDirection={{ base: "column", md: "row" }}>
                    <Box>
                      <Text fontWeight="bold">種別</Text>
                      <Box>{report?.itemType === "1" ? "既製" : "別注"}</Box>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">品名</Text>
                      <Box>{report?.itemName}</Box>
                    </Box>
                  </Flex>
                  <Flex gap={6}>
                    <Box>
                      <Text fontWeight="bold">枚数</Text>
                      <Box textAlign="right">{report?.totalQuantity}</Box>
                    </Box>
                  </Flex>
                </Stack>
                {report?.comment && (
                  <Box w="full">
                    <Text fontWeight="bold">明細・備考</Text>
                    <Box
                      h="full"
                      p={3}
                      mt={2}
                      border="1px"
                      borderColor="gray.100"
                    >
                      {report?.comment}
                    </Box>
                  </Box>
                )}
              </Flex>

              <TableContainer>
                <Table variant="simple" mt={6}>
                  <Thead>
                    <Tr>
                      <Th>種別</Th>
                      <Th>生地品番</Th>
                      <Th>色</Th>
                      <Th>品名</Th>
                      <Th isNumeric>数量</Th>
                      <Th isNumeric>用尺</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {report?.products?.map((product: any, index) => (
                      <CuttingReportTr
                        key={index}
                        product={product}
                        report={report}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CuttingReportModal;
