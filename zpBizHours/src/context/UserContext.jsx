import { createContext, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // Listing and Selecting User to Add to Queue
  const [listZoomUsers, setListZoomUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  // Selecting User Currently in Queue to Remove
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  return (
    <UserContext.Provider
      value={{
        listZoomUsers,
        setListZoomUsers,
        selectedUser,
        setSelectedUser,
        rowSelectionModel,
        setRowSelectionModel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
