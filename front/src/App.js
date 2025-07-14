import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Home from "./pages/Home";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
