import React, { useEffect, useState } from 'react';
import { Typography, Grid, Container, Card, CardContent, CardMedia, CardActions, Divider, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import NavBar from './commons/navBar';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@material-ui/icons'; // Import the favorite icon
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atom/userAtom.js';
import HomeBanner from './homeBanner.jsx';
import { Button } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor:'#F7F6F6'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F7F6F6',
    position: 'relative', // Ensure position is relative for absolute positioning of wishlist icon
    transition: 'transform 0.3s', // Add transition effect for hover
    '&:hover': {
      transform: 'scale(1.05)', // Scale up the card on hover
    },
  },
  cardMedia: {
    position: 'relative', // Ensure position is relative for absolute positioning of bedroom count
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1, // Ensure card content takes remaining space
  },
  cardActions: {
    display: 'flex',
    height: '80px',
    justifyContent: 'center',
    alignItems: 'center', // Center items vertically
    position: 'relative', // Ensure position is relative for absolute positioning of wishlist icon
  },
  button: {
    marginRight: theme.spacing(1),
  },
  wishlistIcon: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    color: '#C73659',
    cursor: 'pointer',
  },
  bedroomsCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: theme.spacing(1),
  },

  divider: {
    marginTop: 20,
    marginBottom: 20
  }
}));

const HomePage = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useRecoilState(userAtom)

  // Fetch properties on component mount
  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await fetch("/api/property");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProperties();
  }, []);

  // Function to toggle wishlist item
  const toggleWishlist = async (propertyId) => {
    if (!user) return navigate("/Login")
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: propertyId })
      })
      const data = await res.json()
      if (data.error) return toast.error(data.error)
      toast.success(data.message)
      const newUser = { ...user, wishlist: data.wishlist }
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

    } catch (error) {
      console.log(error)
    }
  };



  return (
    <div className={classes.root}>
      <NavBar />
      <HomeBanner setProperties={setProperties} />
      <Container sx={{ textAlign: 'center', py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component={'div'} style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '10px' }}>
            <strong>Properties</strong>
          </Typography>
        </Box>
        <div style={{ width: '100%', display: 'flex', textAlign: 'center', justifyContent: 'center',flexDirection:'column'}}>
          <Divider style={{ width: '100px', borderBottom: '3px solid #C73659', margin: 'auto' }} />
          <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px',marginBottom:'60px' ,fontSize:'26px'}}>
            We provide our clients with the best real estate deals. <br></br>Browse some of our featured & hot properties below or browse <br></br> our website for more offers.
          </Typography>
        </div>

      </Container>
      {/* Your existing code for background and search form */}
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {properties.length > 0 ? (properties.map((property) => (
            <Grid item key={property._id} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={property.images[0] || 'default-image.jpg'} // Fallback image if no images are available
                  title={property.title}
                >
                  <Typography variant="body2" className={classes.bedroomsCount}>
                    {property.numberOfBedrooms} {property.numberOfBedrooms > 1 ? 'BEDROOMS' : 'BEDROOM'}
                  </Typography>
                </CardMedia>
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h" component="h2">
                    {property.title}
                  </Typography>
                  <Typography>
                    {property.address.city}, {property.address.state}
                  </Typography>
                  <Divider className={classes.divider} />
                  <Typography>
                    ${property.price}
                  </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <div>
                    <Button size="small" color="primary" variant="contained"  onClick={() => navigate(`/property/${property._id}`)}
                      sx={{
                        backgroundColor:'black',
                        width: '100%',
                        padding: '8px 12px',
                        color: 'white',
                        borderRadius: 0,
                        "&:hover": {
                          backgroundColor: "black",
                          boxShadow: "none",
                        },
                      }}>
                      VIEW DETAILS
                    </Button>
                  </div>
                  <div className={classes.wishlistIcon}>
                    {user &&user.wishlist && user.wishlist.includes(property._id) ? ( // Render filled or outline wishlist icon based on selection state
                      <FavoriteIcon onClick={() => toggleWishlist(property._id)} />
                    ) : (
                      <FavoriteBorderIcon onClick={() => toggleWishlist(property._id)} />
                    )}
                  </div>
                </CardActions>
              </Card>
            </Grid>
          ))) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' ,width:'100%' , fontSize:'18px',fontWeight:'600px' }}>No properties found</div>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;

