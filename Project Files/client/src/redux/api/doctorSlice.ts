// src/redux/api/doctorSlice.ts

import { apiSlice } from "./apiSlice";

export const doctorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ─────────────── Doctor signup ─────────────── */
    doctorSignup: builder.mutation({
      query: (data) => ({
        url: "doctors/signup",
        method: "POST",
        body: data,
      }),
    }),

    /* ─────────────── All doctors / admin list ─────────────── */
    getAllDoctors: builder.query({
      query: () => "doctors",
      providesTags: ["Doctors"],
    }),

    getApprovedDoctors: builder.query({
      query: () => "doctors/approved-doctors",
      providesTags: ["Doctors"],
    }),

    /* ─────────────── Change doctor status (admin) ─────────────── */
    changeDoctorStatus: builder.mutation({
      query: (data) => ({
        url: "users/change-doctor-status",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Doctors"],
    }),

    /* ─────────────── Update doctor profile ─────────────── */
    updateDoctor: builder.mutation({
      query: (data) => ({
        url: `doctors/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Doctors"],
    }),

    /* ─────────────── Get single doctor by userId ─────────────── */
/* single doctor – looked up by LOGIN userId */
getDoctor: builder.query({
  query: ({ userId }) => `doctors/find-by-user/${userId}`,   //  ←✅
  providesTags: ["Doctors"],
}),

    /* ─────────────── Book appointment (patient) ─────────────── */
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: "users/book-appointment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),

    /* ─────────────── Check booking availability ─────────────── */
    checkBookingAvailability: builder.mutation({
      query: (data) => ({
        url: "doctors/check-booking-availability",
        method: "POST",
        body: data,
      }),
    }),

    /* ─────────────── Doctor’s own appointments ─────────────── */
    doctorAppointments: builder.query({
      query: ({ doctorId }) => `doctors/appointments/${doctorId}`,
      providesTags: ["Appointments"],
    }),

    /* ─────────────── Change appointment status ─────────────── */
    changeApptStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: "doctors/change-appointment-status",
        method: "POST",
        body: { appointmentId, status },
      }),
      invalidatesTags: ["Appointments"],
    }),

    /* ─────────────── Already-booked slots for a doctor ─────────────── */
    bookedAppointments: builder.query({
      query: ({ userId }) => `doctors/booked-appointments/${userId}`,
      providesTags: ["Appointments"],
    }),
  }),
});

export const {
  useDoctorSignupMutation,
  useGetAllDoctorsQuery,
  useGetApprovedDoctorsQuery,
  useChangeDoctorStatusMutation,
  useUpdateDoctorMutation,
  useGetDoctorQuery,
  useCheckBookingAvailabilityMutation,
  useBookAppointmentMutation,
  useDoctorAppointmentsQuery,
  useChangeApptStatusMutation,
  useBookedAppointmentsQuery,
} = doctorApiSlice;
