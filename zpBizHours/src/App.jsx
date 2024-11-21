import { useContext } from "react";
import { Grid2, Paper, Container, Typography } from "@mui/material";

import CallQueueList from "./components/CallQueueList";
import PickCallQueue from "./components/PickCallQueue";
import PickUser from "./components/PickUser";
import UpdateCQUser from "./components/UpdateCQUser";
import RemoveCQUser from "./components/RemoveCQUser";
import { CallQueueContext } from "./context/CallQueueContext";
import { UserContext } from "./context/UserContext";

export default function App() {
  const { callQueue } = useContext(CallQueueContext);
  const { selectedUser, rowSelectionModel } = useContext(UserContext);

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
          {rowSelectionModel.length > 0 ? <RemoveCQUser /> : null}
          <PickCallQueue />
          {callQueue ? <PickUser /> : null}
          {selectedUser ? <UpdateCQUser /> : null}
        </Grid2>

        <Grid2
          container
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ padding: 5 }}
        >
          {callQueue ? <CallQueueList /> : null}
        </Grid2>
      </Paper>
    </Container>
  );
}
