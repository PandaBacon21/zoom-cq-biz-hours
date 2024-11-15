import { Button } from "@mui/material";

import axios from "axios";

export default function UpdateCQUser({
  selectedUser,
  setSelectedUser,
  callQueue,
  setCallQueueUsers,
}) {
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
      setSelectedUser(false);
      // console.log(res.data);
    } catch (e) {
      console.log(e);
      setSelectedUser(false);
    }
  };

  return (
    <Button variant="contained" onClick={addUser}>
      Add User
    </Button>
  );
}
