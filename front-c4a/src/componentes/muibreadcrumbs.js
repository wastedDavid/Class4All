import {Box, Breadcrumbs, Link, Typography } from '@mui/material'
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const MuiBreadcrumbs = () => {
    return <Box m={2} className="breadcrumbs">
        <Breadcrumbs aria-label="breadcrumb"/*  separator={<NavigateNextIcon fontSize='small'></NavigateNextIcon>}*/> 
            <Link underline="hover" color="inherit" href="/">Inicio </Link>
            <Typography color="text.primary">Gestion del centro</Typography>
        </Breadcrumbs>
    </Box>
}

