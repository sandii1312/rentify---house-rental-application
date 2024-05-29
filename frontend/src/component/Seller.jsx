import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Grid,
    Box,
    CircularProgress,
    Divider,
    Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atom/userAtom.js";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavBar from "./commons/navBar.jsx";

const useStyles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
        // justifyContent: "center",
        padding: "20px",
        paddingBottom: "80px", // Ensure space for the bottom bar
        position: "relative",
    },
    card: {
        display: "flex",
        marginBottom: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
    },
    cardContent: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
    },
    productImage: {
        width: "100px",
        height: "100px",
        borderRadius: "10px",
        objectFit: "cover",
    },
    wishlistIcon: {
        backgroundColor: "white",
        borderRadius: "50%",
        padding: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
    },
    emptyWishlist: {
        textAlign: "center",
        position: "relative",
    },
    emptyWishlistImage: {
        width: "100%",
        maxHeight: "300px",
    },
    emptyWishlistText: {
        position: "absolute",
        bottom: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
    },
    goToHomeButton: {
        width: "160px",
        padding: 1,
        borderRadius: "30px",
        color: "#fff",
        fontWeight: "bold",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
        marginTop: "16px",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        padding: "20px 20px",
        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "flex-end",
    },
    addButton: {
        width: "100px",
        borderRadius: "10px",
        fontWeight: "bold",
    },
};

const WishListPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getWishlist = async () => {
            try {
                const res = await fetch("/api/user/wishlist");
                const data = await res.json();
                setWishlistItems(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        getWishlist();
    }, []);

    const handleWishList = async (e, productId) => {
        e.stopPropagation();
        try {
            const res = await fetch(`/api/user/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: productId,
                }),
            });
            const data = await res.json();
            if (data.error) return toast.error(data.error);
            let newUser = { ...user, wishlist: data.wishlist };
            toast.success(data.message);
            setWishlistItems(
                wishlistItems.filter((wishlist) => wishlist._id !== productId)
            );

            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
        } catch (error) {
            toast.error(error);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "grid", placeContent: "center", minHeight: "100vh" }}>
                <CircularProgress disableShrink />
            </Box>
        );
    }

    return (
        <div style={{ backgroundColor: '#F7F6F6' }}>

            <NavBar />
            <Container sx={useStyles.container}>
                {wishlistItems?.length ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                               <strong> My Selling</strong>
                            </Typography>
                            {/* <Divider sx={{ marginBottom: "1rem" }} /> */}
                            {wishlistItems.map((item) => (
                                <Card
                                    key={item._id}
                                    onClick={() => navigate(`/product/${item._id}`)}
                                    sx={useStyles.card}
                                >
                                    <CardContent sx={useStyles.cardContent}>
                                        <Stack direction="row" spacing={2}>
                                            {item.images.length > 0 ? (
                                                <Avatar
                                                    variant="square"
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    sx={useStyles.productImage}
                                                />
                                            ) : (
                                                <Avatar
                                                    variant="square"
                                                    sx={useStyles.productImage}
                                                >
                                                    No Image
                                                </Avatar>
                                            )}
                                            <Box>
                                                <Typography variant="subtitle1">{item.title}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.description}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Price: <strong>₹{item.price}</strong>
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.numberOfBedrooms} Bedrooms,{" "}
                                                    {item.numberOfBathrooms} Bathrooms
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Area: {item.area} sq ft
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.amenities.join(", ")}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Address: {item.address.street}, {item.address.city},{" "}
                                                    {item.address.state}, {item.address.postalCode},{" "}
                                                    {item.address.country}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {user.wishlist.includes(item._id) ? (
                                                <FavoriteIcon
                                                    sx={useStyles.wishlistIcon}
                                                    onClick={(e) => handleWishList(e, item._id)}
                                                />
                                            ) : (
                                                <FavoriteBorderIcon
                                                    sx={useStyles.wishlistIcon}
                                                    onClick={(e) => handleWishList(e, item._id)}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={useStyles.emptyWishlist}>
                        <img
                            src="https://assets.materialup.com/uploads/66fb8bdf-29db-40a2-996b-60f3192ea7f0/preview.png"
                            alt="Empty Wishlist"
                            style={useStyles.emptyWishlistImage}
                        />
                        <Box sx={useStyles.emptyWishlistText}>
                            <Typography>Your wishlist is empty!</Typography>
                            <Typography>Add something to make me happy.</Typography>
                            <Button
                                onClick={() => {
                                    navigate("/");
                                }}
                                variant="contained"
                                color="success"
                                sx={useStyles.goToHomeButton}
                            >
                                Go to Home
                            </Button>
                        </Box>
                    </Box>
                )}
                <Box sx={useStyles.bottomBar}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={useStyles.addButton}
                    >
                        Add
                    </Button>
                </Box>
            </Container></div>

    );
};

export default WishListPage;
