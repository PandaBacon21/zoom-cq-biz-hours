import { useEffect, useState } from "react";
import axios from "axios";

import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import UpdateUserModal from "./UpdateUserModal.jsx";
import { getTodaysHours } from "../utilities/utilities.js";

export default function CallQueueList({
  callQueue,
  callQueueUsers,
  setCallQueueUsers,
  rowSelectionModel,
  setRowSelectionModel,
}) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentHours, setCurrentHours] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setCurrentHours(null);
  };
  useEffect(() => {
    const getUserBusinessHours = async () => {
      try {
        const res = await axios({
          method: "get",
          url: "/api/get-business-hours",
          params: { extension_id: selectedUser.extension_id },
        });
        let hours = res.data;
        setCurrentHours(hours.business_hours);
        console.log(hours.business_hours);
      } catch (e) {
        console.log(e);
      }
    };
    if (selectedUser !== null) {
      getUserBusinessHours();
    }
  }, [selectedUser]);

  const columns = [
    { field: "name", headerName: "User Name", width: 250 },
    { field: "receive_call", headerName: "Receive Call Status", width: 250 },
    {
      field: "all_business_hours",
      headerName: "Today's Business Hours",
      width: 250,
      valueGetter: (value) => {
        return getTodaysHours(value);
      },
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
            console.log(callQueueUsers[params.id - 1]);
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
          callQueueUsers={callQueueUsers}
          setCallQueueUsers={setCallQueueUsers}
        />
      </Paper>
    </>
  );
}
