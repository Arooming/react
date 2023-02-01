import React, { useContext, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

/* 컴포넌트는 자신이 가진 state에 변화가 생겼거나 부모 컨포넌트에서 리렌더링이 일어나거나 
자신이 받은 props가 변경될 때 렌더링이 일어남 */

// onCreate 함수를 props으로 내려받음
/* onCreate: 일기 저장하기 버튼을 눌렀을 때 데이터에 아이템을 추가하는 역할
 onCreate 함수는 App.js가 렌더링될 때마다 다시 만들어짐 -> onCreate() 때문에 DiaryEditor 함수도 계속해서 렌더링됨
 따라서 onCreate 함수가 계속 재생성되지 않아야만 DiaryEditor 컴포넌트를 React.memo와 함께 최적화할 수 있음! */
/* DiaryDispatchContext, provider 생성 전! 
   const DiaryEditor = ({ onCreate }) */

// DiaryDispatchContecxt, provider 생성 후!
const DiaryEditor = () => {
  // 비구조 할당으로 onCreate 가져오기
  const { onCreate } = useContext(DiaryDispatchContext);

  // useRef()는 리렌더링 하지 않음! 컴포넌트의 속성만 조회 & 업데이트함
  // html(Dom 요소) 접근 가능
  const authorInput = useRef();
  const contentInput = useRef();

  const [state, setState] = useState({ author: "", content: "", emotion: 1 });

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      // Dom 요소로 생성한 reference 객체(authorInput)는 현재 가리키는 값을 current 라는 property로 불러와서 사용 가능
      // authorInput.current는 현재 authorInput 태그가 되고, 이 태그에 focus() 라는 기능을 사용한 것!
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }
    // props로 받은 onCreate 호출
    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공!");
    // 일기 쓰고 정상적으로 저장되면, 입력받는 부분을 기본 값으로 초기화
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          ref={authorInput}
          name="author"
          value={state.author}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          ref={contentInput}
          name="content"
          value={state.content}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <span>오늘의 감정 점수: </span>
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleChangeState}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};

// React.memo()로 묶인 DiaryEditor를 밖으로 내보내겠다
export default React.memo(DiaryEditor);
