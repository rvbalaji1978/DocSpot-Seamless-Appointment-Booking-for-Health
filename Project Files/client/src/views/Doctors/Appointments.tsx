// client/src/views/Doctors/Appointments.tsx
import { Box, Typography } from "@mui/material";
import { useDoctorAppointmentsQuery } from "../../redux/api/doctorSlice";
import useTypedSelector from "../../hooks/useTypedSelector";
import { selectedUserId } from "../../redux/auth/authSlice";
import Spinner from "../../components/Spinner";

export default function DoctorAppointmentsPage() {
  const doctorId = useTypedSelector(selectedUserId); // logged-in doctor
  const { data, isLoading } = useDoctorAppointmentsQuery({ doctorId });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>My Appointments</Typography>

      {isLoading && <Spinner />}

      {!isLoading && data?.data?.length === 0 && (
        <Typography>No appointments found.</Typography>
      )}

      {!isLoading && data?.data?.length > 0 && (
        <Box>
          {data.data.map((appt: any) => (
            <Box
              key={appt._id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography>
                <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Time:</strong> {appt.time}
              </Typography>
              <Typography>
                <strong>Patient:</strong> {appt.userInfo?.name || "N/A"}
              </Typography>
              <Typography>
                <strong>Status:</strong> {appt.status}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
