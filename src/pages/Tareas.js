import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, CheckBox } from 'react-native';
import Modal from '../components/Modal';
import { TareasContext } from '../helpers/TareasProvider'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; 
import { faTrash, faPenToSquare, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'; 
import { eliminarTarea, editarTarea } from '../redux/slices/tareasSlice'; 
import { useDispatch, useSelector } from 'react-redux'; 

function Tareas() {
    const dispatch = useDispatch();
    const tareas = useSelector(state => state.tarea.tareas);
    const userId = useSelector(state => state.user.userId);
    const tareasUsuario = tareas.filter(tarea => tarea.userId === userId);
    const { darkMode } = useContext(TareasContext);
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [orden, setOrden] = useState('nombre');
    const [modalData, setModalData] = useState({ show: false, tarea: null });

    const handleAgregarTarea = () => {
        setModalData({ show: true, tarea: null });
    };

    const handleEditarTarea = (tarea) => {
        setModalData({ show: true, tarea: { ...tarea } });
    };

    const handleEliminarTarea = (id) => {
        dispatch(eliminarTarea(id)); 
    };

    const handleCerrarModal = () => {
        setModalData({ show: false, tarea: null });
    };

    const toggleCompletada = (id) => {
        const tarea = tareasUsuario.find(t => t.id === id);
        if (tarea) {
            const completada = !tarea.completada;
            dispatch(editarTarea({ ...tarea, completada }));
        }
    };

    const tareasFiltradas = () => {
        switch (filtroEstado) {
            case 'completadas':
                return tareasUsuario.filter(tarea => tarea.completada);
            case 'pendientes':
                return tareasUsuario.filter(tarea => !tarea.completada);
            default:
                return tareasUsuario;
        }
    };

    const handleOrdenarTareas = (tareas) => {
        switch (orden) {
            case 'fecha':
                return tareas.sort((a, b) => b.fechaCreacion - a.fechaCreacion);
            case 'prioridad':
                return tareas.sort((a, b) => a.prioridad.localeCompare(b.prioridad));
            case 'nombre':
            default:
                return tareas.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
    };

    const tareasMostradas = handleOrdenarTareas(tareasFiltradas());

    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.tarjetaTarea, item.completada ? styles.completada : null]}>
            <CheckBox
                value={item.completada}
                onValueChange={() => toggleCompletada(item.id)}
            />
            <View style={styles.infoTarea}>
                <Text style={styles.tareaNombre}>{item.nombre}</Text>
                <Text><Text style={styles.sombreado}>Fecha:</Text> {formatearFecha(item.fecha)}</Text>
                <Text style={styles.sombreado}>Nota:</Text>
                <Text>{item.nota}</Text>
            </View>
            <View style={[styles.estadoTarea, item.completada ? styles.completada : styles.pendiente]}>
                <Text style={styles.estado}>{item.completada ? 'Completado' : 'Pendiente'}</Text>
            </View>
            <View style={styles.acciones}>
                <TouchableOpacity style={styles.editar} onPress={() => handleEditarTarea(item)}>
                    <FontAwesomeIcon icon={faPenToSquare} title="Editar" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.eliminar} onPress={() => handleEliminarTarea(item.id)}>
                    <FontAwesomeIcon icon={faTrash} title="Eliminar" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.tareasContainer, darkMode ? styles.dark : null]}>
            <Text style={styles.titulo}>Mis tareas</Text>
            <View style={styles.tareasForm}>
                <TouchableOpacity style={styles.agregarButton} onPress={handleAgregarTarea}>
                    <Text>Agregar Tarea</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filtros}>
                <View style={styles.porEstado}>
                    <Text>Filtrar por estado:</Text>
                    <Picker
                        selectedValue={filtroEstado}
                        onValueChange={(itemValue) => setFiltroEstado(itemValue)}
                    >
                        <Picker.Item label="Todas" value="todas" />
                        <Picker.Item label="Completadas" value="completadas" />
                        <Picker.Item label="Pendientes" value="pendientes" />
                    </Picker>
                </View>
                <View style={styles.porFiltro}>
                    <Text>Ordenar por:</Text>
                    <Picker
                        selectedValue={orden}
                        onValueChange={(itemValue) => setOrden(itemValue)}
                    >
                        <Picker.Item label="Nombre" value="nombre" />
                        <Picker.Item label="Fecha" value="fecha" />
                        <Picker.Item label="Prioridad" value="prioridad" />
                    </Picker>
                </View>
            </View>
            {tareasMostradas.length === 0 ? (
                <View style={styles.mensajeVacio}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={styles.alerta} />
                    <Text>No hay tareas disponibles.</Text>
                </View>
            ) : (
                <FlatList
                    data={tareasMostradas}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            )}
            <Modal
                mostrar={modalData.show}
                tarea={modalData.tarea}
                onCerrar={handleCerrarModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tareasContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    dark: {
        backgroundColor: '#333',
        color: '#fff',
    },
    titulo: {
        textAlign: 'center',
        fontSize: 20,
    },
    tareasForm: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    agregarButton: {
        padding: 10,
        backgroundColor: '#4caf50',
        borderRadius: 5,
    },
    filtros: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    porEstado: {
        marginRight: 20,
    },
    porFiltro: {
        marginLeft: 20,
    },
    estadoTarea: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: '-50%' }],
        right: 10,
        padding: 5,
        borderRadius: 5,
        fontWeight: 'bold',
    },
    estado: {
        fontWeight: 'bold',
        color: '#fff',
    },
    completada: {
        backgroundColor: '#4caf50',
    },
    pendiente: {
        backgroundColor: '#f44336',
    },
    acciones: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
    },
    editar: {
        marginLeft: 5,
    },
    eliminar: {
        marginLeft: 5,
    },
    mensajeVacio: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    alerta: {
        color: 'rgb(255, 201, 24)',
        fontSize: 20,
    },
    tarjetaTarea: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    infoTarea: {
        padding: 10,
        flex: 1,
    },
    tareaNombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sombreado: {
        fontWeight: 'bold',
    },
});

export default Tareas;
