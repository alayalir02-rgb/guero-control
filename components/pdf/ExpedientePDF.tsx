import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

/* =========================================================
   SUCURSALES
========================================================= */

const sucursales: Record<
  string,
  {
    nombre: string;
    direccion: string;
    referencia: string;
    telefono: string;
  }
> = {
  "Mahatma Gandhi": {
    nombre: "SUC. MATRIZ",
    direccion: "Mahatma Gandhi #119-B",
    referencia: "Frente a Chedraui",
    telefono: "449 140 71 16",
  },

  Matriz: {
    nombre: "SUC. MATRIZ",
    direccion: "Mahatma Gandhi #119-B",
    referencia: "Frente a Chedraui",
    telefono: "449 140 71 16",
  },

  Oriente: {
    nombre: "SUC. ORIENTE",
    direccion: "Av. Aguascalientes #101",
    referencia: "A 1 cuadra de Barberena",
    telefono: "449 975 04 74",
  },

  "López Portillo": {
    nombre: "SUC. ORIENTE",
    direccion: "Av. Aguascalientes #101",
    referencia: "A 1 cuadra de Barberena",
    telefono: "449 975 04 74",
  },

  "Segundo Anillo": {
    nombre: "SUC. ORIENTE",
    direccion: "Av. Aguascalientes #101",
    referencia: "A 1 cuadra de Barberena",
    telefono: "449 975 04 74",
  },

  Agostaderito: {
    nombre: "SUC. AGOSTADERITO",
    direccion: "Av. Agostaderito #3965",
    referencia: "Fte. a la Delegación",
    telefono: "449 913 55 19",
  },

  "Villas del Pilar": {
    nombre: "SUC. VILLAS DEL PILAR",
    direccion: "Av. Siglo XXI #3165",
    referencia: "Esq. Carlos López M.",
    telefono: "449 250 57 33",
  },

  "Tercer Anillo": {
    nombre: "SUC. VILLAS DEL PILAR",
    direccion: "Av. Siglo XXI #3165",
    referencia: "Esq. Carlos López M.",
    telefono: "449 250 57 33",
  },
};

/* =========================================================
   TIPOS
========================================================= */

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

type Servicio = {
  id: number;
  fecha: string;
  proxima_fecha: string | null;

  categoria: string | null;
  servicio: string | null;

  kilometraje_actual: number | null;
  kilometraje_proximo: number | null;

  aceite: string | null;
  viscosidad: string | null;
  bujias: string | null;
  cambio_bujias: string | null;

  tipo_anticongelante: string | null;
  accion_anticongelante: string | null;

  tipo_transmision: string | null;
  aceite_transmision: string | null;

  servicio_frenos: string | null;
  ubicacion_frenos: string | null;

  notas: string | null;
};

type Props = {
  vehiculo: Vehiculo;
  historial: Servicio[];
};

/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 55,
    paddingHorizontal: 38,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#222222",
  },

  /* ================= HEADER ================= */

  header: {
    backgroundColor: "#111111",
    padding: 18,
    marginBottom: 20,
    borderRadius: 7,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  logoImage: {
    width: 65,
    height: 65,
    objectFit: "contain",
    marginRight: 12,
  },

  companyBlock: {
    flex: 1,
  },

  companyName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#DDDDDD",
    fontSize: 8,
    marginTop: 4,
  },

  documentBlock: {
    width: 120,
    alignItems: "flex-end",
  },

  documentTitle: {
    color: "#E31B23",
    fontSize: 14,
    fontWeight: "bold",
  },

  documentDate: {
    color: "#DDDDDD",
    fontSize: 8,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E31B23",
    marginTop: 12,
    marginBottom: 9,
  },

  branchName: {
    color: "#E31B23",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },

  branchInfo: {
    color: "#FFFFFF",
    fontSize: 8,
    lineHeight: 1.4,
  },

  /* ================= SECCIONES ================= */

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    backgroundColor: "#111111",
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "bold",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  sectionBody: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderTopWidth: 0,
    padding: 11,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  /* ================= DATOS CLIENTE ================= */

  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  rowLast: {
    flexDirection: "row",
  },

  label: {
    width: 90,
    fontWeight: "bold",
    color: "#555555",
  },

  value: {
    flex: 1,
    color: "#222222",
  },

  /* ================= VEHICULO ================= */

  vehicleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  vehicleItem: {
    width: "50%",
    flexDirection: "row",
    marginBottom: 7,
  },

  vehicleLabel: {
    width: 75,
    fontWeight: "bold",
    color: "#555555",
  },

  vehicleValue: {
    flex: 1,
  },

  /* ================= HISTORIAL ================= */

  historyEmpty: {
    padding: 15,
    textAlign: "center",
    color: "#777777",
  },

  historyCard: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },

  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  historyDate: {
    color: "#E31B23",
    fontWeight: "bold",
    fontSize: 9,
  },

  historyCategory: {
    color: "#555555",
    fontWeight: "bold",
    fontSize: 8,
  },

  historyRow: {
    flexDirection: "row",
    marginBottom: 5,
  },

  historyLabel: {
    width: 115,
    fontWeight: "bold",
    color: "#555555",
  },

  historyValue: {
    flex: 1,
    color: "#222222",
  },

  detailTitle: {
    color: "#E31B23",
    fontWeight: "bold",
    fontSize: 8.5,
    marginTop: 5,
    marginBottom: 6,
  },

  detailBox: {
    backgroundColor: "#F7F7F7",
    borderRadius: 4,
    padding: 8,
    marginTop: 3,
    marginBottom: 5,
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },

  detailLabel: {
    width: 125,
    color: "#555555",
    fontWeight: "bold",
  },

  detailValue: {
    flex: 1,
    color: "#222222",
  },

  notesBox: {
    marginTop: 7,
    backgroundColor: "#F7F7F7",
    padding: 8,
    borderRadius: 4,
  },

  notesLabel: {
    fontWeight: "bold",
    color: "#E31B23",
    marginBottom: 4,
  },

  notesText: {
    color: "#444444",
    lineHeight: 1.4,
  },

  /* ================= FOOTER ================= */

  footer: {
    position: "absolute",
    bottom: 20,
    left: 38,
    right: 38,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 7,
    color: "#777777",
  },

  footerBrand: {
    fontSize: 7,
    color: "#E31B23",
    fontWeight: "bold",
  },
});

/* =========================================================
   FUNCIONES
========================================================= */

function formatearFecha(fecha: string | null | undefined) {
  if (!fecha) return "—";

  const fechaLocal = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(fechaLocal.getTime())) {
    return fecha;
  }

  return fechaLocal.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearKm(
  valor: number | null | undefined
) {
  if (
    valor === null ||
    valor === undefined ||
    Number.isNaN(Number(valor))
  ) {
    return "—";
  }

  return `${Number(valor).toLocaleString("es-MX")} km`;
}

/* =========================================================
   EXPEDIENTE PDF
========================================================= */

export default function ExpedientePDF({
  vehiculo,
  historial,
}: Props) {
  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const sucursal =
    sucursales[vehiculo.clientes.sucursal] ||
    sucursales["Oriente"];

  return (
    <Document>

      <Page
        size="LETTER"
        style={styles.page}
        wrap
      >

        {/* =================================================
            ENCABEZADO
        ================================================= */}

        <View style={styles.header}>

          <View style={styles.headerTop}>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >

              <Image
                src="/logo.png"
                style={styles.logoImage}
              />

              <View style={styles.companyBlock}>

                <Text style={styles.companyName}>
                  AUTOMOTRIZ EL GÜERO
                </Text>

                <Text style={styles.subtitle}>
                  Servicio, mantenimiento y cuidado para tu vehículo
                </Text>

              </View>

            </View>

            <View style={styles.documentBlock}>

              <Text style={styles.documentTitle}>
                EXPEDIENTE
              </Text>

              <Text style={styles.documentDate}>
                Fecha: {fecha}
              </Text>

            </View>

          </View>

          <View style={styles.divider} />

          <Text style={styles.branchName}>
            {sucursal.nombre}
          </Text>

          <Text style={styles.branchInfo}>
            {sucursal.direccion} · {sucursal.referencia}
          </Text>

          <Text style={styles.branchInfo}>
            Tel. {sucursal.telefono}
          </Text>

        </View>


        {/* =================================================
            DATOS DEL CLIENTE
        ================================================= */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            DATOS DEL CLIENTE
          </Text>

          <View style={styles.sectionBody}>

            <View style={styles.row}>

              <Text style={styles.label}>
                Nombre:
              </Text>

              <Text style={styles.value}>
                {vehiculo.clientes.nombre}
              </Text>

            </View>

            <View style={styles.rowLast}>

              <Text style={styles.label}>
                Teléfono:
              </Text>

              <Text style={styles.value}>
                {vehiculo.clientes.telefono || "No registrado"}
              </Text>

            </View>

          </View>

        </View>


        {/* =================================================
            INFORMACIÓN DEL VEHÍCULO
        ================================================= */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            INFORMACIÓN DEL VEHÍCULO
          </Text>

          <View style={styles.sectionBody}>

            <View style={styles.vehicleGrid}>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Marca:
                </Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.marca}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Modelo:
                </Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.modelo}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Año:
                </Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.anio}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Color:
                </Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.color || "No registrado"}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Placas:
                </Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.placas}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Kilometraje:
                </Text>

                <Text style={styles.vehicleValue}>
                  {formatearKm(vehiculo.kilometraje)}
                </Text>
              </View>

            </View>

            <View style={styles.rowLast}>

              <Text style={styles.label}>
                Número de serie:
              </Text>

              <Text style={styles.value}>
                {vehiculo.numero_serie || "No registrado"}
              </Text>

            </View>

          </View>

        </View>


        {/* =================================================
            HISTORIAL DE SERVICIOS
        ================================================= */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            HISTORIAL DE SERVICIOS
          </Text>

          <View style={styles.sectionBody}>

            {historial.length === 0 ? (

              <Text style={styles.historyEmpty}>
                Este vehículo todavía no tiene servicios registrados.
              </Text>

            ) : (

              historial.map((servicio, index) => (

                <View
                  key={servicio.id ?? index}
                  style={styles.historyCard}
                >

                  {/* FECHA Y CATEGORÍA */}

                  <View style={styles.historyTop}>

                    <Text style={styles.historyDate}>
                      {formatearFecha(servicio.fecha)}
                    </Text>

                    <Text style={styles.historyCategory}>
                      {servicio.categoria || "SERVICIO"}
                    </Text>

                  </View>


                  {/* SERVICIO PRINCIPAL */}

                  <View style={styles.historyRow}>

                    <Text style={styles.historyLabel}>
                      Servicio realizado:
                    </Text>

                    <Text style={styles.historyValue}>
                      {servicio.servicio || "—"}
                    </Text>

                  </View>


                  {/* DATOS ESPECÍFICOS */}

                  {servicio.categoria === "Motor" && (

                    <View style={styles.detailBox}>

                      <Text style={styles.detailTitle}>
                        DATOS DEL SERVICIO DE MOTOR
                      </Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Aceite utilizado:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.aceite || "—"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Viscosidad:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.viscosidad || "—"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Tipo de bujía:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.bujias || "—"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Cambio de bujías:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.cambio_bujias || "—"}
                        </Text>
                      </View>

                    </View>

                  )}


                  {servicio.categoria === "Transmision" && (

                    <View style={styles.detailBox}>

                      <Text style={styles.detailTitle}>
                        DATOS DE TRANSMISIÓN
                      </Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Tipo de transmisión:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.tipo_transmision || "—"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Aceite de transmisión:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.aceite_transmision || "—"}
                        </Text>
                      </View>

                    </View>

                  )}


                  {servicio.categoria === "Anticongelante" && (

                    <View style={styles.detailBox}>

                      <Text style={styles.detailTitle}>
                        DATOS DEL ANTICONGELANTE
                      </Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Acción:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.accion_anticongelante || "—"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Marca:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.tipo_anticongelante || "—"}
                        </Text>
                      </View>

                    </View>

                  )}


                  {servicio.categoria === "Frenos" && (

                    <View style={styles.detailBox}>

                      <Text style={styles.detailTitle}>
                        DATOS DE FRENOS
                      </Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Servicio de frenos:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.servicio_frenos || "—"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Ubicación:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.ubicacion_frenos || "—"}
                        </Text>
                      </View>

                    </View>

                  )}


                  {servicio.categoria === "Aire acondicionado" && (

                    <View style={styles.detailBox}>

                      <Text style={styles.detailTitle}>
                        DATOS DE AIRE ACONDICIONADO
                      </Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Servicio:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.servicio || "—"}
                        </Text>
                      </View>

                    </View>

                  )}


                  {servicio.categoria === "Otros" && (

                    <View style={styles.detailBox}>

                      <Text style={styles.detailTitle}>
                        OTROS SERVICIOS
                      </Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Servicio:
                        </Text>

                        <Text style={styles.detailValue}>
                          {servicio.servicio || "—"}
                        </Text>
                      </View>

                    </View>

                  )}


                  {/* KILOMETRAJES */}

                  <View style={styles.detailBox}>

                    <View style={styles.detailRow}>

                      <Text style={styles.detailLabel}>
                        Kilometraje actual:
                      </Text>

                      <Text style={styles.detailValue}>
                        {formatearKm(
                          servicio.kilometraje_actual
                        )}
                      </Text>

                    </View>

                    <View style={styles.detailRow}>

                      <Text style={styles.detailLabel}>
                        Próximo servicio:
                      </Text>

                      <Text style={styles.detailValue}>
                        {formatearKm(
                          servicio.kilometraje_proximo
                        )}
                      </Text>

                    </View>

                    <View style={styles.detailRow}>

                      <Text style={styles.detailLabel}>
                        Próxima fecha:
                      </Text>

                      <Text style={styles.detailValue}>
                        {formatearFecha(
                          servicio.proxima_fecha
                        )}
                      </Text>

                    </View>

                  </View>


                  {/* NOTAS */}

                  {servicio.notas &&
                    servicio.notas.trim() !== "" && (

                    <View style={styles.notesBox}>

                      <Text style={styles.notesLabel}>
                        NOTAS
                      </Text>

                      <Text style={styles.notesText}>
                        {servicio.notas}
                      </Text>

                    </View>

                  )}

                </View>

              ))

            )}

          </View>

        </View>


        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer} fixed>

          <Text style={styles.footerText}>
            Expediente del vehículo · Automotriz El Güero
          </Text>

          <Text style={styles.footerBrand}>
            Siéntete seguro, estás en Automotriz El Güero
          </Text>

        </View>

      </Page>

    </Document>
  );
}