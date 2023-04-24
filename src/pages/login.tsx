import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  FormControl,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { auth } from "../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";

type Inputs = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        userCredential.user;
      })
      .catch((error) => {
        alert("失敗しました");
        console.log(error.code);
        console.log(error.message);
      });
  };

  return (
    <Flex
      height="calc(100vh - 60px)"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Stack flexDir="column" justifyContent="center" alignItems="center">
        <Heading color="teal.400">Log in</Heading>
        <Box minW={{ base: "90%", md: "350px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={5}
              p={6}
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              rounded="5"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="email"
                    placeholder="email address"
                    p="3"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <Box color="red">emailを入力してください</Box>
                  )}
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" />
                  <Input
                    type={"password"}
                    placeholder="Password"
                    p="3"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <Box color="red">passwordを入力してください</Box>
                  )}
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                rounded="5"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
