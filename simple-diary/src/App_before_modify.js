import { useRef, useReducer, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

/* 일기랑 똑같은 형식으로 더미 리스트 생성
 const dummyList = [
  {
    id: 1,
    author: "서아름",
    content: "hi 1",
    emotion: 5,
    // 일기의 작성일 생성 - 시간 객체 생성(new Date(): 현재 시간 기준으로 생성됨)
    // getTime() 활용 -> Date 객체를 ms 단위로 반환시킴(number) -> 나중에 string으로 변환시킬 때 편하라고!
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: "홍길동",
    content: "hi 1",
    emotion: 1,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: "아무개",
    content: "hi 1",
    emotion: 4,
    created_date: new Date().getTime(),
  },
]; */

// 0번째 인자 - 상태 변화가 일어나기 직전 state
// 1번째 인자 - 어떤 상태 변화를 일으켜야 하는지에 대한 정보 담겨 있는 action 객체
const reducer = (state, action) => {
  // switch, action객체에 담겨 있는 type property 활용해서 상태 변화 처리
  // reducer가 return 하는 값이 새로운 상태의 값이 됨
  switch (action.type) {
    case "INIT": {
      // 아래에서 data: initData로 지정해줬기 때문에, 해당 action의 data 값을 리턴해주면 그 값은 새로운 state가 됨
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
    // 반드시 default 정의해줘야함 (상태 변화가 일어났는데 상태가 그대로이면 안되니까)
    default:
      return state;
  }
};

function App() {
  // 일기 데이터 관리할 state (처음엔 일기가 없으니까 빈 배열로 시작)
  // const [data, setData] = useState([]);
  // 데이터가 추가될 때마다 id가 1씩 증가해야함 -> 변수처럼 사용하기 위해 useRef() 활용하여 dataId 생성
  // default 값으로 0 입력

  // useReducer : 복잡한 상태변화 로직을 컴포넌트 밖으로 분리하기 위해 useState 대신 사용
  // 배열 비구조 할당의 0번째 인자는 항상 state가 됨, 1번째 인자는 항상 dispatch로 작성해주기
  // useReducer는 두개의 인자 받아야 함
  // 0번째 인자 - reducer: 상태변화를 처리할 함수, 1번째 인자 - data state의 초기값
  // dispatch는 함수형 업데이트 필요없이, 호출하면 알아서 현재의 state를 reduce 함수가 참조해서 자동으로 업데이트 해줌
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  // async 키워드와 함께 사용하여 getData() 함수가 Promise<void>를 반환하는 비동기 함수로 만들어줌
  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    // res 상수에 저장된 email - author, body - content 값으로 활용해보겠음
    // map(): 배열의 모든 요소를 순회해서 map()의 콜백함수 내에서 리턴하는 값을 모아서 배열을 만들어서 initData 값에 집어넣겠다~
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    // reducer는 action 객체를 받는데, action의 type은 'INIT'이고 action에 필요한 데이터는 initData이다
    // 이제부터 setData()가 할 일을 reducer가 하게 될테니까 아래의 setData()는 없애줌
    dispatch({ type: "INIT", data: initData });

    // 일기 데이터 초기값 설정
    //setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  /* onCreate 함수를 원문 그대로 DiaryEditor에게 보내주고 싶은 것이지 이 함수가 어떤 값을 반환하기를 원치는 않음!
     따라서 useMemo()는 사용할 수 없음 
    => useCallback() 사용가능! useCallback : memoization된 콜백 반환 (우리가 원하는 함수 원문 그대로 반환)
  */
  // 새로운 일기 추가 함수
  // 다이어리에 작성한 author, content, emotion을 onCreate 함수가 받아서 setData() 이용하여 data를 업데이트 시키는 로직
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      // 여기서 data를 정의해줬으니까 아래의 newItem, setData 부분은 지워줌
      // 아래의 created_data는 reducer 함수에서 따로 정의하겠음
      data: { author, content, emotion, id: dataId.current },
    });

    // 현재 시간
    // const created_date = new Date().getTime();
    // 새로운 item으로 추가되어야 하는 것
    /* const newItem = {
      author,
      content,
      emotion,
      created_date,
      // 처음엔 여기서 0을 가리킴 (default 값으로 0을 줬으니까)
      id: dataId.current,
    }; */
    // 위에서 0번을 한번 썼으니까 다음 아이템에는 +1이 된 id 부여해야됨
    dataId.current += 1;
    // 원래 데이터 위에 newItem을 추가하는 형태
    // setData([...data, newItem])으로 하면 원래 데이터 맨 뒤에 newItem 추가됨
    // setData([newItem, ...data]);

    // 아이템을 추가한 데이터를 리턴하는 콜백함수를 setData 함수에 전달하는 형태
    // 이런 식으로 상태변화 함수(setState)에 함수를 전달하는 것 === 함수형 업데이트
    // 이렇게 되면 밑에 deps(dependency array)를 비워도 항상 최신의 state를 인자(data)를 통해 참고할 수 있게 됨
    // setData((data) => [newItem, ...data]);

    // useCallback()의 두번째 인자(deps/ dependency array)로 빈 배열을 줘서 mount되는 시점에 한번만 만들고, 그 다음부터는 첫번째 만들었던 함수를 재사용하도록 함
    /* 그러면 컴포넌트가 mount되는 시점에 한번만 생성되기 때문에, onCreate 함수가 마지막 생성되었을때 data state 값은 빈 배열이 되기 때문에
     새로운 데이터 저장 시 원래 있던 20개의 데이터가 다 날라가고 방금 만든 하나만 남게 됨 */
  }, []);

  // 삭제를 하면 해당 배열을 제외한 새로운 배열을 만들어야함
  const onRemove = useCallback((targetId) => {
    // ~~ id를 가진 일기를 지우라고 전달할거니까 targetId만 넘겨주면 됨
    // 이렇게 하면 또 아래의 setData()가 필요없어지니까 지워주면됨
    dispatch({ type: "REMOVE", targetId });

    // console.log(`${targetId}가 삭제되었습니다`);

    // filter 이용해서 원래 다이어리 리스트(data)에서 targetId 번째 요소가 포함되지 않은 id로만 새로운 배열 만들어줌
    // const newDiaryList = data.filter((it) => it.id !== targetId);
    // newDiaryList를 setData에 전달
    // setData(newDiaryList)

    // setData함수에 전달되는 파라미터(data)에 최신 state가 전달되기 때문에
    // 항상 최신 state를 이용하기 위해서는 함수형 업데이트의 인자부분 데이터 + 리턴 부분의 데이터 사용해줘야함
    // setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  // targetId를 id로 갖는 배열 원소를 수정하길 원함
  // 어떻게 content를 변경시킬 건지 정하는 newContent
  const onEdit = useCallback((targetId, newContent) => {
    // 이렇게 하면 또 아래의 setData()는 필요없어지니까 지우면 됨
    dispatch({ type: "EDIT", targetId, newContent });

    /* setData((data) =>
      // 원본 data 배열에 map이라는 함수 이용해서 모든 요소 순회하면서 새로운 배열(수정이 완료된 배열) 만들어서 setData에 전달
      data.map((it) =>
        // 원본 데이터 가져오고, 교체/수정 대상이라면 content를 newContent로 교체
        // 교체/수정 대상이 아니라면 원래 있던 데이터 리턴
        it.id === targetId ? { ...it, content: newContent } : it
      )
    ); */
  }, []);

  // return을 가지고 있는 함수를 memoization 해서 최적화하기 위해 useMemo() 사용
  /* return까지의 연산을 최적화하고 싶다면 useMemo() 사용해서 dependency array에 어떤 값이 변화할 때 해당 연산을 사용할 지
    명시해주게 되면 해당 함수를 값처럼 사용해서 연산 최적화를 할 수 있다..! */
  const getDiaryAnalysis = useMemo(() => {
    // console.log("일기 분석 시작")

    // 기분 좋은 일기가 몇 개 있는지 세는 상수 변수
    // 일기 데이터 중에 emotion이 3 이상인 것만 추려서 그 배열의 길이 저장
    const goodCount = data.filter((it) => it.emotion >= 3).length;

    // 기분 나쁜 일기가 몇 개 있는지 세는 상수 변수
    // 일기 데이터 중의 개수 - goodCount
    const badCount = data.length - goodCount;

    const goodRatio = (goodCount / data.length) * 100;

    return {
      goodCount,
      badCount,
      goodRatio,
    };
    // data.length가 변화하지 않으면 위에 있는 return 값을 계산없이 그대로 반환
  }, [data.length]);

  // getDiaryAnalysis()가 결과 값을 객체로 반환하니까 이 함수를 호출할 때도 비구조 할당으로 받아오기
  // useMemo()를 활용해서 최적화를 시키면 더이상 getDiaryAnalysis는 함수가 아닌 값을 리턴받게 됨(useMemo로 부터)
  // 따라서 getDiaryAnalysis();로 표현하면 에러 발생 -> getDiaryAnalysis;라고 표기해야함 (함수가 아닌 값으로 사용해야 함)
  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      {/* DiaryEditor에 props로 onCreate 함수 내려줌 */}
      <DiaryEditor onCreate={onCreate} />

      <div>전체 일기: {data.length}</div>
      <div>기분 좋은 일기 개수: {goodCount}</div>
      <div>기분 나쁜 일기 개수: {badCount}</div>
      <div>기분 좋은 일기 비율: {goodRatio}</div>

      {/* 이런 형식으로 전달하면 DiaryList 컴포넌트에서 diaryList라는 이름으로 dummyList를 props로 전달받을 수 있음
      <DiaryList diaryList={dummyList} /> */}

      {/* DiaryItem의 부모인 DiaryList에 props 내려줌 */}
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
