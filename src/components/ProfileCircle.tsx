import { Box, Tooltip } from "@mui/material";

type ProfileCircleProps = {
  name: string | null | undefined;
  index?: number;
};

const ProfileCircle = ({ name, index }: ProfileCircleProps) => {
  const displayName = name ? name : "?";
  return (
    <Tooltip key={index} title={displayName}>
      <Box
        key={index}
        sx={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          backgroundColor: "#fff",
          border: "1px solid #2a3132",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
          fontWeight: "bold",
          color: "#2a3132",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {displayName.charAt(0).toUpperCase()}
      </Box>
    </Tooltip>
  );
};

export default ProfileCircle;
