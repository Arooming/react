import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
// COMPONENTS
import MyButton from "./components/MyButton";
import MyHeader from "./components/MyHeader";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MyHeader
          headText={"App"}
          leftChild={
            <MyButton text={"왼쪽 버튼"} onClick={() => alert("왼쪽 클릭")} />
          }
          rightChild={
            <MyButton
              text={"오른쪽 버튼"}
              onClick={() => alert("오른쪽 클릭")}
            />
          }
        />
        <h2>App.js</h2>

        <MyButton
          text={"버튼"}
          onClick={() => alert("버튼 클릭")}
          type={"positive"}
        />
        <MyButton
          text={"버튼"}
          onClick={() => alert("버튼 클릭")}
          type={"negative"}
        />
        <MyButton text={"버튼"} onClick={() => alert("버튼 클릭")} />

        {/*  <img src={process.env.PUBLIC_URL + `/assets/emotion1.png`} />
        <img src={process.env.PUBLIC_URL + `/assets/emotion2.png`} />
        <img src={process.env.PUBLIC_URL + `/assets/emotion3.png`} />
        <img src={process.env.PUBLIC_URL + `/assets/emotion4.png`} />
        <img src={process.env.PUBLIC_URL + `/assets/emotion5.png`} /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<New />} />
          <Route path="/edit" element={<Edit />} />
          {/* path variable 활용 - 기존의 path ('/diary') 뒤에 /:id 추가 */}
          {/* 이렇게 하면 id가 없는 경우에는 Diary 컴포넌트의 내용이 아무것도 나오지 않게 되지만, 
          이번의 경우 Diary에 id가 없는 경우는 존재하지 않게 할 것이기 때문에 그냥 진행시킴 */}
          <Route path="/diary/:id" element={<Diary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
