import React from "react";

const NotReadyContainer = ({ beginningMonth }: { beginningMonth: number }) => {
  return (
    <div className="text-center text-gray-500 px-4 py-2">
      {beginningMonth}월 메뉴는 아직 준비 중입니다
    </div>
  );
};

export default NotReadyContainer;
