import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import EventSearch from "../components/EventSearch/EventSearch";
import EventShowcase from "../components/eventShowcase/EventShowcase";
import { Grid, Tabs, Tab } from "@mui/material";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ClubShowcase from "../components/clubShowcase/ClubShowcase";
import { TabsSX } from "../components/customMui/CustomMui";
import { useUserContext } from '../hooks/userContext'
import axiosInstance from "../hooks/api/axiosConfig";
import Bookings from "./Bookings.jsx";
import { Container, Paper } from "@mui/material";
import IconButton from '@mui/material/IconButton';

function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({ activityId: null, neighborhood: null, date: null });
  const [userInfo, setUserInfo] = useState({});
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user)
    user &&
      axiosInstance.get(`/user/search-email?email=${user.email}`)
        .then((response) => {
          setUserInfo(response.data);
          console.log(response.data)
        })
        .catch((error) => setError(error))
  }, [])

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (filters) => {
    console.log(filters)
    setSelectedFilters(filters);
  };

  const handleClick = () => {
    navigate(`/new-slot/${userInfo.firstName}`);
  };

  return (
    <>
      {!userInfo?.role ? (
        <Grid
          container
          className="content"
          sx={{ height: "auto", mx: "auto", maxWidth: "1400px", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '30px' }}
        >
          <Grid item xs={12} sm={3}>
            <EventSearch onUpdateFilters={handleFilterChange} />
          </Grid>
          <Grid item xs={12} sm={9} sx={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>
            <Tabs
              textColor="secondary"
              indicatorColor="secondary"
              sx={{ ...TabsSX }}
              value={tabValue}
              onChange={handleChangeTab}
            >
              <Tab sx={{ color: "#3FEBBD" }} label="Eventos" />
              <Tab sx={{ color: "#3FEBBD" }} label="Clubes" />
            </Tabs>
            {tabValue === 0 && (
              <>
                <EventShowcase keyword="Próximos" filters={selectedFilters} />
                <EventShowcase keyword="Todos" filters={selectedFilters} />
              </>
            )}
            {tabValue === 1 && <ClubShowcase />}
          </Grid>
        </Grid>
      ) : (userInfo?.role === "ROLE_CLUB" && <>
        <Container>
          <Paper>
            <Bookings idClub={userInfo.firstName} />
          </Paper>
        </Container>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <IconButton onClick={handleClick} variant="contained" color="primary">
            Horarios de turnos
          </IconButton>
        </div>
      </>
      )}
    </>
  );
}

export default Home;