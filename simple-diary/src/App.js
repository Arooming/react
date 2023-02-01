import React, {
  useRef,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

// data state를 전역적으로 공급할 수 있도록 도와주는 context 생성
// 다른 컴포넌트들도 공급자에게 공급받아서 쓸 수 있도록 내보내주기
// export default는 파일 하나 당 하나밖에 쓸 수 없기 때문에 export로 내보내줌
// 따라서 App.js에서는 기본적으로 App 컴포넌트를 내보내고 있고, 부가적으로 DiaryStateContext 같은 애들을 내보내고 있다~
export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    dispatch({ type: "INIT", data: initData });
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    dataId.current += 1;
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

  // useMemo()를 활용하지 않고 dispatches 객체로 함수들을 그냥 전달해주면 app 컴포넌트 재 생성 시, dispatches 객체도 계속 재 생성됨
  // 절대 재생성되는 일이 없도록 deps를 빈 배열로 전달
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;

    return {
      goodCount,
      badCount,
      goodRatio,
    };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      {/* value props로 DiaryStateContext에게 데이터 공급 내려주기
          value props로 Provider 컴포넌트에게 내려준 값은 언제든지 가져다 쓸 수 있음 */}
      <DiaryStateContext.Provider value={data}>
        {/* value props로 DiaryDispatchContext에게 데이터 공급 받으면 더이상 아래에서 onCreate, onEdit, onRemove를 각각 전달받지 않아도 됨
            -> onCreate={onCreate} 요론것들 지워줌 */}
        <DiaryDispatchContext.Provider value={memoizedDispatches}>
          <DiaryEditor />

          <div>전체 일기: {data.length}</div>
          <div>기분 좋은 일기 개수: {goodCount}</div>
          <div>기분 나쁜 일기 개수: {badCount}</div>
          <div>기분 좋은 일기 비율: {goodRatio}</div>

          {/* DiaryList 컴포넌트에서 data 값을 context로부터 잘 꺼내쓰고 있기 때문에 
          App 컴포넌트에서는 더이상 DiaryList 컴포넌트에게 diaryList 데이터를 props로 전달할 필요가 없어짐
          -> diaryList = {data} 부분 지워주기 */}
          <DiaryList />
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </div>
  );
}

export default App;
