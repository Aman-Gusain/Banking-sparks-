import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Root from "./Banking/Banking";

function App() {
   return (
      <div className="App">
         <BrowserRouter>
            <Switch>
               <Route path="/" component={Root} />
               
            </Switch>
         </BrowserRouter>
      </div>
   );
}

export default App;
