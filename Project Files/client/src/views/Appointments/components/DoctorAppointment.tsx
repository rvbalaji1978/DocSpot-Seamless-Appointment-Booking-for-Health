// src/views/Appointments/components/DoctorAppointment.tsx

import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { Heading } from "../../../components/Heading";
import { Box } from "@mui/material";
import {
  useDoctorAppointmentsQuery,
  useChangeApptStatusMutation,
  useGetDoctorQuery,
} from "../../../redux/api/doctorSlice";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId } from "../../../redux/auth/authSlice";
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import MUITable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/MUITable";
import { formatDate, formatTime, maskingPhoneNumber } from "../../../utils";
import CustomChip from "../../../components/CustomChip";
import { IoBookOutline } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { FcCancel } from "react-icons/fc";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";
import Spinner from "../../../components/Spinner";

const columns = ["Id", "Patient", "Phone", "Date", "Status", "Actions"];

const DoctorAppointment = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.data?.user?._id;
  const { data: docRes, isLoading: doctorLoading } = useGetDoctorQuery({ userId });
  const doctorId = docRes?.data?._id;
  console.log("Doctor ID:", userId);
  const {
    data,
    error,
    isLoading: apptLoading,
    isError,
    isSuccess,
    refetch: refetchAppts,
  } = useDoctorAppointmentsQuery(
    { doctorId },
    { skip: !doctorId }
  );
console.log("Appointments Error:", error); // <-- ADD THIS
  const [changeStatus, { isLoading: saving }] = useChangeApptStatusMutation();

  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const closeToast = () => setToast((t) => ({ ...t, appearence: false }));

  const handleStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await changeStatus({ appointmentId: id, status }).unwrap();
      setToast({
        message: `Appointment ${status}`,
        appearence: true,
        type: "success",
      });
      refetchAppts();
    } catch (err: any) {
      setToast({
        message: err?.data?.message || "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  if (apptLoading || doctorLoading || !doctorId) {
    return <OverlayLoader />;
  }

  return (
    <>
      <Navbar>
        <Heading>Appointments</Heading>

        <Box sx={{ mt: 3, boxShadow: "rgba(0,0,0,.16) 3px 16px 87px 0px" }}>
          <MUITable tableHead={columns}>
            {isSuccess && data?.data?.length > 0 ? (
              data.data.map((row: any) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell>{row._id}</StyledTableCell>
                  <StyledTableCell>{row.userInfo?.name}</StyledTableCell>
                  <StyledTableCell>
                    {maskingPhoneNumber(row.userInfo?.phoneNumber)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {`${formatDate(row.date)} ${formatTime(row.time)}`}
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomChip
                      label={
                        row.status === "pending"
                          ? "Pending"
                          : row.status === "approved"
                          ? "Approved"
                          : "Cancelled"
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.status === "pending" ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {saving ? (
                          <Spinner size={18} />
                        ) : (
                          <>
                            <Box
                              sx={{ cursor: "pointer", textDecoration: "underline" }}
                              onClick={() => handleStatus(row._id, "approved")}
                            >
                              Approve
                            </Box>
                            <Box
                              sx={{ cursor: "pointer", textDecoration: "underline" }}
                              onClick={() => handleStatus(row._id, "rejected")}
                            >
                              Reject
                            </Box>
                          </>
                        )}
                      </Box>
                    ) : row.status === "approved" ? (
                      <TiTickOutline style={{ fontSize: 20 }} />
                    ) : (
                      <FcCancel style={{ fontSize: 18 }} />
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : isError ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length} align="center">
                  Error loading appointments
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length} align="center">
                  <Box
                    sx={{
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 4,
                    }}
                  >
                    <IoBookOutline />
                    No appointments found
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </MUITable>
        </Box>
      </Navbar>

      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={closeToast}
      />
    </>
  );
};

export default DoctorAppointment;
