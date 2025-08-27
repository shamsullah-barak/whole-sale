import React from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StraightenIcon from "@mui/icons-material/Straighten";
import EntryForm from "../journal/entryForm";

const MasterData = () => {
  const masterDataItems = [
    {
      title: "Categories",
      description: "Manage product categories and classifications",
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      path: "/master-data/categories",
      color: "#1976d2",
    },
    {
      title: "Companies",
      description: "Manage company information and suppliers",
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      path: "/master-data/companies",
      color: "#388e3c",
    },
    {
      title: "Units",
      description: "Manage measurement units (e.g., kg, piece)",
      icon: <StraightenIcon sx={{ fontSize: 40 }} />,
      path: "/master-data/units",
      color: "#ff9800",
    },
  ];

  return (
    <MainDashboard title="Master Data">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", height: "100%" }}>
          <EntryForm />
        </Grid>
      </Grid>
      {/* <Box sx={{ width: '100%' }}>
      
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Master Data Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage foundational data for your business operations
          </Typography>
        </Box>

      
        <Grid container spacing={3}>
          {masterDataItems.map((item, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: item.color,
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <NavLink to={item.path} style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: item.color,
                        '&:hover': {
                          bgcolor: item.color,
                          filter: 'brightness(0.9)',
                        },
                      }}
                    >
                      Manage {item.title}
                    </Button>
                  </NavLink>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

       
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <NavLink to="/master-data/categories/add" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" fullWidth startIcon={<CategoryIcon />} sx={{ py: 1.5 }}>
                  Add New Category
                </Button>
              </NavLink>
            </Grid>
            <Grid xs={12} sm={6}>
              <NavLink to="/master-data/companies/add" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" fullWidth startIcon={<BusinessIcon />} sx={{ py: 1.5 }}>
                  Add New Company
                </Button>
              </NavLink>
            </Grid>
            <Grid xs={12} sm={6}>
              <NavLink to="/master-data/units/add" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" fullWidth startIcon={<StraightenIcon />} sx={{ py: 1.5 }}>
                  Add New Unit
                </Button>
              </NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box> */}
    </MainDashboard>
  );
};

export default MasterData;
