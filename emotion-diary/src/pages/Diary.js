import { useParams } from "react-router-dom";

const Diary = () => {
  //  useParams(): react-router-dom이 제공하는 함수 (custom hook)
  // path variable 이용
  const { id } = useParams();
  console.log(id);

  return (
    <div>
      <h1>Diary</h1>
      <p>이곳은 일기 상세 페이지 입니다.</p>
    </div>
  );
};

export default Diary;
