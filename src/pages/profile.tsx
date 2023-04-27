import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";

type Inputs = {
  email: string;
};

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const currentUser = useAuthStore((state) => state.currentUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (user !== null) {
      user.providerData.forEach((profile) => {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    }
  }, []);

  const emailUpdate = async (
    currentUser: string | undefined,
    email: string
  ) => {
    await axios
      .post("/api/profile", {
        email: email,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    emailUpdate(currentUser, data.email);
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
                    p="3"
                    placeholder="email address"
                    {...register("email", { required: true })}
                  />
                </InputGroup>
                {errors.email && (
                  <Box color="red" fontSize="sm">
                    ※emailを入力してください
                  </Box>
                )}
              </FormControl>

              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                rounded="5"
              >
                更新
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Profile;
