import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

const CatalogArea = () => {
  const catalogItems = [
    {
      link: "https://my.ebook5.net/daimaru-hakui/my-uniform-club/",
      src: "/myuni.jpg",
      alt: "myuni カタログ",
    },
    {
      link: "https://my.ebook5.net/daimaru-hakui/serenade-vol5/",
      src: "/serenade.jpg",
      alt: "serenade カタログ",
    },
  ];
  const linkItems = [
    {
      title: "マイユニポータル",
      link: "https://myuni.vercel.app/catalog",
      color: "rgb(45, 55, 72)",
    },
    {
      title: "ホームページ",
      link: "https://www.daimaru-hakui.co.jp/",
      color: "rgb(49, 74, 151)",
    },
    {
      title: "組織カレンダー",
      link: "https://calendar.nextset.jp/daimaruhakui/gp/calendar.html",
      color: "#00bcd4",
    },
  ];
  return (
    <>
      <Flex
        w="100%"
        boxShadow="xs"
        p={{ base: 0, sm: 3 }}
        rounded="md"
        bg="white"
        justifyContent={{ base: "center" }}
        flexDirection={{ base: "column", md: "row", lg: "column", xl: "row" }}
      >
        <Flex flex="2">
          {catalogItems.map((item) => (
            <Flex flex="1" p="3" justifyContent="center" key={item.link}>
              <Link href={item.link} style={{ fontSize: 0 }} target="_blank">
                <Image src={item.src} alt={item.alt} width={220} height={300} />
              </Link>
            </Flex>
          ))}
        </Flex>
        <Flex
          w="full"
          flex="1"
          color="white"
          flexDirection="column"
          justifyContent="space-between"
          p={3}
        >
          {linkItems.map((item) => (
            <Box h="30%" key={item.title}>
              <Link href={item.link} target={"_blank"}>
                <Flex
                  h="100%"
                  minH="50px"
                  backgroundColor={item.color}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box fontSize={{ base: "xs", md: "md" }}>{item.title}</Box>
                </Flex>
              </Link>
            </Box>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default CatalogArea;
