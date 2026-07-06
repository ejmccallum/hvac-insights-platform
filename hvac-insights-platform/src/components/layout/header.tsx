import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const drawerWidth = 240;

function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "#ffffff",
        color: "#0f172a",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.12)",
      }}
    >
      <Toolbar>
        <Box>
          <Typography variant="h6"  sx={{ fontWeight: 700 }}>
            HVAC Insights Platform
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Operational dashboards, customer insights, and recommendations
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;