import React, { useReducer, useRef } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reduce = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      /* const newItem = {
        ...action.data,
      }; */
      newState = [action.data, ...state];
      break;
    }
    case "REMOVE": {
      // targetId를 필터링한 나머지 요소들을 배열로 만들어서 newState로 전달
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    // contents만 바꾸는게 아니라 전체를 다 바꾸게 하기 위해서 action.data로 전달
    // action.data.id가 일치하는 요소를 찾아낸 다음, 일치한다면 action.data를 전달하면 됨
    case "EDIT": {
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  return newState;
};

// 이 context에 데이터를 공급하기 위해서는 컴포넌트 트리의 전체(App() 컴포넌트의 return 부분)를 <DiaryStateContext.Provider>로 감싸주면 됨
// 그리고 value에 data 주기
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // data의 기본 state는 빈 배열
  const [data, dispatch] = useReducer(reduce, []);

  const dataId = useRef(0);
  // CREATE (언제 작성됐는지도 받아줄 거라서 date까지 받아줌)
  // 시간, 내용, 감정을 받아서 dispatch data로 전달
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      // 새로운 일기 아이템을 객체로 만들어서 data라는 이름으로 전달
      data: {
        id: dataId.current,
        // onCreate 함수가 인자로 받은 date 넣기 -> 얘를 시간 객체로 만들어서 ms로 바꿔주면 됨
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  };

  // REMOVE
  const onRemove = (targetId) => {
    dispatch({
      type: "REMOVE",
      targetId,
    });
  };

  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      // id는 targetId로 유지하면서 나머지는 다 바꿈
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit" element={<Edit />} />

              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
