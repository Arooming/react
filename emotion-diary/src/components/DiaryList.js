import Diary from "../pages/Diary";
import { useState } from "react";
import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";

const sortOptionList = [
  { value: "latest", name: "최신 순" },
  { value: "oldest", name: "오래된 순" },
];

const filterOptionList = [
  { value: "all", name: "전부 다" },
  { value: "good", name: "좋은 감정만" },
  { value: "bad", name: "안 좋은 감정만" },
];

// 일기 정렬 기능을 할 컴포넌트 분할하여 생성
// value: ControlMenu가 렌더링하는 <select>가 어떤 걸 선택하고 있는지
// onChange: <select>가 선택하는게 변화했을 때 바꿀 함수
// optionList: <select> 태그 안에 들어갈 옵션
// controlMenu: sortType(정렬 기준)을 변화시키는 <select>의 역할
const ControlMenu = ({ value, onChange, optionList }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ControlMenu"
    >
      {/* it: 첨엔 optionList의 첫번째 옵션 객체를 가리키고 있음 */}
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </select>
  );
};

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();
  // 정렬 기준을 저장할 state 생성
  const [sortType, setSortType] = useState("latest");

  // 감정 필터를 저장할 state 생성
  const [filter, setFilter] = useState("all");

  // 최신 순, 오래된 순을 if문으로 알아내서 정렬된 데이터 반환
  const getProcessedDiaryList = () => {
    const filterCallBack = (item) => {
      if (filter === "good") {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    };

    const compare = (a, b) => {
      if (sortType === "latest") {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    // stringify()의 인자로 들어온 배열을 JSON화 시켜서 문자로 바꿔버림
    // 문자로 바꾼 걸 JSON.parse()해주면 다시 배열로 복구됨 -> 얘를 copyList에 넣어줌
    // 결국, diaryList가 저장하고 있는 배열을 건들지 않고 하기 위해서 이러케 함
    const copyList = JSON.parse(JSON.stringify(diaryList));

    const filteredList =
      filter === "all" ? copyList : copyList.filter((it) => filterCallBack(it));

    // const sortedList = copyList.sort(compare);
    const sortedList = filteredList.sort(compare);
    return sortedList;
  };

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />
          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={filterOptionList}
          />
        </div>
        <div className="right_col">
          <MyButton
            type={"positive"}
            text={"새 일기쓰기"}
            onClick={() => navigate("/new")}
          />
        </div>
      </div>

      {/* {diaryList().map(it) => (
        <div key={it.id}>{it.content}</div>
      )))} */}
      {getProcessedDiaryList().map((it) => (
        // DiaryItem을 사용할 부분!!! -> 이 부분을 DiaryItem으로 변경
        /* <div key={it.id}>
          {it.content} {it.emotion}
        </div> */
        <DiaryItem key={it.id} {...it} />
      ))}
    </div>
  );
};

Diary.diaryList = {
  diaryList: [],
};
export default DiaryList;
