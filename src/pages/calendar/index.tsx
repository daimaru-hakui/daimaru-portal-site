import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";

type Props = {
  calendarData: any;
};

const Calendar: NextPage<Props> = ({ calendarData }) => {
  return (
    <Container maxW="900px" p={6} rounded="md" bg="white" boxShadow="xs">
      <Tabs variant="enclosed">
        <TabList>
          <Tab _focus={{ outline: "none" }}>本社・神戸</Tab>
          <Tab _focus={{ outline: "none" }}>徳島工場</Tab>
        </TabList>

        <TabPanels mt={1}>
          <TabPanel p={0}>
            <img
              src={calendarData.imageHonsha.url}
              alt="本社・神戸カレンダー"
              width="100%"
            />
          </TabPanel>
          <TabPanel p={0}>
            <img
              src={calendarData.imageTokushima.url}
              alt="徳島工場カレンダー"
              width="100%"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Calendar;

export async function getStaticProps() {
  const accessPoint = "https://portal-sub.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "O0RwlD3WSeGgUj5stjZze9mfZEHwh5yAIKOX",
    },
  };

  const calendarRes = await fetch(`${accessPoint}/calendar`, options);
  const calendarData = await calendarRes.json();

  return {
    props: {
      calendarData,
    },
  };
}
