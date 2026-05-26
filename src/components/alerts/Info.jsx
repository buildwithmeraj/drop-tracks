import { MdInfo } from "react-icons/md";

const InfoMsg = ({ message, sm }) => {
  return (
    <div
      role="alert"
      className={`alert alert-info alert-soft mt-2 ${sm ? `text-sm p-1` : ` text-lg p-2`}`}
    >
      <MdInfo className="-mr-2 mt-0.5" size={20} />
      {message}
    </div>
  );
};

export default InfoMsg;
