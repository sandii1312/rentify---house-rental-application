import React from 'react'; 
import { useFormik } from 'formik'; 
import * as Yup from 'yup';
import { Container, Box, Typography, Button, TextField, Paper, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from 'react-router-dom';
import { useRecoilState } from 'recoil';
import userAtom from '../atom/userAtom.js';

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
    width: '100%', // Fix IE 11 issue.
    marginTop: '20px',
  },
  submit: {
    marginTop: '30px',
  },
};

const Login = () => { 
  const [user, setUser] = useRecoilState(userAtom)
  const formik = useFormik({ 
    initialValues: { 
      email: '', 
      password: '' 
    }, 
    validationSchema: Yup.object({ 
      email: Yup.string().email('Invalid email address').required('Required'), 
      password: Yup.string().required('Required') 
    }), 
    onSubmit: async (values, { setSubmitting }) => { 
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        const data = await response.json()

        if (data.error) {
          throw new Error('Login failed');
        }
        setUser(data)
        localStorage.setItem("user", JSON.stringify(data))
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setSubmitting(false);
      }
    } 
  }); 

  const navigate = useNavigate();
 
  return ( 
    <Box style={useStyles.container}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} style={useStyles.paper}>
          <Avatar style={useStyles.avatar}>
            <HomeIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login to Your Account
          </Typography>
          <form onSubmit={formik.handleSubmit} style={useStyles.form}>
            <TextField 
              fullWidth 
              margin="normal"
              variant="outlined"
              label="Email" 
              name="email" 
              value={formik.values.email} 
              onChange={formik.handleChange} 
              error={formik.touched.email && Boolean(formik.errors.email)} 
              helperText={formik.touched.email && formik.errors.email} 
            /> 
            <TextField 
              fullWidth 
              margin="normal"
              variant="outlined"
              label="Password" 
              name="password" 
              type="password" 
              value={formik.values.password} 
              onChange={formik.handleChange} 
              error={formik.touched.password && Boolean(formik.errors.password)} 
              helperText={formik.touched.password && formik.errors.password} 
            /> 
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              type="submit" 
              style={useStyles.submit}
            >
              Login
            </Button>
            <p>Don't have an account 
            <Button color="inherit" onClick={() => navigate("/signup")}>Sign Up</Button></p>
          </form> 
        </Paper>
      </Container>
    </Box>
  ); 
}; 
 
export default Login;