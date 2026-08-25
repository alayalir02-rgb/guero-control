import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#222222",
  },

  header: {
    backgroundColor: "#111111",
    padding: 22,
    marginBottom: 25,
    color: "#ffffff",
  },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    color: "#dddddd",
  },

  headerInfo: {
    marginTop: 12,
    textAlign: "right",
    fontSize: 8,
    color: "#eeeeee",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c8102e",
    marginBottom: 12,
  },

  section: {
    border: "1 solid #dddddd",
    borderRadius: 6,
    padding: 15,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    marginBottom: 7,
  },

  label: {
    width: "28%",
    fontWeight: "bold",
  },

  value: {
    width: "72%",
  },

  table: {
    width: "100%",
    marginTop: 8,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: 8,
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #dddddd",
    padding: 8,
  },

  cantidad: {
    width: "12%",
    textAlign: "center",
  },

  descripcion: {
    width: "58%",
  },

  precio: {
    width: "15%",
    textAlign: "right",
  },

  importe: {
    width: "15%",
    textAlign: "right",
  },

  totals: {
    marginTop: 18,
    marginLeft: "55%",
    width: "45%",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#c8102e",
    color: "#ffffff",
    padding: 10,
    marginTop: 5,
    fontSize: 13,
    fontWeight: "bold",
  },

  notes: {
    marginTop: 25,
    border: "1 solid #dddddd",
    padding: 12,
    borderRadius: 6,
  },

  notesTitle: {
    color: "#c8102e",
    fontWeight: "bold",
    marginBottom: 6,
  },

  footer: {
    position: "absolute",
    bottom: 25,
    left: 35,
    right: 35,
    borderTop: "1 solid #dddddd",
    paddingTop: 8,
    textAlign: "center",
    fontSize: 8,
    color: "#777777",
  },
});

type Concepto = {
  descripcion: string;
  cantidad: number;
  precio: number;
};

type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
  placas: string;
  numero_serie: string | null;
  color: string | null;
  kilometraje: number;

  clientes: {
    nombre: string;
    telefono: string;
    sucursal: string;
  };
};

type Props = {
  vehiculo: Vehiculo;
   historial: any [];
  conceptos?: Concepto[];
  subtotal?: number;
  iva?: number;
  total?: number;
};

export default function CotizacionPDF({
  vehiculo,
  historial,
  conceptos = [],
  subtotal = 0,
  iva = 0,
  total = 0,

}: Props) {

    const fecha = new Date().toLocaleDateString("es-MX");
    const folio = `COT-${vehiculo.id}-${Date.now()
    .toString()
    .slice(-5)}`;

  return (
    <Document>

      <Page size="LETTER" style={styles.page}>

        {/* ENCABEZADO */}

        <View style={styles.header}>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}
  >

    {/* NOMBRE DE LA EMPRESA */}

    <View>
      <Text style={styles.logo}>
        AUTOMOTRIZ EL GÜERO
      </Text>

      <Text style={styles.subtitle}>
        COTIZACIÓN DE SERVICIO
      </Text>
    </View>


    {/* FOLIO Y FECHA */}

    <View
      style={{
        width: 150,
        textAlign: "right",
      }}
    >

      <Text
        style={{
          color: "#ffffff",
          fontSize: 9,
          fontWeight: "bold",
        }}
      >
        FOLIO
      </Text>

      <Text
        style={{
          color: "#ffffff",
          fontSize: 11,
          marginTop: 3,
        }}
      >
        {folio}
      </Text>

      <Text
        style={{
          color: "#dddddd",
          fontSize: 9,
          marginTop: 5,
        }}
      >
        Fecha: {fecha}
      </Text>

    </View>

  </View>


  {/* DATOS DE CONTACTO */}

  <View
    style={{
      marginTop: 15,
      borderTop: "1 solid #555555",
      paddingTop: 8,
    }}
  >

    <Text
      style={{
        color: "#eeeeee",
        fontSize: 8,
        textAlign: "right",
      }}
    >
      Av. Aguascalientes Ote. | Tel. 449 975 04 74
    </Text>

  </View>

</View>

        {/* DATOS DEL CLIENTE */}

        <View style={styles.section}>

          <Text style={styles.title}>
            Datos del Cliente y Vehículo
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Nombre:
            </Text>

            <Text style={styles.value}>
              {vehiculo.clientes.nombre}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Teléfono:
            </Text>

            <Text style={styles.value}>
              {vehiculo.clientes.telefono}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Sucursal:
            </Text>

            <Text style={styles.value}>
              {vehiculo.clientes.sucursal}
            </Text>
          </View>

        </View>


        {/* DATOS DEL VEHÍCULO */}

        <View style={styles.section}>

          <Text style={styles.title}>
            Información del Vehículo
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Vehículo:
            </Text>

            <Text style={styles.value}>
              {vehiculo.marca} {vehiculo.modelo}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Año:
            </Text>

            <Text style={styles.value}>
              {vehiculo.anio}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Placas:
            </Text>

            <Text style={styles.value}>
              {vehiculo.placas}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Kilometraje:
            </Text>

            <Text style={styles.value}>
              {vehiculo.kilometraje.toLocaleString("es-MX")} km
            </Text>
          </View>

        </View>


        {/* CONCEPTOS */}

        <View style={styles.section}>

          <Text style={styles.title}>
            Conceptos de la Cotización
          </Text>

          <View style={styles.table}>

            <View style={styles.tableHeader}>

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


            {conceptos.map((concepto, index) => (

              <View
                key={index}
                style={styles.tableRow}
              >

                <Text style={styles.cantidad}>
                  {concepto.cantidad}
                </Text>

                <Text style={styles.descripcion}>
                  {concepto.descripcion}
                </Text>

                <Text style={styles.precio}>
                  $
                  {concepto.precio.toLocaleString(
                    "es-MX",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </Text>

                <Text style={styles.importe}>
                  $
                  {(
                    concepto.cantidad *
                    concepto.precio
                  ).toLocaleString(
                    "es-MX",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </Text>

              </View>

            ))}

          </View>


          {/* TOTALES */}

          <View style={styles.totals}>

            <View style={styles.totalRow}>

              <Text>
                Subtotal:
              </Text>

              <Text>
                $
                {subtotal.toLocaleString(
                  "es-MX",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </Text>

            </View>


            <View style={styles.totalRow}>

              <Text>
                IVA:
              </Text>

              <Text>
                $
                {iva.toLocaleString(
                  "es-MX",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </Text>

            </View>


            <View style={styles.totalFinal}>

              <Text>
                TOTAL
              </Text>

              <Text>
                $
                {total.toLocaleString(
                  "es-MX",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </Text>

            </View>

          </View>

        </View>


        {/* NOTAS */}

        <View style={styles.notes}>

          <Text style={styles.notesTitle}>
            Observaciones
          </Text>

          <Text>
            Esta cotización corresponde a los conceptos
            y precios indicados anteriormente.
          </Text>

          <Text style={{ marginTop: 5 }}>
            Los precios pueden estar sujetos a cambios
            de acuerdo con las condiciones del vehículo.
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