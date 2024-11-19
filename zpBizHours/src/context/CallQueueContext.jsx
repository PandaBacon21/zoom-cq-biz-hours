import { createContext, useState } from "react";

const CallQueueContext = createContext();

const CallQueueContextProvider = ({ children }) => {
  // Listing and Selecting Call Queues to Show or Interact with
  const [callQueue, setCallQueue] = useState(); // name, id
  const [callQueueUsers, setCallQueueUsers] = useState([]); // id, user_id, name, receive_call, extension_id, all_business_hours

  return (
    <CallQueueContext.Provider
      value={{ callQueue, setCallQueue, callQueueUsers, setCallQueueUsers }}
    >
      {children}
    </CallQueueContext.Provider>
  );
};

export { CallQueueContext, CallQueueContextProvider };
