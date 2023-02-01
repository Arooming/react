import React, { useEffect, useState } from "react";

const Lifecycle = () => {
  /* const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 컴포넌트가 mount 되는 순간에만 동작함 (dependency array = 빈 배열 [])
  useEffect(() => {
    // call-back 함수
    console.log("Mount!");
    // dependency array로는 빈 배열
  }, []);

  // 컴포넌트가 update 되는 순간마다 동작함(dependency array = null/ 아무것도 주지 않음)
  useEffect(() => {
    // call-back 함수
    console.log("Update!");
  });

  // dependency array의 값이 변화하게 되면, 그 순간 call-back 함수가 실행됨
  useEffect(() => {
    // call-back 함수
    console.log(`count is update! ${count}`);
    if (count > 5) {
      alert("count가 5를 넘었습니다. 1로 초기화 합니다.");
      setCount(1);
    }
  }, [count]);

  // 즉, dependency array를 잘 활용하면 감지하고 싶은 값만 감지해서 그 값이 변화하는 순간에만 call-back 함수 수행하도록 바꿀 수 있음!
  useEffect(() => {
    // call-back 함수
    console.log(`text is update! ${text}`);
  }, [text]); */

  const UnmountTest = () => {
    useEffect(() => {
      console.log("Mount!");

      // useEffect() 내부에 함수를 하나 만들면 Unmount 때 실행하게 할 수 있음
      return () => {
        //Unmount 시점에 실행하게 됨
        console.log("Unmount!");
      };
    }, []);

    return <div>Unmount Testing Component</div>;
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  return (
    <div style={{ padding: 20 }}>
      {/* <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div> */}

      <button onClick={toggle}>ON/OFF</button>

      {/* 단락회로 평가를 하는 구문 
          - isVisible === true ? && 연산에 의해 아래 단락이 true가 돼서 <UnmountTest />가 반환되어 화면에 렌더링 됨
          - isVisible !== true ? && 연산에 의해 아래 단락이 false가 돼서 <UnmountTest />가 반환되지 않아 렌더링 안됨
      */}
      {isVisible && <UnmountTest />}
    </div>
  );
};

export default Lifecycle;
