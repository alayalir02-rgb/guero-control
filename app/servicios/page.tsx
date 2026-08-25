"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nombre: string;
};

type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
};

export default function Servicios() {

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");

  const [categoria, setCategoria] = useState("");
  const [servicio, setServicio] = useState("");

  const [fecha, setFecha] = useState("");
  const [proximaFecha, setProximaFecha] = useState("");
  const [kilometrajeActual, setKilometrajeActual] = useState("");
  const [kilometrajeProximo, setKilometrajeProximo] = useState("");
  const [notas, setNotas] = useState("");

  const [aceite, setAceite] = useState("");
  const [viscosidad, setViscosidad] = useState("");
  const [bujias, setBujias] = useState("");
  const [cambioBujias, setCambioBujias] = useState("");

  const [tipoAnticongelante, setTipoAnticongelante] = useState("");
  const [accionAnticongelante, setAccionAnticongelante] = useState("");

  const [tipoTransmision, setTipoTransmision] = useState("");
  const [aceiteTransmision, setAceiteTransmision] = useState("");

  const [servicioFrenos, setServicioFrenos] = useState("");
  const [ubicacionFrenos, setUbicacionFrenos] = useState("");

  const [servicioAire, setServicioAire] = useState("");
  const [servicioOtro, setServicioOtro] = useState("");


  useEffect(() => {
    cargarClientes();
  }, []);


  async function cargarClientes(){

    const {data,error}=await supabase
      .from("clientes")
      .select("id,nombre")
      .order("nombre");


    if(error){
      alert(error.message);
      return;
    }

    setClientes(data || []);
  }



  async function cargarVehiculos(idCliente:string){

    setClienteId(idCliente);
    setVehiculos([]);
    setVehiculoId("");


    const {data,error}=await supabase
      .from("vehiculos")
      .select("id,marca,modelo,anio")
      .eq("cliente_id",idCliente);


    if(error){
      alert(error.message);
      return;
    }


    setVehiculos(data || []);

  }
function calcularProximaFecha(fechaServicio: string) {
  if (!fechaServicio) return;

  const fecha = new Date(fechaServicio);
  fecha.setMonth(fecha.getMonth() + 6);

  const resultado = fecha.toISOString().split("T")[0];

  setProximaFecha(resultado);
}


  async function guardarServicio(){

    const {error}=await supabase
      .from("servicios")
      .insert([
        {
          vehiculo_id:Number(vehiculoId),
          fecha,
          categoria,
          servicio:
          categoria==="Aire acondicionado"
          ? servicioAire
          : categoria==="Otros"
          ? servicioOtro
          : servicio,
          kilometraje_actual:Number(kilometrajeActual),
          kilometraje_proximo:
            kilometrajeProximo ? Number(kilometrajeProximo) : null,
          proxima_fecha: proximaFecha,

          aceite,
          viscosidad,
          bujias,
          cambio_bujias:cambioBujias,

          tipo_anticongelante:tipoAnticongelante,
          accion_anticongelante:accionAnticongelante,

          tipo_transmision: tipoTransmision,
          aceite_transmision: aceiteTransmision,

          servicio_frenos: servicioFrenos,
          ubicacion_frenos: ubicacionFrenos,

          notas
        }
      ]);


      if(error){
        alert(error.message);
        return;
      }


      alert("Servicio guardado correctamente");

  }



return(

<main style={{padding:30,maxWidth:600}}>


<h1>Registrar servicio</h1>


<br/>

<label>Cliente</label>

<br/>

<select
value={clienteId}
onChange={(e)=>cargarVehiculos(e.target.value)}
>

<option value="">
Selecciona cliente
</option>

{
clientes.map(cliente=>(

<option key={cliente.id} value={cliente.id}>
{cliente.nombre}
</option>

))
}

</select>


<br/><br/>


<label>Vehículo</label>

<br/>

<select
value={vehiculoId}
onChange={(e)=>setVehiculoId(e.target.value)}
>

<option value="">
Selecciona vehículo
</option>


{
vehiculos.map(vehiculo=>(

<option key={vehiculo.id} value={vehiculo.id}>
{vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
</option>

))
}

</select>



<br/><br/>


<label>Tipo de servicio</label>

<br/>

<select
value={categoria}
onChange={(e)=>setCategoria(e.target.value)}
>

<option value="">
Selecciona
</option>

<option value="Motor">
Motor
</option>

<option value="Transmision">
Transmisión
</option>

<option value="Anticongelante">
Anticongelante
</option>

<option value="Aire acondicionado">
Aire acondicionado
</option>

<option value="Frenos">
Frenos
</option>

<option value="Otros">
Otros
</option>

</select>



<br/><br/>


<label>Servicio realizado</label>

<br/>

<input
value={servicio}
onChange={(e)=>setServicio(e.target.value)}
placeholder="Ejemplo: Cambio de aceite"
/>


<br/><br/>



{
categoria==="Motor" && (

<div>

<h3>Datos de motor</h3>


<input
placeholder="Aceite utilizado"
value={aceite}
onChange={(e)=>setAceite(e.target.value)}
/>


<br/><br/>


<input
placeholder="Viscosidad"
value={viscosidad}
onChange={(e)=>setViscosidad(e.target.value)}
/>


<br/><br/>


<input
placeholder="Tipo de bujía"
value={bujias}
onChange={(e)=>setBujias(e.target.value)}
/>


<br/><br/>


<input
placeholder="¿Se cambiaron bujías?"
value={cambioBujias}
onChange={(e)=>setCambioBujias(e.target.value)}
/>


</div>

)

}



{
categoria==="Anticongelante" && (

<div>

<h3>Datos anticongelante</h3>


<input
placeholder="Relleno o cambio completo"
value={accionAnticongelante}
onChange={(e)=>setAccionAnticongelante(e.target.value)}
/>


<br/><br/>


<input
placeholder="Marca anticongelante"
value={tipoAnticongelante}
onChange={(e)=>setTipoAnticongelante(e.target.value)}
/>


</div>

)

}

{
categoria==="Transmision" && (

<div>

<h3>Datos de transmisión</h3>


<label>Tipo de transmisión</label>
<br />

<select
value={tipoTransmision}
onChange={(e)=>setTipoTransmision(e.target.value)}
>

<option value="">
Selecciona
</option>

<option value="Automatica">
Automática
</option>

<option value="Manual">
Manual
</option>

<option value="CVT">
CVT
</option>

</select>


<br /><br />


<label>Aceite de transmisión</label>
<br />

<input
placeholder="Ejemplo: ATF Dexron VI"
value={aceiteTransmision}
onChange={(e)=>setAceiteTransmision(e.target.value)}
/>


</div>

)
}

{
categoria==="Frenos" && (

<div>

<h3>Datos de frenos</h3>


<label>Servicio realizado</label>
<br />

<input
placeholder="Ejemplo: Cambio de balatas"
value={servicioFrenos}
onChange={(e)=>setServicioFrenos(e.target.value)}
/>


<br /><br />


<label>Ubicación</label>
<br />

<select
value={ubicacionFrenos}
onChange={(e)=>setUbicacionFrenos(e.target.value)}
>

<option value="">
Selecciona
</option>

<option value="Delanteros">
Delanteros
</option>

<option value="Traseros">
Traseros
</option>

<option value="Ambos">
Ambos
</option>

</select>


</div>

)
}

{
categoria==="Aire acondicionado" && (

<div>

<h3>Datos de aire acondicionado</h3>


<label>Servicio realizado</label>
<br />

<select
value={servicioAire}
onChange={(e)=>setServicioAire(e.target.value)}
>

<option value="">
Selecciona
</option>

<option value="Carga de gas">
Carga de gas
</option>

<option value="Revision de fugas">
Revisión de fugas
</option>

<option value="Limpieza">
Limpieza
</option>

<option value="Diagnostico">
Diagnóstico
</option>

<option value="Otro">
Otro
</option>

</select>


</div>

)
}

{
categoria==="Otros" && (

<div>

<h3>Otros servicios</h3>


<label>Servicio realizado</label>
<br />

<input
placeholder="Ejemplo: Cambio de amortiguadores"
value={servicioOtro}
onChange={(e)=>setServicioOtro(e.target.value)}
/>


</div>

)
}

<br/><br/>


<label>Fecha</label>

<br/>

<input
type="date"
value={fecha}
onChange={(e)=>{
  setFecha(e.target.value);
  calcularProximaFecha(e.target.value);
}}
/>



<br/><br/>


<input
type="number"
placeholder="Kilometraje actual"
value={kilometrajeActual}
onChange={(e)=>setKilometrajeActual(e.target.value)}
/>



<br/><br/>


<input
type="number"
placeholder="Próximo servicio km"
value={kilometrajeProximo}
onChange={(e)=>setKilometrajeProximo(e.target.value)}
/>

<br /><br />

<label>Próximo servicio por fecha</label>

<br />

<input
  type="date"
  value={proximaFecha}
  onChange={(e) => setProximaFecha(e.target.value)}
/>
<br/><br/>


<textarea
placeholder="Notas"
value={notas}
onChange={(e)=>setNotas(e.target.value)}
/>


<br/><br/>


<button onClick={guardarServicio}>
Guardar servicio
</button>



</main>

);
}