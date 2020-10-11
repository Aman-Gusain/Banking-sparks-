import React from "react";
import "./Banking.css";
import { Switch, Route } from "react-router-dom";
import ViewAll from "../ViewAll/ViewAll";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Transactions from "../Transactions/Transactions";

const Root = () => {
   return (
      <div>
         <Header />
         <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/viewAll" component={ViewAll} />
            <Route path="/transactions" component={Transactions} />
         </Switch>
      </div>
   );
};
export default Root;
