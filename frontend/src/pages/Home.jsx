import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import EventSearch from "../components/eventSearch/EventSearch.jsx";
import EventShowcase from "../components/eventShowcase/EventShowcase";
import { Grid, Tabs, Tab } from "@mui/material";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ClubShowcase from "../components/clubShowcase/ClubShowcase";
import { TabsSX } from "../components/customMui/CustomMui";
import { useUserContext } from '../hooks/userContext'
import axiosInstance from "../hooks/api/axiosConfig";
import { Container, Paper, Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';


function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({ activityId: null, neighborhood: null, date: null });
  const [userInfo, setUserInfo] = useState({});
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [clubId, setClubId] = useState(null);

  useEffect(() => {
    user &&
      axiosInstance.get(`/user/search-email?email=${user.email}`)
        .then((response) => {
          setUserInfo(response.data);

          const name = response.data.firstName;
          if(response.data.role === 'ROLE_CLUB'){
          axiosInstance.get(`/club/by-name/${name}`)
          .then((response) => {
            setClubId(response.data.id);
          })}
        })
        .catch((error) => setError(error))
  }, [])


  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

const handleClickBooking = () => {
  navigate(`/bookings/${clubId}`);
}

  const handleClickReport = () => {
    navigate(`/reports`);
  }

  return (
    <>
        <Grid
          container
          className="content"
          
          sx={{ height: "auto"
            , mx: "auto"
            , maxWidth: "1400px"
            , display: 'flex'
            , flexDirection: 'row'
            , justifyContent: 'space-between'
            , marginTop: '30px'
            // ,backgroundImage: `url(${sports})`, backgroundSize: 'cover', backgroundPosition: 'center' 
          }}
          
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
            {userInfo?.role === 'ROLE_ADMIN' && <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleClickReport} style={{ marginTop: '10px' }}>
            Ver reportes
          </Button>
          </div></>}
          {userInfo?.role === 'ROLE_CLUB' && <> 
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleClickBooking} style={{ marginTop: '10px' }}>
            Ver reservas
          </Button>
          </div></>}
          </Grid>
        </Grid>    
    </>
  );
}

export default Home;
