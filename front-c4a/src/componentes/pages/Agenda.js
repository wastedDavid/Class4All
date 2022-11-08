import React,{useState,useEffect} from 'react'
import {FlechasPaginacionAgenda} from '../flechasPaginacion'
import Button from '@mui/material/Button';
import '../../styles.css'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export const Agenda = () => {

    const [curretTarea, setCurretTarea] = useState(0)//indice de la estructura de tareas
    const [cargando,setCargando] = useState(true);
    const [tareas,setTareas] = useState([]);//estructura de tareas
    //const [fotos,setFotos] = useState([]);//estructura de fotos
    


    const rellenarAgenda = async() => {
        let url = 'http://localhost:3900/api/tareas/usuario/'+'636a759040fbb96b82f9d6a0'/* +cookie */;
        try {
            let res = await fetch(url);
            let data = await res.json();
            setTareas(data.tareas);
            
            setCargando(false);
          
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        rellenarAgenda();
    }, []);


    if(cargando){
        return(
            <div>
                <h1>Cargando...</h1>
            </div>
        )
    }
    else{
        return (
            <div className='PaginaAgenda'>
                <h1>AGENDA</h1>
                
                {/* <TareaAgenda tarea={tareas[curretTarea]} key={curretTarea}/> */}
                
                <FlechasPaginacionAgenda currentTarea={curretTarea} setCurrentTarea={setCurretTarea} tareas={tareas}/>
               <div className='tareaAgenda'>
                
                <div className='tarjetaAgenda'>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia 
                        component="img"
                        height="230"
                        //Cambiar el el modelo
                        image={'http://localhost:3900/api/tareas/foto/'+tareas[curretTarea]._id}
                        alt={tareas[curretTarea].nombre}
                    />
                    <CardContent>
                        <h1>{tareas[curretTarea].nombre}</h1>
                    </CardContent>
                </Card>
                </div>
                
        
                {/*va con un calendario estático de Material UI y es la fecha limite */}
                <h2>Fecha Límite: {tareas[curretTarea].fechaLimite}</h2>
                
                
            </div>


                {/* boton-> currentTarea,tareas */}
                <div className='botonComenzar'>
                    <Button variant="outlined" style={{width:'200px',height:'80px'}} >Comenzar</Button>
                </div>
                
            </div>
        )
    }
  
}