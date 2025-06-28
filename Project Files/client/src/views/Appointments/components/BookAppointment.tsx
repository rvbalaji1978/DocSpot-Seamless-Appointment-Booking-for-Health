import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

/* ---------- RTK Queries ---------- */
import {
  useBookedAppointmentsQuery,
  useCheckBookingAvailabilityMutation,
  useGetDoctorQuery,
} from "../../../redux/api/doctorSlice";
import {
  useBookAppointmentMutation,
  useGetUserQuery,
} from "../../../redux/api/userSlice";

/* ---------- Redux selectors ---------- */
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId, userIsDoctor } from "../../../redux/auth/authSlice";

/* ---------- UI helpers ---------- */
import {
  add30Minutes,
  formatDate,
  formatTime,
  onKeyDown,
  thousandSeparatorNumber,
} from "../../../utils";

/* ---------- MUI & others ---------- */
import { Box, Grid, Divider, Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Formik, FormikProps, Form } from "formik";
import * as Yup from "yup";

/* ---------- Icons ---------- */
import { RiLuggageDepositLine } from "react-icons/ri";
import { MdOutlineExplicit } from "react-icons/md";
import { CiLocationOn, CiMoneyCheck1 } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";

/* ---------- Custom components ---------- */
import DatePicker from "../../../components/DatePicker";
import Navbar from "../../../components/Navbar";
import { Heading, SubHeading } from "../../../components/Heading";
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";

/* ---------- Types ---------- */
interface AppointmentForm {
  date: string | null;
  time: string | null;
}

const AppointmentSchema = Yup.object().shape({
  date: Yup.mixed().required("Date is required"),
  time: Yup.mixed().required("Time is required"),
});

export default function BookAppointment() {
  const navigate = useNavigate();
  const { userId: doctorId } = useParams();
  const loginUserId = useTypedSelector(selectedUserId);
  const isDoctor = useTypedSelector(userIsDoctor);

  const [isAvailable, setIsAvailable] = useState(false);
  const [action, setAction] = useState<"check" | "book" | "">("");
  const [toast, setToast] = useState({ message: "", appearence: false, type: "" as "success" | "error" | "" });

  const { data: doctorRes, isLoading: doctorLoading, error: doctorError } = useGetDoctorQuery({ userId: doctorId });
  const { data: patientRes, isLoading: patientLoading, error: patientError } = useGetUserQuery({ userId: loginUserId });
  const { data: bookedSlots, isLoading: slotsLoading } = useBookedAppointmentsQuery({ userId: doctorId });
  const [checkAvailability, { isLoading: checking }] = useCheckBookingAvailabilityMutation();
  const [bookAppointment, { isLoading: booking }] = useBookAppointmentMutation();

  const handleCloseToast = () => setToast({ ...toast, appearence: false });

  const handleSubmit = async (values: AppointmentForm) => {
    if (!doctorId) return;

    const formattedDate = dayjs(values.date).format("YYYY-MM-DD");
    const formattedTime = dayjs(values.time).format("HH:mm");

    try {
      if (action === "check") {
        const resp: any = await checkAvailability({ doctorId, date: formattedDate, time: formattedTime });
        if (resp?.data?.status) {
          setIsAvailable(true);
          setToast({ message: resp.data.message, appearence: true, type: "success" });
        } else throw resp.error;
      }

      if (action === "book") {
        const doctorInfo = doctorRes?.data;
        const userInfo = patientRes?.data;

        if (!doctorInfo || !userInfo) {
          throw { data: { message: "Doctor or user info missing." } };
        }

        const resp: any = await bookAppointment({ doctorId, userId: loginUserId, doctorInfo, userInfo, date: formattedDate, time: formattedTime });
        if (resp?.data?.status) {
          setIsAvailable(false);
          setToast({ message: resp.data.message, appearence: true, type: "success" });
          setTimeout(() => navigate(isDoctor ? "/doctors/appointments" : "/appointments"), 1200);
        } else throw resp.error;
      }
    } catch (err: any) {
      setIsAvailable(false);
      setToast({ message: err?.data?.message || err?.error || "Something went wrong", appearence: true, type: "error" });
    }
  };

  if (doctorError || patientError) {
    return (
      <Box sx={{ p: 3 }}>
        <h3>Failed to load necessary user/doctor info</h3>
        <pre>{JSON.stringify(doctorError || patientError, null, 2)}</pre>
      </Box>
    );
  }

  if (!doctorRes?.data || !patientRes?.data) {
    return <OverlayLoader message="Loading doctor and user details..." />;
  }

  const doctor = doctorRes?.data;

  return (
    <>
      <Navbar>
        <Heading>Book Appointment</Heading>
        <Box>
          <Grid container spacing={4}>
            {/* LEFT: FORM */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, boxShadow: 2 }}>
                <Heading sx={{ fontSize: 18, mb: 1 }}>Timings</Heading>
                <Divider />
                <Formik<AppointmentForm>
                  initialValues={{ date: null, time: null }}
                  validationSchema={AppointmentSchema}
                  onSubmit={handleSubmit}
                >
                  {(formik: FormikProps<AppointmentForm>) => (
                    <Form onKeyDown={onKeyDown}>
                      <Box mt={2}>
                        <SubHeading sx={{ mb: 0.5 }}>Select Date</SubHeading>
                        <DatePicker
                          label=""
                          minDate={new Date()}
                          value={formik.values.date}
                          handleChange={(val) => {
                            formik.setFieldValue("date", val);
                            setIsAvailable(false);
                          }}
                        />
                        {formik.touched.date && formik.errors.date && <Box sx={{ color: "#d32f2f", fontSize: 12 }}>{formik.errors.date}</Box>}
                      </Box>
                      <Box mt={2}>
                        <SubHeading sx={{ mb: 0.5 }}>Select Time</SubHeading>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            value={formik.values.time}
                            onChange={(val) => {
                              formik.setFieldValue("time", val);
                              setIsAvailable(false);
                            }}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </LocalizationProvider>
                        {formik.touched.time && formik.errors.time && <Box sx={{ color: "#d32f2f", fontSize: 12 }}>{formik.errors.time}</Box>}
                      </Box>
                      <Box mt={3}>
                        <Button fullWidth variant="outlined" color="success" disabled={checking} onClick={() => { setAction("check"); formik.handleSubmit(); }}>
                          {checking ? "Checking…" : "Check Availability"}
                        </Button>
                      </Box>
                      {isAvailable && (
                        <Box mt={2}>
                          <Button fullWidth variant="outlined" disabled={booking} onClick={() => { setAction("book"); formik.handleSubmit(); }}>
                            {booking ? "Booking…" : "Book Appointment"}
                          </Button>
                        </Box>
                      )}
                    </Form>
                  )}
                </Formik>
              </Box>
            </Grid>

            {/* MIDDLE: DOCTOR CARD */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, boxShadow: 2 }}>
                <Heading sx={{ fontSize: 18 }}>{doctor.prefix} {doctor.fullName}<Box component="span" sx={{ fontSize: 14 }}> ({doctor.specialization})</Box></Heading>
                <Divider sx={{ my: 1 }} />
                <InfoRow icon={<IoMdTime />} label="Consultation Time" value="30 Minutes" />
                <InfoRow icon={<RiLuggageDepositLine />} label="Department" value={doctor.specialization} />
                <InfoRow icon={<MdOutlineExplicit />} label="Experience" value={`${doctor.experience} Years`} />
                <InfoRow icon={<CiMoneyCheck1 />} label="Fee Per Visit" value={thousandSeparatorNumber(doctor.feePerConsultation)} />
                <InfoRow icon={<CiLocationOn />} label="Location" value={doctor.address} />
              </Box>
            </Grid>

            {/* RIGHT: BOOKED SLOTS */}
            {bookedSlots?.data?.length > 0 && (
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, boxShadow: 2 }}>
                  <Heading sx={{ fontSize: 18 }}>Booked Slots</Heading>
                  <Divider sx={{ my: 1 }} />
                  {bookedSlots.data.map((slot: any) => (
                    <Box key={slot._id} sx={{ display: "flex", mb: 1 }}>
                      <Box sx={{ minWidth: 120 }}>{formatDate(slot.date)}</Box>
                      <Box sx={{ bgcolor: "#eaebef", px: 1, borderRadius: 0.5, fontSize: 13 }}>
                        {`${formatTime(slot.time)} – ${formatTime(add30Minutes(slot.time))}`}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Navbar>

      <ToastAlert appearence={toast.appearence} type={toast.type} message={toast.message} handleClose={handleCloseToast} />
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 180 }}>{icon}{label}</Box>
      <Box>{value}</Box>
    </Box>
  );
}
