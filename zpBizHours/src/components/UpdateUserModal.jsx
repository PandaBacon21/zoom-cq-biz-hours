import { Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function UpdateUserModal({ open, handleClose, selectedUser }) {
  const [value, setValue] = useState("");
  const columns = [
    { field: "day", headerName: "Day", width: 120 },
    {
      field: "from",
      headerName: "From",
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="from"
            value={dayjs(selectedUser.all_business_hours.from, "HH:mm:ss")}
            onChange={(newValue) => setValue(newValue)}
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
          <TimePicker
            label="to"
            defaultValue={dayjs(
              selectedUser.all_business_hours[params.id].to,
              "HH:mm:ss"
            )}
          />
        </LocalizationProvider>
      ),
    },
  ];
  const rows = [
    { id: 0, day: "Sunday", from: "08:00", to: "15:00" },
    { id: 1, day: "Monday", from: "08:00", to: "15:00" },
    { id: 2, day: "Tuesday", from: "08:00", to: "15:00" },
    { id: 3, day: "Wednesday", from: "08:00", to: "15:00" },
    { id: 4, day: "Thursday", from: "08:00", to: "15:00" },
    { id: 5, day: "Friday", from: "08:00", to: "15:00" },
    { id: 6, day: "Saturday", from: "08:00", to: "15:00" },
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
            width: 600,
            height: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h3">Weekly Business Hours</Typography>
          {selectedUser === null ? null : (
            <DataGrid
              columns={columns}
              rows={selectedUser.all_business_hours}
              hideFooterPagination={true}
              checkboxSelection
            />
          )}
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </>
  );
}
