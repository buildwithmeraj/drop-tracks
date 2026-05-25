import { MdInfo } from "react-icons/md";

const styles = {
  info: {
    className: "alert alert-info",
    icon: MdInfo,
  },
};

const Alert = ({ message, tone = "info" }) => {
  const config = styles[tone] || styles.info;
  const Icon = config.icon;

  return (
    <div className={config.className} role="alert">
      <Icon className="text-lg shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default Alert;
