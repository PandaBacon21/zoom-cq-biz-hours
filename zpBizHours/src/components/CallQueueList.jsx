import { useState } from "react";

import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import UpdateUserModal from "./UpdateUserModal.jsx";

export default function CallQueueList({
  callQueue,
  callQueueUsers,
  rowSelectionModel,
  setRowSelectionModel,
}) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentHours, setCurrentHours] = useState(null);
  const [newHours, setNewHours] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setCurrentHours(null);
    setNewHours(null);
  };

  // NEED TO UPDATE TO USER valueGetter rather than the complexity I have changing business hours and today's hours...

  const columns = [
    // { field: "id", headerName: "Index", width: 200 },
    { field: "name", headerName: "User Name", width: 250 },
    { field: "receive_call", headerName: "Receive Call Status", width: 250 },
    {
      field: "todays_hours",
      headerName: "Business Hours",
      width: 250,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Update",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ManageAccountsIcon color="primary" fontSize="large" />}
          label="Update"
          onClick={() => {
            handleOpen();
            setSelectedUser(callQueueUsers[params.id - 1]);
            setCurrentHours(callQueueUsers[params.id - 1].all_business_hours);
            console.log(callQueueUsers[params.id - 1]);
            // console.log(callQueueUsers[params.id - 1].all_business_hours);
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <Paper elevation={2} sx={{ width: "85%", height: "50%", margin: 2 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ marginTop: 3 }}
          gutterBottom
        >
          {callQueue.name}
        </Typography>
        {callQueueUsers.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={callQueueUsers}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
            />
          </Box>
        ) : (
          <CircularProgress />
        )}
        <UpdateUserModal
          open={open}
          handleClose={handleClose}
          selectedUser={selectedUser}
          currentHours={currentHours}
          setCurrentHours={setCurrentHours}
          newHours={newHours}
          setNewHours={setNewHours}
        />
      </Paper>
    </>
  );
}
