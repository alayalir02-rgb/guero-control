import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

type Concepto = {
  descripcion: string;
  cantidad: number;
  precio: number;
};

type CotizacionPDFProps = {
  vehiculo: {
    marca: string;
    modelo: string;
    anio: string;
    placas: string;
    kilometraje: number;

    clientes: {
      nombre: string;
      telefono: string;
      sucursal: string;
    };
  };

  conceptos: Concepto[];

  subtotal: number;
  iva: number;
  total: number;

  notas: string;
};

const styles = StyleSheet.create({

  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
  },

  header: {
    backgroundColor: "#111111",
    color: "#FFFFFF",
    padding: 25,
    paddingBottom: 20,
  },

  logo: {
    width: 75,
    height: 75,
    objectFit: "contain",
    alignSelf: "center",
    marginBottom: 8,
  },

  empresa: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  titulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },

  fecha: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 12,
  },

  datosEmpresa: {
    textAlign: "right",
    fontSize: 8,
    lineHeight: 1.5,
  },

  contenido: {
    paddingHorizontal: 28,
    paddingVertical: 22,
    paddingBottom: 55,
  },

  seccion: {
    marginBottom: 20,
  },

  tituloSeccion: {
    backgroundColor: "#111111",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    padding: 8,
    marginBottom: 10,
  },

  datosGrid: {
    flexDirection: "row",
  },

  columna: {
    flex: 1,
    paddingRight: 12,
  },

  fila: {
    flexDirection: "row",
    marginBottom: 6,
  },

  etiqueta: {
    width: 75,
    fontWeight: "bold",
  },

  valor: {
    flex: 1,
  },

  tabla: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  encabezadoTabla: {
    flexDirection: "row",
    backgroundColor: "#111111",
    color: "#FFFFFF",
    padding: 8,
    fontWeight: "bold",
  },

  filaTabla: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  cantidad: {
    width: 45,
    textAlign: "center",
  },

  descripcion: {
    flex: 1,
  },

  precio: {
    width: 90,
    textAlign: "right",
  },

  importe: {
    width: 90,
    textAlign: "right",
  },

  totales: {
    marginTop: 15,
    marginLeft: "auto",
    width: 230,
  },

  totalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: "#111111",
    paddingTop: 9,
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },

  notasBox: {
    marginTop: 25,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  notasTitulo: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 7,
  },

  notasTexto: {
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.4,
  },

  nota: {
    marginTop: 20,
    fontSize: 8,
    color: "#555555",
    lineHeight: 1.5,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111111",
    color: "#FFFFFF",
    padding: 12,
    textAlign: "center",
    fontSize: 8,
  },

});

function dinero(valor: number) {
  return valor.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CotizacionPDF({
  vehiculo,
  conceptos,
  subtotal,
  iva,
  total,
  notas,
}: CotizacionPDFProps) {

  const fecha = new Date().toLocaleDateString("es-MX");

  return (
    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        {/* ENCABEZADO */}

        <View style={styles.header}>

          <Image
            src="/logo.png"
            style={styles.logo}
          />

          <Text style={styles.empresa}>
            AUTOMOTRIZ EL GÜERO
          </Text>

          <View
  style={{
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>

  <Text
    style={{
      color: "#FFFFFF",
      fontSize: 10,
    }}
  >
    {fecha}
  </Text>
</View>

          <Text style={styles.datosEmpresa}>
            Av. Aguascalientes Ote.{"\n"}
            Tel. 449 975 04 74
          </Text>

        </View>


        {/* CONTENIDO */}

        <View style={styles.contenido}>

          {/* DATOS DEL CLIENTE */}

          <View style={styles.seccion}>

            <Text style={styles.tituloSeccion}>
              DATOS DEL CLIENTE Y VEHÍCULO
            </Text>

            <View style={styles.datosGrid}>

              {/* COLUMNA CLIENTE */}

              <View style={styles.columna}>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Cliente:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.clientes.nombre}
                  </Text>

                </View>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Teléfono:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.clientes.telefono}
                  </Text>

                </View>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Sucursal:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.clientes.sucursal}
                  </Text>

                </View>

              </View>


              {/* COLUMNA VEHÍCULO */}

              <View style={styles.columna}>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Vehículo:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.marca} {vehiculo.modelo}
                  </Text>

                </View>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Año:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.anio}
                  </Text>

                </View>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Placas:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.placas}
                  </Text>

                </View>

                <View style={styles.fila}>

                  <Text style={styles.etiqueta}>
                    Km:
                  </Text>

                  <Text style={styles.valor}>
                    {vehiculo.kilometraje.toLocaleString()} km
                  </Text>

                </View>

              </View>

            </View>

          </View>


          {/* SERVICIOS */}

          <View style={styles.seccion}>

            <Text style={styles.tituloSeccion}>
              SERVICIOS Y REFACCIONES
            </Text>

            <View style={styles.tabla}>

              {/* ENCABEZADO */}

              <View style={styles.encabezadoTabla}>

                <Text style={styles.cantidad}>
                  Cant.
                </Text>

                <Text style={styles.descripcion}>
                  Descripción
                </Text>

                <Text style={styles.precio}>
                  Precio
                </Text>

                <Text style={styles.importe}>
                  Importe
                </Text>

              </View>


              {/* CONCEPTOS */}

              {conceptos.map((concepto, index) => (

                <View
                  key={index}
                  style={styles.filaTabla}
                >

                  <Text style={styles.cantidad}>
                    {concepto.cantidad}
                  </Text>

                  <Text style={styles.descripcion}>
                    {concepto.descripcion}
                  </Text>

                  <Text style={styles.precio}>
                    ${dinero(concepto.precio)}
                  </Text>

                  <Text style={styles.importe}>
                    $
                    {dinero(
                      concepto.cantidad *
                      concepto.precio
                    )}
                  </Text>

                </View>

              ))}

            </View>


            {/* TOTALES */}

            <View style={styles.totales}>

              <View style={styles.totalFila}>

                <Text>
                  Subtotal:
                </Text>

                <Text>
                  ${dinero(subtotal)}
                </Text>

              </View>


              <View style={styles.totalFila}>

                <Text>
                  IVA 16%:
                </Text>

                <Text>
                  ${dinero(iva)}
                </Text>

              </View>


              <View style={styles.totalFinal}>

                <Text>
                  TOTAL:
                </Text>

                <Text>
                  ${dinero(total)}
                </Text>

              </View>

            </View>

          </View>


          {/* NOTAS */}

          {notas && notas.trim() !== "" && (
  <View
    style={{
      marginTop: 25,
      padding: 15,
      borderWidth: 1,
      borderColor: "#B91C1C",
      backgroundColor: "#FFF8F8",
    }}
  >
    <Text
      style={{
        color: "#B91C1C",
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 8,
      }}
    >
      NOTAS Y OBSERVACIONES
    </Text>

    <Text
      style={{
        fontSize: 10,
        lineHeight: 1.6,
      }}
    >
      {notas}
    </Text>
  </View>
)}



          {/* LEYENDA */}

          <Text style={styles.nota}>

            Los precios cotizados son estimados y podrán
            ajustarse si el proveedor confirma alguna
            variación en las características o disponibilidad
            de las refacciones. En caso de existir cambios,
            se notificará oportunamente.

          </Text>

        </View>


        {/* PIE */}

        <View style={styles.footer}>

          <Text>
            Automotriz El Güero
          </Text>

          <Text>
            Siéntete seguro, estás en Automotriz El Güero
          </Text>

        </View>

      </Page>

    </Document>
  );
}