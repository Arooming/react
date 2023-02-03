import { useNavigate, useSearchParams } from "react-router-dom";

const Edit = () => {
  // query string 받기 (query stringd은 페이지 라우팅에 영향을 주지 않는다~)
  // /edit?id=10&mode=dark  <- 이런 경로를 입력받아야 하는 상황! (그래서 id, mode 필요함)
  const [searchParams, setSearchParams] = useSearchParams();

  // useNavigate(): 페이지 이동시킬 수 있는 함수 반환해줌 -> 해당 함수를 navigate라는 이름으로 받아준 것
  // 로그인 안한 사용자가 다음 페이지로 가려고 하는 경우, 강제로 로그인 화면으로 보내버릴 때 유용하게 쓸 수 있음
  // 링크 태그를 클릭 안 했을 때도 의도적으로 페이지를 바꿔버릴 수 있다~
  const navigate = useNavigate();

  // useParams() 이용 시, 배열 반환 -> 첫번째 반환받는 인덱스(searchParams)는 get 이용하여 전달받은 query string 꺼내서 쓸 수 있음
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");
  console.log("id: ", id, "mode: ", mode);

  return (
    <div>
      <h1>Edit</h1>
      <p>이곳은 일기 수정 페이지 입니다.</p>
      {/* setSearchParams는 searchParams를 변경시키는 역할을 함 -> 기존의 query string을 변경시킬 수 있음*/}
      <button onClick={() => setSearchParams({ who: "arooming" })}>
        QS 바꾸기
      </button>

      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        HOME으로 가기
      </button>

      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        뒤로 가기
      </button>
    </div>
  );
};

export default Edit;
