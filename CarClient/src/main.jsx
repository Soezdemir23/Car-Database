import React from 'react'
import ReactDOM from 'react-dom/client'

import {ThemeProvider, createTheme} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
const theme = createTheme();


import Car from './Car.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Car />
    </ThemeProvider>
  </React.StrictMode>,
)
