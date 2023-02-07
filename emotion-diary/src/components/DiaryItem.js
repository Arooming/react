import MyButton from "./MyButton";
import { Navigate, useNavigate } from "react-router-dom";

const DiaryItem = ({ id, emotion, content, date }) => {
  const navigate = useNavigate();

  // 전달받은 date 값을 기준으로 ms 생성 가능
  const strDate = new Date(parseInt(date)).toLocaleDateString();

  const goDetail = () => navigate(`/diary/${id}`);
  const goEdit = () => navigate(`/edit/${id}`);

  return (
    <div className="DiaryItem">
      {/* 우리가 원하는 감정 이미지는 작은 네모 안에 꽉 차는 거라서 일단 그렇게 하려면 className을 아래처럼 정의해야됨 */}
      <div
        className={[
          "emotion_img_wrapper",
          `emotion_img_wrapper_${emotion}`,
        ].join(" ")}
        onClick={goDetail}
      >
        <img src={process.env.PUBLIC_URL + `assets/emotion${emotion}.png`} />
      </div>
      <div className="info_wrapper" onClick={goDetail}>
        <div className="diary_date">{strDate}</div>
        <div className="diary_content_preview">{content.slice(0, 25)}</div>
      </div>
      <div className="btn_wrapper">
        <MyButton text={"수정하기"} onClick={goEdit} />
      </div>
    </div>
  );
};

export default DiaryItem;
