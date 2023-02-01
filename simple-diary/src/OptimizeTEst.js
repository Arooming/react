import React, { useState, useEffect } from "react";

/* 
// TextView나 CountView 둘 중 하나만 상태가 변경되어도 부모 컴포넌트인 OptimizeTest에서 리렌더링이 일어나기 때문에 둘 다 리렌더링이 됨
// 따라서 이를 방지하고 최적화를 하기 위해 고차 컴포넌트인 React.memo()로 감싸주기
// {}에 들어있는 props가 변하지 않으면 절대로 렌더링이 일어나지 않음
const TextView = React.memo(({ text }) => {
  useEffect(() => {
    console.log(`Update :: Text : ${text}`);
  });
  return <div>{text}</div>;
}); 

const CountView = React.memo(({ count }) => {
  console.log(`Update :: Count : ${count}`);
  return <div>{count}</div>;
});
 */

const CounterA = React.memo(({ count }) => {
  // CounterA가 리렌더링이 일어났을 때 count의 값은 count props의 값이었다
  useEffect(() => {
    console.log(`CounterA Update - count : ${count}`);
  });

  return <div>{count}</div>;
});

// JavaScript에서는 비교 시 얕은 비교(객체 주소에 의한 비교/ 값에 의한 비교 XX)를 하기 때문에 원래대로라면 상태변화가 없으니까 리렌더링이 일어나지 않아야 하는데 얘는 일어나버림
const CounterB = React.memo(({ obj }) => {
  // CounterB가 리렌더링이 일어났을 때 count의 값은 obj props의 count property 값이었다
  useEffect(() => {
    console.log(`CounterB Update - count : ${obj.count}`);
  });
  return <div>{obj.count}</div>;
});

// return true; -> prevProps === nextProps -> re-rendering 일으키지 XX!
// return false; -> prevProps !== nextProps -> re-rendering 일으킴!
const areEqual = (prevProps, nextProps) => {
  /* 이 식을 아래처럼 표현하는 것이 더 깔꿈쓰 
  if (prevProps.obj.count === nextProps.obj.count) {
    return true;
  }
  return false; */

  return prevProps.obj.count === nextProps.obj.count;
};

// areEqual() 함수가 React.memo의 비교 함수로 작용, CounterB는 areEqual() 함수의 판단에 따라서 리렌더링 여부가 결정되는 메모화된 컴포넌트가 됨
/* React.memo()는 컴포넌트를 반환하는 고차컴포넌트이기 때문에,
   CounterB를 memoization한 CounterB를 사용하기 위해서는 아래에서 렌더한 CounterB 부분(line 87)을 MemoizedCounterB로 바꿔줘야 함 */
const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  /* const [count, setCount] = useState(1);
  const [text, setText] = useState(""); */

  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div style={{ padding: 50 }}>
      {/* <div>
        <h2>count</h2>
        <CountView count={count} />
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h2>text</h2>
        <TextView text={text} />
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div> */}
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />

        {/* setCount()로 상태변화를 일으켰지만 그 안에 props로 count를 줌으로써 결국 변화없이 count 값 그대로 유지됨 */}
        <button onClick={() => setCount(count)}>A Button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />

        {/* setObj()에서 새로운 객체인 {count: obj.count}를 할당하는데 그 값이 결국엔 count : 1 이니까 count 값 유지 */}
        <button onClick={() => setObj({ count: obj.count })}>B Button</button>
      </div>
    </div>
  );
};

export default OptimizeTest;
