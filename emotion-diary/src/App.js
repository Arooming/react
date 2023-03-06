import React, { useReducer, useRef, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit.js";
import Diary from "./pages/Diary";

// reducer: 변경되는 로직 처리하는 한 가지의 통로
// 따라서 newState가 변화할 때마다 localStorage에 넣어주면 됨!
const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      /* const newItem = {
        ...action.data,\
        
        // 여기서 바로 return하지 않고, newState라는 변수에 새로운 state로 바뀔 값 넣어줌
        newState = [newItem, ...state];
      }; */
      newState = [action.data, ...state];
      // return을 하지 않을거면 default까지 가지 않도록 break 걸어주기
      break;
    }
    case "REMOVE": {
      // targetId를 필터링한 나머지 요소들을 배열로 만들어서 newState로 전달
      newState = state.filter((it) => it.id !== action.targetId);
      // return을 하지 않을거면 default까지 가지 않도록 break 걸어주기
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
    // default 반드시 정의해줘야 함!
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

// 상태관리 로직에 context 만들기 -> 우리가 만든 data state를 컴포넌트 트리 전역에 공급하기 위한 작업
export const DiaryStateContext = React.createContext();
// 상태관리 로직에 context 만들기 -> 우리가 만든 dispatch 함수들(onCreate, onRemove, onEdit)을 컴포넌트 트리 전역에 공급하기 위한 작업
export const DiaryDispatchContext = React.createContext();

// dummyData 생성해서 임의의 일기 데이터 만들어줌 -> 최신 순, 가장 오래된 순, 좋은 감정 순 등등 이런 식으로 필터링 하기 위해서!
/* localStorage 활용하기 위해서 dummyData 없애줌 
const dummyData = [
  {
    id: 1,
    emotion: 1,
    content: "오늘의 일기 1번",
    date: 1675691387992,
  },
  {
    id: 2,
    emotion: 2,
    content: "오늘의 일기 2번",
    date: 1675691387993,
  },
  {
    id: 3,
    emotion: 3,
    content: "오늘의 일기 3번",
    date: 1675691387994,
  },
  {
    id: 4,
    emotion: 4,
    content: "오늘의 일기 4번",
    date: 1675691387995,
  },
  {
    id: 5,
    emotion: 5,
    content: "오늘의 일기 5번",
    date: 1675691387996,
  },
]; */

function App() {
  // useEffect(() => {
  /* localStorage에 저장한 item은 Storage에서 따로 삭제하지 않으면, 해당 코드를 지워도 그대로 들어가 있음 */
  /* localStorage에 (key: "item1", value: 10)인 item을 저장해라 */
  // localStorage.setItem("item1", 10);
  // localStorage.setItem("item2", "20");
  /* 객체의 경우, string으로 변환하여 직렬화 시켜줘야 제대로 된 값이 들어감 */
  // localStorage.setItem("item3", JSON.stringify({ value: 30 }));
  // const item1 = parseInt(localStorage.getItem("item1"));
  // const item2 = localStorage.getItem("item2");
  /* 객체를 꺼내려면 JSON.parse() 해줘야 원하는 객체 형태로 꺼낼 수 있음 */
  // const item3 = JSON.parse(localStorage.getItem("item3"));
  // console.log({ item1, item2, item3 });
  // }, []);

  // useReducer(): state 관리에 사용됨
  // useReducer(reduce함수 전달, data의 기본 state는 빈 배열로 설정);
  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const localData = localStorage.getItem("diary");
    if (localData) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      dataId.current = parseInt(diaryList[0].id) + 1;

      dispatch({ type: "INIT", data: diaryList });
    }
  }, []);

  // 일기가 추가되면 id에도 +1을 해주기 위해 useRef()로 dataId 생성
  // 새로운 일기 생성 시, key가 겹치지 않도록 다음 일기인 6번을 default 값으로 지정
  const dataId = useRef(6);

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
  // 어떤 일기를 지울지 targetId 받아오기
  const onRemove = (targetId) => {
    dispatch({
      type: "REMOVE",
      targetId,
    });
  };

  // EDIT
  // 일기의 모든 부분을 수정할 수 있게 하기 위해서 다 받아오기
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        // id는 targetId로 유지하면서 나머지는 다 바꿈
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  return (
    // 이 context에 데이터를 공급하기 위해서는 컴포넌트 트리의 전체(App() 컴포넌트의 return 부분)를 <DiaryStateContext.Provider>로 감싸주면 됨
    // 그리고 value에 data 주기
    <DiaryStateContext.Provider value={data}>
      {/* 최적화는 신경쓰지 않고 일단 이렇게 전달해주기 */}
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
