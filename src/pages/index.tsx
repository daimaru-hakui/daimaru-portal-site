import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Information from "../components/toppage/Information";
import QuickLink from "../components/toppage/QuickLink";
import Slogan from "../components/toppage/Slogan";
import CatalogArea from "../components/toppage/CatalogArea";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { AlcoholCheckArea } from "../components/toppage/AlcoholCheckArea";
import { ClaimArea } from "../components/toppage/ClaimArea";
import { RecruitmentArea } from "../components/toppage/RecruitmentArea";
import { SalesArea } from "../components/toppage/SalesArea";
import CuttingReportArea from "../components/toppage/CuttingReportArea";

const Home: NextPage<any> = ({ categoryData, newsData, linkData }) => {
  return (
    <>
      <Head>
        <title>大丸白衣ポータル</title>
        <meta name="description" content="大丸白衣ポータル" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main">
        <Flex w="full" gap={6} flexDirection={{ base: "column", lg: "row" }}>
          <Box flex={1}>
            <Stack spacing={6}>
              <CuttingReportArea />
              <AlcoholCheckArea />
              <ClaimArea />
              <SalesArea />
              <Slogan />
              <Information news={newsData.contents} />
              <QuickLink
                links={linkData.contents}
                categories={categoryData.contents}
              />
              <CatalogArea />
            </Stack>
          </Box>
          <Box flex={1}>
            <RecruitmentArea />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const accessPoint = "https://portal-site.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "5c23d3e8eaa0448388ca527e0e00c829611f",
    },
  };

  const categoryRes = await fetch(
    `${accessPoint}/categories?limit=10`,
    options
  );
  const categoryData = await categoryRes.json();
  const newsRes = await fetch(`${accessPoint}/news?limit=100`, options);
  const newsData = await newsRes.json();
  const linkRes = await fetch(`${accessPoint}/access-link?limit=100`, options);
  const linkData = await linkRes.json();

  return {
    props: {
      categoryData,
      newsData,
      linkData,
    },
  };
};
