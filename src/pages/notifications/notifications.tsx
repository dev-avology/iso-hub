



export default function Notifications() {
  return (
    <>
      <div className="user_cont my-10">
        <div
         
          className="w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white py-5 px-5 rounded font-medium uppercase transition duration-200 block"
        >
       All Notifications
        </div>
      </div>

      <div className="user_data_wrap mt-10">
        <div className="user_dataHead w-full px-5 py-4 rounded bg-gray-700 text-white flex gap-4">
          <div className=" w-[80%] ">New document submitted by <span className='font-bold hover:text-yellow-600 cursor-pointer'>Bob.</span></div>
        </div>
        <div className="user_dataHead w-full px-5 py-4 rounded bg-gray-700 text-white flex gap-4 mt-5">
          <div className=" w-[80%] ">Application updated by <span className='font-bold hover:text-yellow-600 cursor-pointer'>Alice.</span></div>
        </div>
        <div className="user_dataHead w-full px-5 py-4 rounded bg-gray-700 text-white flex gap-4 mt-5">
          <div className=" w-[80%] ">New document submitted by <span className='font-bold hover:text-yellow-600 cursor-pointer'>Bob.</span></div>
        </div>
      </div>


    </>
  );
}
