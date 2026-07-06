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
import { Link as RouterLink, useLocation } from "react-router-dom";

const drawerWidth = 240;

const navigationItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Reports", icon: <BarChartIcon />, path: "/reports" },
  { label: "Upload Data", icon: <UploadFileIcon />, path: "/upload" },
  { label: "Integrations", icon: <SyncIcon />, path: "/integrations" },
  { label: "Customers", icon: <PeopleIcon />, path: "/customers" },
  { label: "Technicians", icon: <EngineeringIcon />, path: "/technicians" },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

function Sidebar() {
  const location = useLocation();

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
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          HVAC Insights
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          Business Intelligence
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#1e293b" }} />

      <List>
        {navigationItems.map((item) => {
          const selected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.path}
              selected={selected}
              sx={{
                color: "#ffffff",
                "&.Mui-selected": {
                  backgroundColor: "#1e293b",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#1e293b",
                },
                "&:hover": {
                  backgroundColor: "#172554",
                },
              }}
            >
              <ListItemIcon sx={{ color: selected ? "#38bdf8" : "#cbd5e1" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;