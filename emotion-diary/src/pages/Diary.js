import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getStringDate } from "../util/date";
import MyHeader from "../components/MyHeader";
import MyButton from "../components/MyButton";
import { emotionList } from "../util/emotion";
import { isCursorAtEnd } from "@testing-library/user-event/dist/utils";

const Diary = () => {
  //  useParams(): react-router-dom이 제공하는 함수 (custom hook)
  // path variable 이용
  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );
      // 일기가 존재할 때
      if (targetDiary) {
        setData(targetDiary);
      }
      // 일기가 없을 때
      else {
        alert("없는 일기 입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [id, diaryList]);

  if (!data) {
    return <div className="DiaryPage">로딩 중입니다...</div>;
  } else {
    // emotion_id, emotion_img, emotion_descript까지 갖다줌
    const curEmotionData = emotionList.find(
      (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
    );

    console.log(curEmotionData);

    return (
      <div className="DiaryPage">
        <MyHeader
          headText={`${getStringDate(new Date(data.date))} 기록`}
          leftChild={
            <MyButton text={"< 뒤로 가기"} onClick={() => navigate(-1)} />
          }
          rightChild={
            <MyButton
              text={"수정하기"}
              onClick={() => navigate(`/edit/${data.id}`)}
            />
          }
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            {/* img 숫자에 따라서 동적인 className 지정 가능 */}
            <div
              className={[
                "diary_img_wrapper",
                `diary_img_wrapper_${data.emotion}`,
              ].join(" ")}
            >
              <img src={curEmotionData.emotion_img} />
              <div className="emotion_descript">
                {curEmotionData.emotion_descript}
              </div>
            </div>
          </section>
          <section>
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
};

export default Diary;
