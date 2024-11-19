import { Button } from "@mui/material";

import axios from "axios";
import { useContext } from "react";
import { CallQueueContext } from "../context/CallQueueContext";
import { UserContext } from "../context/UserContext";

export default function UpdateCQUser(
  {
    // selectedUser,
    // setSelectedUser,
    // callQueue,
    // setCallQueueUsers,
  }
) {
  const { callQueue, setCallQueueUsers } = useContext(CallQueueContext);
  const { selectedUser, setSelectedUser } = useContext(UserContext);

  // call backend to add selecteduser to queue
  const addUser = async () => {
    try {
      console.log("Adding: " + selectedUser.name);
      const res = await axios({
        method: "post",
        url: "/api/update-call-queue-user",
        data: {
          email: selectedUser.email,
          user_id: selectedUser.user_id,
          call_queue_id: callQueue.id,
        },
      });
      const users = res.data;
      setCallQueueUsers(users);
      setSelectedUser(null);
      // console.log(res.data);
    } catch (e) {
      console.log(e);
      setSelectedUser(null);
    }
  };

  return (
    <Button variant="contained" onClick={addUser}>
      Add User
    </Button>
  );
}
