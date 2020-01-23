import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactoFormExample from "./ReactoFormExample";
import ReactoFormExampleMUI from "./ReactoFormExampleMUI";
import ReactoFormHookExample from "./ReactoFormHookExample";
import ReactoFormHookExampleMUI from "./ReactoFormHookExampleMUI";
import ReactoFormHookExampleUpdateMUI from "./ReactoFormHookExampleUpdateMUI";
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [updateFormData, setUpdateFormData] = useState({
    firstName: "Existing",
    lastName: "Name"
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

export default App;
