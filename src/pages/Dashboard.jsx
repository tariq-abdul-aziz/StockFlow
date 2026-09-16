import React from "react";
import Cards from "../components/Cards";
import Sidebar from "../components/Sidebar";
import ActivitySection from "../components/ActivitySection";
import QuickAction from "../components/QuickAction";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="midContainer flex flex-col">
        <Cards />
        <div className="submidContainer p-5">
          <ActivitySection />
        </div>
        <QuickAction />
      </div>
    </div>
  );
};

export default Dashboard;
