const Tarea = require("../modelos/TareasDia");
const Usuario = require("../modelos/Usuario");
const fs = require('fs');
const path = require('path');

const listaTareas = (req, res) => {
    let consulta = Tarea.find({}).exec((error, tareas) => {
        if (error || !tareas) {
            return res.status(404).json({
                status: "error",
                mensaje: "No hay tareas"
            });
        }
        return res.status(200).send({
            status: "success",
            tareas: tareas
        });
    });
};

const obtenerTarea = (req, res) => {
    let idTarea = req.params.idTarea;
    let consulta = Tarea.findById(idTarea).exec((error, tarea) => {
        if (error || !tarea) {
            return res.status(404).json({
                status: "error",
                mensaje: "No existe la tarea"
            });
        }
        return res.status(200).send({
            status: "success",
            tarea: tarea
        });
    });
};

const obtenerTareasUsuario = (req, res) => {
    let idUsuario = req.params.idUsuario;
    //encontrar todas las tareas para usuarioAsignado
    let consulta = Tarea.find({usuarioAsignado: idUsuario}).exec((error, tareas) => {
        if (error || !tareas) {
            return res.status(404).json({
                status: "error",
                mensaje: "No hay tareas"
            });
        }
        return res.status(200).send({
            status: "success",
            tareas: tareas
        });
    });
};



//Funcionalidad solo para pruebas 
const crearTarea = (req, res) => {
    
        //Recoger parametros por post
        let parametros = req.body;
    
        //Crear objeto 
        const tarea = new Tarea(parametros);
    
    
        //Guardar el objeto en la base de datos
        tarea.save((error, tareaGuardada) => {
            if (error || !tareaGuardada) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no se ha guardado"
                });
            }
            return res.status(200).json({
                status: "success",
                tarea: tareaGuardada,
                mensaje: "La tarea se ha guardado correctamente"
            });
    
        });
    
};

const eliminarTarea = (req, res) => {

    //Eliminar tarea de la coleccion de tareas
    //Se le pasa el id por la url
    let id = req.params.id;
    Tarea.findByIdAndDelete({_id : id}, (error, tareaEliminada) => {
        if (error || !tareaEliminada) {
            return res.status(404).json({
                status: "error",
                mensaje: "La tarea no se ha eliminado"
            });
        }
        return res.status(200).json({
            status: "success",
            tarea: tareaEliminada,
            mensaje: "La tarea se ha eliminado correctamente"
        });
    });

    //Eliminar la tarea de un usuario si la tiene asignada

    

    
};

const asignarTarea = (req, res) => {
    //recojo los datos
    let idTarea = req.params.idTarea;
    let idAlumno = req.params.idAlumno;

    //actualizar tarea
    Tarea.findByIdAndUpdate({_id : idTarea}, 
                    {$set:{                             //Para actualizar valores concretos se debe usar set
                        estado : 'asignada',
                        usuarioAsignado : idAlumno,
                        fechaAsignada : Date.now()
                        }
                    },
                    {lean: true,new:true}, 
                    (error, tareaActualizada) => {
                        if (error || !tareaActualizada) {
                            return res.status(404).json({
                            status: "error",
                            mensaje: "La tarea no se ha actualizado"
                            });
                        }
                        //tareaActualizada = tareaActualizada;
                        //actualizar alumno
                        Usuario.findByIdAndUpdate({_id : idAlumno},
                            {$push:{                            //Introduce un nuevo elemento en un array
                                tareasAsignadas : idTarea
                                }
                            },
                            {lean: true,new:true},
                            (error, usuarioActualizado) => {
                                if (error || !usuarioActualizado) {
                                    return res.status(404).json({
                                    status: "error",
                                    mensaje: "El usuario no se ha actualizado"
                                    });
                                }
                                return res.status(200).json({
                                    status: "success",
                                        mensaje: "Todo se ha modificado bien",
                                        usuario : usuarioActualizado,
                                        tarea : tareaActualizada
                                });
                                //usuarioActualizado = usuarioActualizado;
                            });
                    });

    
    
    
    
};


const desasignarTarea = (req, res) => {
    let idTarea = req.params.idTarea;
    
    Tarea.findById({_id : idTarea}, (error, tarea) => {
        if (error || !tarea) {
            return res.status(404).json({
                status: "error",
                mensaje: "La tarea no existe"
            });
        }
        
        //obtener id del usuario
        let idAlumno = tarea.usuarioAsignado.toString();
        
        //Actualizar datos
        Tarea.findByIdAndUpdate({_id : idTarea},
            {$set:{
                estado : 'sinAsignar',
                usuarioAsignado : null,
                fechaAsignada : null
                }
            },
            {lean: true,new:true},
            (error, tareaActualizada) => {
                if (error || !tareaActualizada) {
                    return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no se ha actualizado"
                    });
                }
                Usuario.findByIdAndUpdate({_id : idAlumno},
                    {$pull:{                                //Saca un elemento de un array
                        tareasAsignadas : idTarea
                        }
                    },
                    {lean: true,new:true},                            //Para que devuelva el objeto actualizado
                    (error, usuarioActualizado) => {
                        if (error || !usuarioActualizado) {
                            return res.status(404).json({
                            status: "error",
                            mensaje: "El usuario no se ha actualizado"
                            });
                        }
                        return res.status(200).json({
                            status: "success",
                            mensaje: "Todo se ha modificado bien",
                            usuario : usuarioActualizado,
                            tarea : tareaActualizada
                        });
                    });
            });
            
        
                
    });
     
    /* Tarea.findById({_id : idTarea}, (error, tarea) => {
        if (error || !tarea) {
            return res.status(404).json({
                status: "error",
                mensaje: "La tarea no existe"
            });
        }
        
        //obtener id del usuario
        let idAlumno = tarea.usuarioAsignado.toString();
        
        //Actualizar datos
        Tarea.updateOne({_id : idTarea},
            {$set:{
                estado : 'sinAsignar',
                usuarioAsignado : null,
                fechaAsignada : null
                }
            },
            (error, tareaActualizada) => {
                if (error || !tareaActualizada) {
                    return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no se ha actualizado"
                    });
                }
            });
            
        Usuario.updateOne({_id : idAlumno},
            {$pull:{                                //Saca un elemento de un array
                tareasAsignadas : idTarea
                }
            },
            {new: true},                            //Para que devuelva el objeto actualizado
            (error, usuarioActualizado) => {
                if (error || !usuarioActualizado) {
                    return res.status(404).json({
                    status: "error",
                    mensaje: "El usuario no se ha actualizado"
                    });
                }
                return res.status(200).json({
                    status: "success",
                        mensaje: "Todo se ha modificado correctamete",
                });
            });
                
    }); */

};

const obtenerFoto = (req, res) => {
    let id = req.params.idTarea;
    Tarea.findById({_id : id}, (error, tarea) => {
        if (error || !tarea) {
            return res.status(404).json({
                status: "error",
                mensaje: "La tarea no existe"
            });
        }
        let foto = tarea.foto;
        let urlFisica = "./public/fotos/" + foto;
        fs.stat(urlFisica,(error,existe) => {
            if(existe){
                /* return res.status(200).json({
                    status: "success",
                        mensaje: "Todo se ha modificado correctamete",
                        ulr : urlFisica
                        //usuario : usuarioActualizado,
                        //tarea : tareaActualizada
                }); */
                return res.sendFile(path.resolve(urlFisica));
            }else{
                
               return res.sendFile(path.resolve("./public/fotos/default.jpg"));
            }
        })
        /* return res.status(200).json({
            status: "success",
                mensaje: "Todo se ha modificado correctamete",
                ulr : urlFisica
                //usuario : usuarioActualizado,
                //tarea : tareaActualizada
        }); */
    });
};



const actualizarCantidades = (req, res) => {
    let idTarea = req.params.idTarea;
    let cantidades = req.body.cantidades;
    Tarea.findById(
        {_id : idTarea},
        (error, tarea) => {
            if (error || !tarea) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no existe"
                });
            }
        }
    );

    //actualizar cantidad de los menus
    for(let i = 0; i < cantidades.length; i++){
        Tarea.updateOne(
            {_id : idTarea, "menus._id" : cantidades[i].idMenu},
            {$set:{"menus.$.cantidad" : cantidades[i].cantidad}},
            (error, tareaActualizada) => {
                if (error || !tareaActualizada) {
                    return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no se ha actualizado"
                    });
                }
            }
        );
    }
    return res.status(200).json({
        status: "success",
            mensaje: "Todo se ha modificado correctamete",
    });
    

}; 


const setrealizada = (req, res) => {
    let idTarea = req.params.idTarea;
    Tarea.findById({id : idTarea},
        (error, tarea) => {
            if (error || !tarea) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no existe"
                });
            }
        }
    );
    Tarea.updateOne(
        {
        id : idTarea},
        {$set:{realizada : true}},
        (error, tareaActualizada) => {
            if (error || !tareaActualizada) {
                return res.status(404).json({
                status: "error",
                mensaje: "La tarea no se ha actualizado"
                });
            }
        }
    );
    return res.status(200).json({
        status: "success",
            mensaje: "Todo se ha modificado correctamete",
    });

};

const setestadocompletada = (req, res) => {
    
    let idTarea = req.params.idTarea;
    Tarea.findById
    (
        {id : idTarea},
        (error, tarea) => {
            if (error || !tarea) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "La tarea no existe"   
                });
            }
        }
    );
    Tarea.updateOne(
        {
        id : idTarea},
        {$set:{estado : 'completada'}},
        (error, tareaActualizada) => {
            if (error || !tareaActualizada) {
                return res.status(404).json({
                status: "error",
                mensaje: "La tarea no se ha actualizado"
                });
            }
        }
    );
    return res.status(200).json({
        status: "success",

            mensaje: "Todo se ha modificado correctamete",
    });

};


    






module.exports = {
    listaTareas,
    crearTarea,
    eliminarTarea,
    asignarTarea,
    desasignarTarea,
    obtenerTarea,
    obtenerTareasUsuario,
    obtenerFoto,
    actualizarCantidades,
    setrealizada,
    setestadocompletada
    
}