import { Button } from "@mui/material";

import axios from "axios";

export default function RemoveCQUser({
  callQueue,
  callQueueUsers,
  setCallQueueUsers,
  rowSelectionModel,
  setRowSelectionModel,
}) {
  const removeUser = async () => {
    let usersToRemove = [];
    for (let index = 0; index < rowSelectionModel.length; index++) {
      for (let i = 0; i < callQueueUsers.length; i++) {
        if (rowSelectionModel[index] === callQueueUsers[i].id) {
          usersToRemove.push(callQueueUsers[i].user_id);
          console.log("User to Remove: " + callQueueUsers[i].name);
        }
      }
    }
    try {
      const res = await axios({
        method: "delete",
        url: "/api/remove-call-queue-users",
        data: {
          call_queue_id: callQueue.id,
          users: usersToRemove,
        },
      });
      let users = res.data;
      console.log(users);
      setCallQueueUsers(users);
      setRowSelectionModel([]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Button variant="contained" onClick={removeUser}>
      Remove User
    </Button>
  );
}
