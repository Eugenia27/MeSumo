import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  TextField
} from "@mui/material";
import {
  PaperSXX,
  ButtonSX,
  CustomTextField,
  BoxSX,
} from "../components/customMui/CustomMui";
import { useBookingContext } from "../hooks/bookingContext";
import CustomInput from "../components/customInput/CustomInput"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import BoxMessage from '../components/BoxMessage'
import { useUserContext } from "../hooks/userContext"
import axiosInstance from "../hooks/api/axiosConfig"
import { useNavigate } from "react-router-dom"
import { delay } from "../helpers/delay";

const EventCreate = () => {
  const { bookingInfo } = useBookingContext();
  const { user } = useUserContext()
  const navigate = useNavigate()

  const {
    selectedDate: date,
    startTime,
    endTime,
    clubId,
    courtId,
    activityId,
    clubName,
    neighborhoodName,
    activityName,
    activityType,
    slotId
  } = bookingInfo

  const slotCapacity = activityType * 2
  
    const [boxOpen, setBoxOpen] = useState(false)
    const [boxTitle, setBoxTitle] = useState('')
    const [boxMessage, setBoxMessage] = useState('')
  
    const [userId, setUserId] = useState(null)
    
    const okMessage = {
      message: '¡Evento creado con éxito!'
    };

    const noOkMessage = {
        title: '¡Hola!',
        message: 'Tenés que estar logueado para crear un evento!'
    };

    
    const handleBoxClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setBoxOpen(false);
    };

    const showMessage = (data) => {
      setBoxTitle(data.title)
      setBoxMessage(data.message);
      setBoxOpen(true);
    };
  
    const {
      handleSubmit,
      control,
      formState: { errors }
    } = useForm({
      defaultValues: {
        name: "",
        message: ""
      }
    })
  
    const [error, setError] = useState("")
  
  const onSubmit = handleSubmit(async (formData) => {
    const booking = {
      ...formData,
      slotId,
      activityId,
      activityName: activityName + " " + activityType,
      creatorId: userId,
      clubId,
      clubName,
      neighborhoodName,
      courtId,
      date,
      startTime,
      endTime,
      participants: [],
      approved: false
    }

    const goHome = async () => {
      await delay(2000)
      navigate("/")
    }

    if (!user) {
      showMessage(noOkMessage)
      setError("")
    } else if (user && !error) {
      const response = await new Promise((resolve) => {
        axiosInstance
          .post("/booking/add", booking,
            {
              headers: { "Authorization": `Bearer ${user.token}` }
            } 
          )
          .then((response) => {
            resolve(response)
            showMessage(okMessage)
            goHome()
          })
          .catch((error) => setError(error))
      })
    }
    else {
      setError("Algo salió mal!")
    }
  })

  useEffect(() => {
    user && 
    axiosInstance.get(`/user/search-email?email=${user.email}`)
    .then((response) => {
        const { userId } = response.data;
        setUserId(userId);
    })
    .catch((error) => setError(error)) 
  }, [])

  return (
    <>
      {/* <Container className="content">
        <Paper sx={{ ...PaperSXX, textAlign: "center" }}>
          <Box
            sx={{
              border: "2px solid",
              borderColor: "secondary.main",
              borderRadius: "10px",
              margin: "-2px",
              position: "relative",
              zIndex: 1,
              p: 2,
            }}
          >
            <Typography variant="h5" color="primary.main">
              Informacion del Evento
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}> 
                <CustomTextField
                  name="clubName"
                  label="Club"
                  disabled={clubName}
                  value={clubName ? clubName : ""}
                  fullWidth
                />
              </Grid>
                <Grid item xs={12}>
                <CustomTextField
                  name="activityName"
                  label="Actividad"
                  disabled={activityName && activityType}
                  value={activityName && activityType ? activityName +" " + activityType : ""}
                  fullWidth
                />
              </Grid>
                <Grid item xs={6}>
                <CustomTextField
                  name="date"
                  label="Fecha"
                  disabled={date}
                    value={date ? date : ""}
                    fullWidth
                />
              </Grid>
                <Grid item xs={6}>
                <CustomTextField
                  name="startTime"
                  label="Hora"
                  disabled={startTime}
                    value={startTime ? startTime : ""}
                    fullWidth
                />
              </Grid>
                <Grid item xs={12}>
                <CustomTextField
                  name="neighborhoodName"
                  label="Barrio"
                  disabled={neighborhoodName}
                    value={neighborhoodName ? neighborhoodName : ""}
                    fullWidth
                />
              </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack
                component="form"
                onSubmit={onSubmit}
                container spacing={2}
                >
                  <CustomTextField
                    name="participants"
                    label="Cupo"
                    disabled={slotCapacity}
                    value={slotCapacity ? slotCapacity : ""}
                  />
                  <CustomInput
                    name="name"
                    control={control}
                    label="Nombre del evento"
                    type="text"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    rules={{
                      required: {
                        value: true,
                        message: "El nombre es requerido",
                      },
                      pattern: {
                        value: /^.{6,}$/,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    }}
                  />
                  <CustomInput
                    name="message"
                    control={control}
                    label="Mensaje del organizador"
                    multiline
                    rows={4}
                    type="text"
                    error={!!errors.message}
                    helperText={errors?.message?.message}
                    rules={{
                      required: {
                        value: true,
                        message: "El mensaje es requerido",
                      },
                      pattern: {
                        value: /^.{6,}$/,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    sx={{ ...ButtonSX, my: 2 }}
                  >
                    Crear evento
                  </Button>
                  {error && (
                    <Typography variant="body2" color="error.main">
                      { error }
                    </Typography>
                  )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
        <BoxMessage
              open={boxOpen}
              title={boxTitle}
              message={boxMessage}
              onClose={handleBoxClose}
          />
      </Container> */}
      <Container>
        <Paper sx={{...PaperSXX, textAlign: "center"}}>
          <Box sx={{...BoxSX}}>
            <Typography variant="h5" color="primary.main">
                Informacion del Evento
            </Typography>
          </Box>
          <Grid container spacing={2} my={2}>
            <Grid item xs={12} md={6}>
              <Container>
                <Stack spacing={2}>
                    <TextField
                    name="clubName"
                    label="Club"
                    disabled={clubName}
                    value={clubName ? clubName : ""}
                    fullWidth
                    />
                    <TextField
                    name="activityName"
                    label="Actividad"
                    disabled={activityName && activityType}
                    value={activityName && activityType ? activityName +" " + activityType : ""}
                    fullWidth
                    />
                    <TextField
                    name="date"
                    label="Fecha"
                    disabled={date}
                    value={date ? date : ""}
                    fullWidth
                    />
                    <TextField
                    name="startTime"
                    label="Hora"
                    disabled={startTime}
                    value={startTime ? startTime : ""}
                    fullWidth
                    />
                </Stack>
              </Container>
            </Grid>
            <Grid item xs={12} md={6}>
              <Container>
              <Stack
                component="form"
                onSubmit={onSubmit}
                spacing={2}
                >
                  <TextField
                    name="participants"
                    label="Cupo"
                    disabled={slotCapacity}
                    value={slotCapacity ? slotCapacity : ""}
                  />
                  <CustomInput
                    name="name"
                    control={control}
                    label="Nombre del evento"
                    type="text"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    rules={{
                      required: {
                        value: true,
                        message: "El nombre es requerido",
                      },
                      pattern: {
                        value: /^.{6,}$/,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    }}
                  />
                  <CustomInput
                    name="message"
                    control={control}
                    label="Mensaje del organizador"
                    multiline
                    rows={4}
                    type="text"
                    error={!!errors.message}
                    helperText={errors?.message?.message}
                    rules={{
                      required: {
                        value: true,
                        message: "El mensaje es requerido",
                      },
                      pattern: {
                        value: /^.{6,}$/,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    sx={{ ...ButtonSX}}
                  >
                    Crear evento
                  </Button>
                  {error && (
                    <Typography variant="body2" color="error.main">
                      { error }
                    </Typography>
                  )}
              </Stack>
              </Container>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default EventCreate;
