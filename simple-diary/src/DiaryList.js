import { DiaryDispatchContext, DiaryStateContext } from "./App";
import { useContext } from "react";
import DiaryItem from "./DiaryItem";

// 렌더링 = 화면에 표시한다! 라고 생각하면 쉬움~
// App.js에서 prop으로 전달받은 애들 ({} 안에 있는 요소들) 활용
/* context, provider 생성 전!!
 const DiaryList = ({ onEdit, onRemove, diaryList }) */

/* DiaryDispatchContext 생성 전 
// DiaryStateContext, provider 생성 후 (수정)
const DiaryList = ({ onEdit, onRemove }) */

// DiaryDispatchContext 생성 후
const DiaryList = () => {
  const { onRemove, onEdit } = useContext(DiaryDispatchContext);

  // context에서 값을 꺼내오기 위해서는 useContext라는 훅을 사용하면 됨
  // 인자로는 값을 꺼내고 싶은 context 전달하면 됨
  const diaryList = useContext(DiaryStateContext);
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {/* DiaryList는 onRemove 함수를 사용하지 않지만, DiaryItem한테 내려줘야 함 */}
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} onRemove={onRemove} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

// defaultProps: undefined로 전달될 것 같은 props들의 기본값을 설정할 수 있는 메소드
DiaryList.defaultProps = {
  diaryList: [],
};
export default DiaryList;

/* diaryList로 받은 애들(dummyList) 활용할 때
// map은 key prop을 받지 않으면 error 발생함
// 고유한 id나 배열의 idx 같은 걸로 만들어주면 됨! key = {it.id} 
// 배열의 idx 사용 시 나중에 에러 발생 확률 있기 때문에, 고유한 id 쓰는게 더 좋음
// 이 컴포넌트 안에 일기 수정/삭제 같은 내용 전부 포함하면 에러 발생 확률 높아짐 -> 다른 컴포넌트로 분리!(DiaryItem)
<div>
        {diaryList.map((it) => (
          <div>작성자 : {it.author}</div>
          <div>일기 본문 : {it.content}</div>
          <div>감정 : {it.emotion}</div>
          <div>작성 시간 (ms) : {it.created_date}</div>
        ))}
</div>
*/
