const StudentFooter = () => {
  return (
    <footer className="flex-col gap-2 font-medium grid sm:grid-cols-2 text-center border-y mb-6 divide-x py-2 divide-y sm:divide-y-0 text-gray-600">
      <div className="py-2">
        <div>
          <span>예금주: </span>
          <span>유정미</span>
        </div>
        <div>
          <span>계좌: </span>
          <span>국민은행 475401-04-247381</span>
        </div>
      </div>
      <div className="flex flex-col py-2">
        <span className="">평일 오전 8시에서 오후 5시까지 고객센터 운영</span>
        <span>010-6799-0830</span>
      </div>
    </footer>
  );
};

export default StudentFooter;
