import { Outlet } from "react-router-dom";

const Resp = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default Resp;
