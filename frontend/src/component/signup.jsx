import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Box, Typography, Button, TextField, Paper, Avatar, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import userAtom from '../atom/userAtom.js';
import usePreviewImg from '../hooks/usePreviewImg.js';
import { Image } from '@mui/icons-material';

const useStyles = {
  container: {
    backgroundImage: 'url(https://source.unsplash.com/featured/?house)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  paper: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '15px',
  },
  avatar: {
    margin: '10px',
    backgroundColor: 'primary.main',
  },
  form: {
    width: '100%',
    marginTop: '20px',
  },
  submit: {
    marginTop: '30px',
  },
};

const Signup = () => {
  const { imgUrl, handleImageChange } = usePreviewImg();
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
      phoneNumber: Yup.string().required('Phone is required').min(10, 'Phone number must be at least 10 characters'),
    }),
    onSubmit: async (values, { setSubmitting }) => { 
      try {
        const response = await fetch('/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber, // Map phoneNumber to phone
            avatar: imgUrl
          })
        });

        const data = await response.json();

        if (data.error) {
          throw new Error('Register failed');
        }
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate('/');
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setSubmitting(false);
      }
    } 
  });

  return (
    <Box style={useStyles.container}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={6} style={useStyles.paper}>
          <Avatar style={useStyles.avatar}>
            <HomeIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up for an Account
          </Typography>
          <form onSubmit={formik.handleSubmit} style={useStyles.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                >
                  Upload Profile Picture
                  <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {imgUrl && (
                  <Avatar
                    src={imgUrl}
                    alt="Profile Picture"
                    style={{ marginTop: '1rem', width: '100px', height: '100px' }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  type="submit" 
                  style={useStyles.submit}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
            <Button color="inherit" onClick={() => navigate("/login")}>Already have an account? Login</Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
