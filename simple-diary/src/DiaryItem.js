import React, { useEffect, useRef, useState } from "react";

// props 전달받기
const DiaryItem = ({
  onRemove,
  onEdit,
  id,
  author,
  content,
  emotion,
  created_date,
}) => {
  useEffect(() => {
    console.log(`${id}번 째 아이템 렌더!`);
  });

  const localContentInput = useRef();
  // textarea의 input을 핸들링할 state 생성
  // 수정하기 눌렀을 때, 수정 폼의 기본 값이 수정하기 이전 값으로 들어가도록 default 값을 content로 설정
  const [localContent, setLocalContent] = useState(content);

  // true/false 수정 중인지 아닌지에 대한 값을 넣어놓게 됨
  // true -> 수정 중으로 간주해서 그에 따른 코드 수행
  // false -> 수정 중이 아닌 걸로 간주해서 그냥 가만히 있기
  const [isEdit, setIsEdit] = useState(false);

  // 호출이 되는 순간 원래 isEdit이 갖고 있던 값 반전됨 -> 수정하기 버튼을 누르면 수정 중으로 간주 -> 수정 폼 띄우기
  const toggleIsEdit = () => setIsEdit(!isEdit);

  // window.confirm(): alert 같은 창 나와서 확인/취소 선택할 수 있게 됨
  const handleClickRemove = () => {
    if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
      onRemove(id);
    }
  };

  // 수정 상태에서 나가는 경우
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  // 수정 완료 버튼 눌렀을 때 처리할 함수
  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }

    if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
      // targetId, localContent 전달
      onEdit(id, localContent);
      // 수정 폼 닫아야하니까 toggleIsEdit() 수행
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span className="author_info">
          작성자 : {author} | 감정 점수 : {emotion}
        </span>
        <br />
        <span className="date">
          {new Date(created_date).toLocaleDateString()}
        </span>
      </div>
      <div className="content">
        {isEdit ? (
          <textarea
            ref={localContentInput}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
          />
        ) : (
          content
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={handleClickRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

// DiaryItem 최적화의 시작
export default React.memo(DiaryItem);

// new Date(created_date).toLocaleDateString(): 이렇게 작성하면 우리가 일반적으로 알고 있는 형태의 날짜로 보여줌
