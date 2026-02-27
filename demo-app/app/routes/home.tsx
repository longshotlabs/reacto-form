import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ReactoFormExample from "../components/ReactoFormExample";
import ReactoFormExampleMUI from "../components/ReactoFormExampleMUI";
import ReactoFormHookExample from "../components/ReactoFormHookExample";
import ReactoFormHookExampleMUI from "../components/ReactoFormHookExampleMUI";
import ReactoFormHookExampleUpdateMUI from "../components/ReactoFormHookExampleUpdateMUI";
import './home.css';

import type { Route } from "./+types/home";

export function loader() {
  return { name: "React Router" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [currentTab, setCurrentTab] = useState(0);
    const [updateFormData, setUpdateFormData] = useState({
      firstName: "Existing",
      lastName: "Name",
      isMarried: true
    });
  
    return (
      <Paper style={{ height: "100%", marginLeft: 30, marginRight: 30 }}>
        <Tabs
          centered
          indicatorColor="primary"
          onChange={(event, newValue) => setCurrentTab(newValue)}
          textColor="primary"
          value={currentTab}
          style={{
            borderBottomColor: "#cccccc",
            borderBottomStyle: "solid",
            borderBottomWidth: 1
          }}
        >
          <Tab label="useReactoForm Hook with Material UI" />
          <Tab label="useReactoForm Hook with Material UI - Update Form" />
          <Tab label="Form with Material UI" />
          <Tab label="useReactoForm Hook" />
          <Tab label="Form" />
        </Tabs>
        <div style={{ margin: 50 }}>
          {currentTab === 0 && <ReactoFormHookExampleMUI />}
          {currentTab === 1 && <ReactoFormHookExampleUpdateMUI setUpdateFormData={setUpdateFormData} updateFormData={updateFormData} />}
          {currentTab === 2 && <ReactoFormExampleMUI />}
          {currentTab === 3 && <ReactoFormHookExample />}
          {currentTab === 4 && <ReactoFormExample />}
        </div>
      </Paper>
    );
}
