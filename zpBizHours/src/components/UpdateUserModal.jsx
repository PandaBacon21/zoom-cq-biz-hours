import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getDay, getWorkday } from "../utilities/utilities";

dayjs.extend(customParseFormat);

export default function UpdateUserModal({
  open,
  handleClose,
  selectedUser,
  currentHours,
  setCurrentHours,
  newHours,
  setNewHours,
}) {
  const handleFromChange = (newValue, params) => {
    let updatedHours = [...currentHours];
    let newTime = "";
    if (newValue.$H < 10) {
      newTime = `0${newValue.$H}:${newValue.$m}:00`;
    } else {
      newTime = `${newValue.$H}:${newValue.$m}:00`;
    }
    updatedHours[params.row.id].from = newTime;
    console.log(updatedHours);
    setNewHours(updatedHours);
  };
  const columns = [
    {
      field: "weekday",
      headerName: "Day",
      width: 120,
      valueGetter: getDay,
    },
    {
      field: "type",
      headerName: "Workday",
      width: 120,
      valueGetter: getWorkday,
    },
    {
      field: "from",
      headerName: "From",
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            defaultValue={dayjs(params.row.from, "HH:mm:ss")}
            onChange={(newValue) => handleFromChange(newValue, params)}
          />
        </LocalizationProvider>
      ),
    },
    {
      field: "to",
      headerName: "To",
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker defaultValue={dayjs(params.row.to, "HH:mm:ss")} />
        </LocalizationProvider>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Weekly Business Hours
          </Typography>
          {selectedUser === null ? (
            <CircularProgress />
          ) : (
            <DataGrid
              columns={columns}
              rows={currentHours}
              hideFooterPagination={true}
              hideFooterSelectedRowCount
            />
          )}
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ float: "left", margin: 1 }}
          >
            Close
          </Button>
          {newHours !== currentHours ? (
            <Button variant="contained" sx={{ float: "right", margin: 1 }}>
              Update
            </Button>
          ) : null}
        </Box>
      </Modal>
    </>
  );
}
