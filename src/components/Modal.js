import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { agregarTarea, editarTarea } from '../redux/slices/tareasSlice';

const Modal = ({ mostrar, tarea, onCerrar }) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);

  const [tareaData, setTareaData] = useState({
    nombre: '',
    fecha: '',
    prioridad: 'normal',
    nota: '',
  });

  useEffect(() => {
    if (tarea) {
      setTareaData(tarea);
    } else {
      setTareaData({
        nombre: '',
        fecha: '',
        prioridad: 'normal',
        nota: '',
      });
    }
  }, [tarea]);

  const handleChange = (name, value) => {
    setTareaData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAgregarEditarTarea = () => {
    const { nombre, fecha, prioridad } = tareaData;

    if (nombre.trim() === '' || fecha.trim() === '' || prioridad.trim() === '') {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const tareaActualizada = {
      ...tareaData,
      id: tarea ? tarea.id : Date.now(),
      userId: userId,
      completada: tarea ? tarea.completada : false,
    };

    if (tarea) {
      dispatch(editarTarea(tareaActualizada));
    } else {
      dispatch(agregarTarea(tareaActualizada));
      alert("Tarea agregada con éxito");
    }
    onCerrar();
  };

  const handleCerrarModal = () => {
    setTareaData({
      nombre: '',
      fecha: '',
      prioridad: 'normal',
      nota: '',
    });
    onCerrar();
  };

  return (
    <View style={[styles.modal, mostrar && styles.mostrar]}>
      <View style={[styles.modalContenido]}>
        <TouchableOpacity style={styles.cerrar} onPress={handleCerrarModal}>
          <Text>&times;</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>{tarea ? 'Editar Tarea' : 'Agregar Tarea'}</Text>
        <View style={styles.formulario}>
          <View style={styles.campoFormulario}>
            <Text>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={tareaData.nombre}
              onChangeText={text => handleChange('nombre', text)}
            />
          </View>
          <View style={styles.campoFormulario}>
            <Text>Fecha y hora:</Text>
            <TextInput
              style={styles.input}
              value={tareaData.fecha}
              onChangeText={text => handleChange('fecha', text)}
            />
          </View>
          <View style={styles.campoFormulario}>
            <Text>Prioridad:</Text>
            <TextInput
              style={styles.input}
              value={tareaData.prioridad}
              onChangeText={text => handleChange('prioridad', text)}
            />
          </View>
          <View style={styles.campoFormulario}>
            <Text>Nota:</Text>
            <TextInput
              style={styles.input}
              value={tareaData.nota}
              onChangeText={text => handleChange('nota', text)}
            />
          </View>
          <TouchableOpacity style={styles.boton} onPress={handleAgregarEditarTarea}>
            <Text>{tarea ? 'Editar' : 'Agregar'} Tarea</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mostrar: {
    display: 'flex',
  },
  modalContenido: {
    backgroundColor: '#fefefe',
    margin: '15%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    width: '100%',
  },
  cerrar: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  formulario: {
    marginTop: 10,
  },
  campoFormulario: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  boton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Modal;
