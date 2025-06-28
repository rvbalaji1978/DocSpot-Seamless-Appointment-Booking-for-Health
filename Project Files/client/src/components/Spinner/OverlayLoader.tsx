// src/components/Spinner/OverlayLoader.tsx
import { Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  message?: string;
}

export default function OverlayLoader({ message = "Loading..." }: Props) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress />
      <Typography mt={2} fontSize={14} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
