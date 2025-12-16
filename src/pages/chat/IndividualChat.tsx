const IndividualChat = () => {
  return (
    <div className="flex flex-col w-full pt-3">
      <div>
        <div className="flex w-full items-center justify-center text-md font-light text-gray-500">
          Today
        </div>
        <OtherChat />
        <MeChat />
      </div>
      <div className="fixed bottom-15 w-full  border-t border-gray-200 p-2">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-full"
          />
          <button className="ml-2 bg-blue-500 text-white p-2 rounded-full">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const MeChat = () => {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-500 text-white p-2 max-w-xs rounded-2xl m-2">
        Hello I saw this listing and I wanted to reach out and ask if it is
        still available during the times posted? please let me know!
      </div>
    </div>
  );
};

const OtherChat = () => {
  return (
    <div className="flex justify-start mb-2">
      <div className="w-10 flex flex-col-reverse  pb-2 ">
        {" "}
        <img
          className="rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s"
          alt="profile pic"
        />
      </div>
      <div className="flex flex-col bg-gray-200 text-black p-2 max-w-xs rounded-2xl m-2">
        <p>
          Hello I saw this listing and I wanted to reach out and ask if it is
          still available during the times posted? please let me know!
        </p>
        <div className="flex flex-row-reverse px-3 text-sm text-gray-500 font-light">
          10:53PM
        </div>
      </div>
    </div>
  );
};

export default IndividualChat;
