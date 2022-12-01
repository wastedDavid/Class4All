import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CargandoProgress from '../../../compartido/Layout/CargandoProgress';
import RadioGroupRating from './CaritasRating';

// Vista: compartida (admins y profs)

const TareaRealizada = (props) => {

    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        setCargando(true);
        getUser();
    }, []);

    const eliminarTarea = (event) => {
        event.preventDefault();
        const url = "http://localhost:3900/api/tareas/eliminar-tareaDia/" + props.tarea._id;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const getUser = async () => {
        try {
            const url = "http://localhost:3900/api/usuarios/get-usuario/" + props.tarea.usuarioAsignado
            const res = await fetch(url)
            const data = await res.json();


            setNombre(data.usuario.nombre);
            setCargando(false);

        } catch (error) {
            console.log(error);

        }
    }


    if (cargando) {
        return <CargandoProgress/>
    } else {
        return (
            //CAMBIADO PARA QUE EN VEZ DE LOS BOTONES DE BIEN/MAL APAREZCAN CARITAS
            <div className="tarea">
                <div><label className='label-tareas'>Tarea:</label> {props.tarea.nombre}</div>
                <div><label className='label-tareas'>Fecha:</label> {props.tarea.fecha}</div>
                <div><label className='label-tareas'>Usuario:</label> {nombre}</div>
                <div><label className='label-tareas'>Realizado:</label> Si</div>
                <div><label className='label-tareas'>Confirmar:</label> <input type="checkbox"></input></div>
                <div>{RadioGroupRating()}</div>
                <form>
                    <textarea name="message" rows="5" cols="80">
                        Retroalimentación:
                    </textarea>
                </form>
                <div className="Eliminar"><DeleteIcon style={{cursor: "pointer"}} onClick={eliminarTarea}/></div>


            </div>)
    }


}

export default TareaRealizada;