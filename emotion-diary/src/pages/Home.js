import { useState, useContext, useEffect } from "react";
import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";
import DiaryList from "./../components/DiaryList";
import { DiaryStateContext } from "../App";

const Home = () => {
  const diaryList = useContext(DiaryStateContext);

  // 일기가 작성된 달에만 해당 일기가 표시되야 하기 때문에 가공된 일기 데이터를 보여주기 위해서 가공된 데이터를 state로 관리
  const [data, setData] = useState([]);

  // Header에 날짜 저장할 state 생성
  const [curDate, setCurDate] = useState(new Date());

  // .getFullYear: curDate에 저장된 년 정보를 가져올 수 있음
  // .getMonth: curDate에 저장된 월 정보를 가져올 수 있음
  // 단, getMonth로 월을 가져올 경우 1월 -> 0으로 표기되기 때문에 우리가 원하는대로 보여주려면 + 1 해야됨
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  // 정신 안차리고 useEffect = () 이라고 표현해서 제대로 동작안함;;;
  // useEffect()임!!! -> useEffect()에 대해서 다시 공부해보기
  // curDate가 변화하는 순간에만 diaryList에서 해당하는 일기 뽑아올 거니까 useEffect 사용
  useEffect(
    () => {
      if (diaryList.length >= 1) {
        // 현재 년, 월의 1일에 해당하는 데이터를 firstDay가 가지게 됨
        const firstDay = new Date(
          curDate.getFullYear(),
          curDate.getMonth(),
          1
        ).getTime();

        const lastDay = new Date(
          curDate.getFullYear(),
          curDate.getMonth() + 1,
          /* 0시, 23시, 59분, 59초 */
          0,
          23,
          59,
          59
        ).getTime();

        // firstDay는 한 달이 시작될 때(1일), lastDay는 한 달이 끝날 때(다음 달의 0일 -> 기준 달의 마지막 일)
        // 이렇게 해주면 dummyData 안에 현재 달이 아닌 다른 날에 작성된 일기를 추가했을 경우에도 현재 화면에서는 5개의 일기만 출력됨!
        setData(
          diaryList.filter((it) => firstDay <= it.date && lastDay >= it.date)
        );
      }
    },
    // diaryList를 deps에 전달하지 않게되면, diaryList가 바꼈을 때 useEffect가 동작하지 않음
    // 일기가 추가/삭제/수정되면 저장된 diaryList도 변경이 되야하기 때문에!
    [diaryList, curDate]
  );

  // data state가 바뀔 때마다 console 출력
  useEffect(() => {
    console.log(data);
  }, [data]);

  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
    );
  };
  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
    );
  };

  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
        rightChild={<MyButton text={">"} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data} />
    </div>
  );
};

export default Home;
