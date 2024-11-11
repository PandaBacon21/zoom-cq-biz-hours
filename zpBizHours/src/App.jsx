import { useState } from "react";
import { Grid2, Paper, Container, Typography, Button } from "@mui/material";

import CallQueueList from "./components/CallQueueList";
import PickCallQueue from "./components/PickCallQueue";
import PickUser from "./components/PickUser";
import UpdateCQUser from "./components/UpdateCQUser";
import RemoveCQUser from "./components/RemoveCQUser";

export default function App() {
  // Listing and Selecting Call Queues to Show or Interact with
  const [callQueue, setCallQueue] = useState(); // name, id
  const [callQueueUsers, setCallQueueUsers] = useState([]); // id, user_id, name, receive_call, extension_id, todays_hours, all_business_hours

  // Listing and Selecting User to Add to Queue
  const [listZoomUsers, setListZoomUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(false);

  // Selecting User Currently in Queue to Remove
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  return (
    <Container maxWidth="false" sx={{ textAlign: "center" }}>
      <Paper
        elevation={2}
        sx={{
          width: "auto",
          height: "auto",
          background: "linear-gradient(to right bottom, #0B5CFF, #FFFFFF)",
          marginTop: 10,
        }}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{ paddingTop: 5 }}
          gutterBottom
        >
          Call Queue Agent Hours
        </Typography>
        <Grid2 container spacing={2} direction="row" justifyContent="center">
          {rowSelectionModel.length > 0 ? (
            <RemoveCQUser
              callQueue={callQueue}
              callQueueUsers={callQueueUsers}
              setCallQueueUsers={setCallQueueUsers}
              rowSelectionModel={rowSelectionModel}
              setRowSelectionModel={setRowSelectionModel}
            />
          ) : null}
          <PickCallQueue
            setCallQueue={setCallQueue}
            setCallQueueUsers={setCallQueueUsers}
          />
          {callQueue ? (
            <PickUser
              callQueue={callQueue}
              listZoomUsers={listZoomUsers}
              setListZoomUsers={setListZoomUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          ) : null}
          {selectedUser ? (
            <UpdateCQUser
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              callQueue={callQueue}
              setCallQueueUsers={setCallQueueUsers}
              rowSelectionModel={rowSelectionModel}
            />
          ) : null}
        </Grid2>

        <Grid2
          container
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ padding: 5 }}
        >
          {callQueue ? (
            <CallQueueList
              callQueue={callQueue}
              callQueueUsers={callQueueUsers}
              rowSelectionModel={rowSelectionModel}
              setRowSelectionModel={setRowSelectionModel}
            />
          ) : null}
        </Grid2>
      </Paper>
    </Container>
  );
}
