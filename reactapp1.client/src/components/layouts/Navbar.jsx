import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState } from "react"

function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: 72 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              cursor: "pointer",
              mr: 5,
            }}
            onClick={() => navigate("/")}
          >
            Flight Tickets
          </Typography>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              gap: 1,
            }}
          >
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;