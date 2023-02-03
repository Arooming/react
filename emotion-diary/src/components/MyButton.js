const MyButton = ({ text, type, onClick }) => {
  // button type이 positive, negative 중에 하나면 (type)을 그대로 리턴하고, 그게 아니면 무조건 "default"로 리턴
  const btnType = ["positive", "negative"].includes(type) ? type : "default";

  return (
    /* className이랑 컴포넌트 이름 맞춰주기~ */
    /* 이런 식으로 만들어서 type에 따라 MyButton_positive, MyButton_default, MyButton_negatigve 이런 식으로 나옴 */
    /* .join(" ") 써서 공백을 seperator로 해서 붙여줌 */
    <button
      className={["MyButton", `MyButton_${btnType}`].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

MyButton.defaultProps = {
  type: "default",
};

export default MyButton;
