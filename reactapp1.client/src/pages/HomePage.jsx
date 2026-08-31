import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
    Box,
    Container,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Card,
    CardContent,
    Stack,
    Pagination,
    CircularProgress,
    Divider,
    Chip,
    Alert
} from "@mui/material";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const HomePage = () => {

    const [tickets, setTickets] = useState([]);
    const [cities, setCities] = useState([]);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");

    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageSize = 12;


    const getTickets = async () => {

        try {

            setLoading(true);

            const response = await api.get("/Ticket", {
                params: {
                    search: search || undefined,
                    sort,
                    page,
                    pageSize,

                    // Backend property adların bunlardırsa
                    fromCityId: fromCity || undefined,
                    toCityId: toCity || undefined
                }
            });

            setTickets(response.data?.items || []);
            setTotalPages(response.data?.totalPages || 1);

        }
        catch (error) {

            console.error("API ERROR:", error);

        }
        finally {

            setLoading(false);
        }
    };


    const getCities = async () => {

        try {

            const response = await api.get("/City");

            setCities(response.data || []);

        }
        catch (error) {

            console.error("CITY ERROR:", error);

        }
    };

    const clearFilter = () => {
        setFromCity("");
        setToCity("");
    }

    useEffect(() => {

        getTickets();

    }, [page, sort]);


    useEffect(() => {

        getCities();

    }, []);


    const handleSearch = () => {

        if (fromCity == "" || toCity == "" ) {
            setError("Please choose your route");
            return;
        }

        if(fromCity == toCity){
            setError("Departure and destination cannot be the same.");
            return;
        }

        setError("");

        setPage(1);
        getTickets();

    };


    const handleSwapCities = () => {

        const temp = toCity;

        setFromCity(fromCity);
        setToCity(temp);
    };


    const formatDate = (date) => {

        return new Date(date).toLocaleString("az-AZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f4f7fb",
                py: 5
            }}
        >

            <Container maxWidth="lg">

                {/* HEADER */}

                <Box
                    sx={{
                        textAlign: "center",
                        mb: 5
                    }}
                >

                    <Typography
                        variant="h3"
                        fontWeight="bold"
                    >
                        ✈️ Flight Tickets
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Find the best flights for your next journey
                    </Typography>

                </Box>


                {/* SEARCH CARD */}

                <Card
                    elevation={4}
                    sx={{
                        borderRadius: 4,
                        mb: 5
                    }}
                >

                    <CardContent
                        sx={{
                            p: 3
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={3}
                        >
                            Search Flights
                        </Typography>


                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >

                            {/* FROM */}

                            <FormControl
                                sx={{
                                    minWidth: 220,
                                    flex: 1
                                }}
                            >

                                <InputLabel>From</InputLabel>

                                <Select
                                    value={fromCity}
                                    label="From"
                                    onChange={(e) =>
                                        setFromCity(e.target.value)
                                    }
                                    startAdornment={
                                        <FlightTakeoffIcon
                                            sx={{ mr: 1 }}
                                        />
                                    }
                                >

                                    <MenuItem value="">
                                        All Cities
                                    </MenuItem>

                                    {cities.map((city) => (

                                        <MenuItem
                                            key={city.id}
                                            value={city.id}
                                        >

                                            {city.name}

                                            {city.countryName &&
                                                `, ${city.countryName}`
                                            }

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>


                            {/* SWAP */}

                            <Button
                                variant="outlined"
                                onClick={handleSwapCities}
                                sx={{
                                    minWidth: 50,
                                    height: 50,
                                    borderRadius: "50%"
                                }}
                            >

                                <SwapHorizIcon />

                            </Button>


                            {/* TO */}

                            <FormControl
                                sx={{
                                    minWidth: 220,
                                    flex: 1
                                }}
                            >

                                <InputLabel>To</InputLabel>

                                <Select
                                    value={toCity}
                                    label="To"
                                    onChange={(e) =>
                                        setToCity(e.target.value)
                                    }
                                    startAdornment={
                                        <FlightLandIcon
                                            sx={{ mr: 1 }}
                                        />
                                    }
                                >

                                    <MenuItem value="">
                                        All Cities
                                    </MenuItem>

                                    {cities.map((city) => (

                                        <MenuItem
                                            key={city.id}
                                            value={city.id}
                                        >

                                            {city.name}

                                            {city.countryName &&
                                                `, ${city.countryName}`
                                            }

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>


                            {/* SEARCH */}

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                sx={{
                                    height: 56,
                                    px: 4,
                                    borderRadius: 2
                                }}
                            >
                                Search
                            </Button>

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SearchIcon />}
                                onClick={clearFilter}
                                sx={{
                                    height: 56,
                                    px: 4,
                                    borderRadius: 2
                                }}
                            >
                                Clear Filter
                            </Button>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </CardContent>

                </Card>


                {/* LOADING */}

                {loading && (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 5
                        }}
                    >

                        <CircularProgress />

                    </Box>

                )}


                {/* TICKETS */}

                {!loading && (

                    <Stack spacing={2}>

                        {tickets.length === 0 ? (

                            <Card
                                sx={{
                                    borderRadius: 3,
                                    textAlign: "center",
                                    p: 5
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                >
                                    No tickets found ✈️
                                </Typography>

                            </Card>

                        ) : (

                            tickets.map((ticket) => (

                                <Card
                                    key={ticket.no}
                                    elevation={2}
                                    sx={{
                                        borderRadius: 3,
                                        transition: "0.2s",

                                        "&:hover": {
                                            transform: "translateY(-3px)",
                                            boxShadow: 6
                                        }
                                    }}
                                >

                                    <CardContent>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",

                                                alignItems: "center",

                                                flexWrap: "wrap",

                                                gap: 2
                                            }}
                                        >

                                            {/* FROM */}

                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 150
                                                }}
                                            >

                                                <FlightTakeoffIcon />

                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                >
                                                    {ticket.fromCityName}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    Departure
                                                </Typography>

                                                <Typography>
                                                    {formatDate(
                                                        ticket.departure
                                                    )}
                                                </Typography>

                                            </Box>


                                            {/* FLIGHT LINE */}

                                            <Box
                                                sx={{
                                                    textAlign: "center",
                                                    minWidth: 150
                                                }}
                                            >

                                                <Typography
                                                    variant="h5"
                                                >
                                                    ───── ✈ ─────
                                                </Typography>

                                                <Chip
                                                    label={
                                                        ticket.transfer
                                                            ? "Transfer"
                                                            : "Direct Flight"
                                                    }
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />

                                            </Box>


                                            {/* TO */}

                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 150,
                                                    textAlign: "right"
                                                }}
                                            >

                                                <FlightLandIcon />

                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                >
                                                    {ticket.toCityName}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    Arrival
                                                </Typography>

                                                <Typography>
                                                    {formatDate(
                                                        ticket.arrival
                                                    )}
                                                </Typography>

                                            </Box>

                                        </Box>


                                        <Divider sx={{ my: 2 }} />


                                        {/* FOOTER */}

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",

                                                alignItems: "center"
                                            }}
                                        >

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                            >

                                                <Chip
                                                    icon={
                                                        <CalendarMonthIcon />
                                                    }
                                                    label={`Ticket #${ticket.no}`}
                                                />

                                                {ticket.needCheckUp && (

                                                    <Chip
                                                        label="Check Required"
                                                    />

                                                )}

                                            </Stack>


                                            <Button
                                                variant="contained"
                                            >
                                                View Ticket
                                            </Button>

                                        </Box>

                                    </CardContent>

                                </Card>

                            ))

                        )}

                    </Stack>

                )}


                {/* PAGINATION */}

                {totalPages > 1 && (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 5
                        }}
                    >

                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(event, value) =>
                                setPage(value)
                            }
                            color="primary"
                            size="large"
                        />

                    </Box>

                )}

            </Container>

        </Box>

    );
};

export default HomePage;