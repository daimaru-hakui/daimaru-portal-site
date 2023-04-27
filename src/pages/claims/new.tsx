import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ClaimInputAttached } from "../../components/claims/image/ClaimInputAttached";
import { useAuthStore } from "../../../store/useAuthStore";
import { Claim, User } from "../../../types";
import { useDisp } from "@/hooks/useDisp";
import { useForm, SubmitHandler } from "react-hook-form";
import { claimSelectList2 } from "../../../data";
import { useClaims } from "@/hooks/useClaims";

const ClaimNew = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const [filterUsers, setFilterUsers] = useState<User[]>([]);
  const { getUserName } = useDisp();
  const {
    addClaim,
    fileUpload1,
    fileUpload2,
    fileUpload3,
    setFileUpload1,
    setFileUpload2,
    setFileUpload3,
  } = useClaims();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Claim>();
  const onSubmit: SubmitHandler<Claim> = (data) => {
    addClaim(data);
  };

  //ユーザーリストを取得
  useEffect(() => {
    setFilterUsers(users.filter((user) => user.isoSalesStaff === true));
  }, [users]);

  return (
    <Box
      w={{ base: "full", md: "700px" }}
      mx="auto"
      p={6}
      bg="white"
      rounded="md"
      boxShadow="md"
    >
      <Box textAlign="right">作成者：{getUserName(currentUser)}</Box>
      <Box
        as="h1"
        mt={6}
        fontSize="3xl"
        fontWeight="semibold"
        textAlign="center"
      >
        クレーム報告書
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={10} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            担当者名
          </FormLabel>
          <Select
            mt={2}
            placeholder="担当者を選択"
            {...register("stampStaff", { required: true })}
          >
            {filterUsers.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.name}
              </option>
            ))}
          </Select>
          {errors.stampStaff && (
            <Box color="red">※担当者を選択してください</Box>
          )}
        </FormControl>

        <FormControl mt={10} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            顧客名
          </FormLabel>
          <Input
            p={2}
            mt={3}
            placeholder="顧客名を入力"
            {...register("customer", { required: true })}
          />
        </FormControl>
        {errors.customer && <span>This field is required</span>}
        <FormControl isRequired>
          <FormLabel mt={9} fontSize="lg" fontWeight="semibold">
            発生日
          </FormLabel>
          <Input
            type="date"
            p={2}
            mt={3}
            {...register("occurrenceDate", { required: true })}
          />
        </FormControl>
        <FormControl mt={10} isRequired>
          <FormLabel as="h2" fontSize="lg" fontWeight="semibold">
            発生内容
          </FormLabel>
          <Box w="full" mt={6}>
            <RadioGroup
              colorScheme="blue"
              defaultValue="1"
              {...register("occurrenceSelect", { required: true })}
              onChange={getValues}
            >
              <Box mt={3}>①製品起因</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                <Radio value="1" {...register("occurrenceSelect")}>
                  製品不良
                </Radio>
                <Radio value="2" {...register("occurrenceSelect")}>
                  納品書
                </Radio>
                <Radio value="3" {...register("occurrenceSelect")}>
                  商品間違い
                </Radio>
                <Radio value="4" {...register("occurrenceSelect")}>
                  その他
                </Radio>
              </Stack>
              <Box mt={3}>②受発注</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                <Radio value="5" {...register("occurrenceSelect")}>
                  住所等
                </Radio>
                <Radio value="6" {...register("occurrenceSelect")}>
                  未納品
                </Radio>
                <Radio value="7" {...register("occurrenceSelect")}>
                  その他
                </Radio>
              </Stack>
              <Box mt={3}>③その他</Box>
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                <Radio value="8" {...register("occurrenceSelect")}>
                  その他
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </FormControl>
        <Textarea
          mt={3}
          p={2}
          placeholder="内容を入力"
          {...register("occurrenceContent")}
        />

        <FormControl mt={10}>
          <FormLabel as="h2" fontSize="lg" fontWeight="semibold">
            修正処置
          </FormLabel>
          <Box mt={3}>
            <RadioGroup
              colorScheme="blue"
              {...register("amendmentSelect")}
              onChange={getValues}
            >
              <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                {claimSelectList2.map((list) => (
                  <Radio
                    key={list.id}
                    value={list.id}
                    {...register("amendmentSelect")}
                  >
                    {list.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Textarea
              mt={3}
              p={2}
              placeholder="内容を入力"
              {...register("amendmentContent")}
            />
          </Box>
        </FormControl>

        <Box mt={9}>
          <Box mr={3} fontSize="lg" fontWeight="semibold">
            添付書類（※画像形式 jpeg jpg png）
          </Box>
          <ClaimInputAttached
            fileUpload={fileUpload1}
            setFileUpload={setFileUpload1}
          />
          <ClaimInputAttached
            fileUpload={fileUpload2}
            setFileUpload={setFileUpload2}
          />
          <ClaimInputAttached
            fileUpload={fileUpload3}
            setFileUpload={setFileUpload3}
          />
        </Box>
        <Box mt={12} textAlign="center">
          <Button type="submit" colorScheme="blue">
            提出する
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ClaimNew;
