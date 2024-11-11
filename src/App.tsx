import "./App.css";
import Tasks from "./containers/Tasks/Tasks.tsx";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Tasks />}></Route>
      </Routes>
    </>
  );
};

export default App;
