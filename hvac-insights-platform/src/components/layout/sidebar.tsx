import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SyncIcon from "@mui/icons-material/Sync";
import PeopleIcon from "@mui/icons-material/People";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const drawerWidth = 240;

const navigationItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Reports", icon: <BarChartIcon /> },
  { label: "Upload Data", icon: <UploadFileIcon /> },
  { label: "Integrations", icon: <SyncIcon /> },
  { label: "Customers", icon: <PeopleIcon /> },
  { label: "Technicians", icon: <EngineeringIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
];

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#0f172a",
          color: "#ffffff",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6"  sx={{ fontWeight: 700 }}>
          HVAC Insights
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          Business Intelligence
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#1e293b" }} />

      <List>
        {navigationItems.map((item) => (
          <ListItemButton key={item.label}>
            <ListItemIcon sx={{ color: "#cbd5e1" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;