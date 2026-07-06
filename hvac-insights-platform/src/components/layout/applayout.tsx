import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Header from "./header";
import Sidebar from "./sidebar";

const drawerWidth = 240;

function AppLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#f5f6f8",
        }}
      >
        <Toolbar />

        <Box>
          <h1>Dashboard</h1>
          <p>Main content area is ready.</p>
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;