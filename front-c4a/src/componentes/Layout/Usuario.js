import React, { useEffect, useState } from 'react';

const Usuario = (props) => {
    return (
        <div className="usuario">
            <div style={{fontWeight: "bold"}}>{props.user.nombre} {props.user.apellido1} {props.user.apellido2}</div>
            <div className="botonesuser">
                <div className="botonuser">Modificar</div>
                <div className="botonuser-eliminar" id>Eliminar</div>
                <div className="botonuser">Ver</div>
            </div>
        </div>
    )

}

export default Usuario;