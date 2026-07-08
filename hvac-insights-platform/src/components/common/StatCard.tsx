import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  helperText: string;
  icon: ReactNode;
};

function StatCard({ title, value, helperText, icon }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h4" component="p" sx={{ fontWeight: 700, mt: 1 }}>
              {value}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {helperText}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatCard;