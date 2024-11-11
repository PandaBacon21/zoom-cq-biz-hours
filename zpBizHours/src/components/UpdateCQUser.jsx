import { Button } from "@mui/material";

import axios from "axios";

import { parseTodaysHours } from "../utilities/utilities";

export default function UpdateCQUser({
  selectedUser,
  setSelectedUser,
  callQueue,
  setCallQueueUsers,
}) {
  const addUser = async () => {
    try {
      console.log("Adding: " + selectedUser.name);
      let res = await axios({
        method: "post",
        url: "/api/updateCallQueueUser",
        data: {
          email: selectedUser.email,
          user_id: selectedUser.user_id,
          call_queue_id: callQueue.id,
        },
      });
      let users = res.data;
      console.log(users);
      users = await parseTodaysHours(users);
      setCallQueueUsers(users);
      setSelectedUser(false);
      console.log(res.data);
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
