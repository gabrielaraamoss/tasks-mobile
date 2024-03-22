import React from 'react';
import { TareasProvider } from "../helpers/TareasProvider";
import Navbar from "../components/Navbar";
import Tareas from "./Tareas";

const Home = () =>{
    return(
        <TareasProvider>
          <Navbar />
          <Tareas />
      </TareasProvider>
    )
}

export default Home;
