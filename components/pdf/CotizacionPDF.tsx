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

  "Matriz": {
    nombre: "SUC. MATRIZ",
    direccion: "Mahatma Gandhi #119-B",
    referencia: "Frente a Chedraui",
    telefono: "449 140 71 16",
  },

  "Oriente": {
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

  "Agostaderito": {
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
   FORMATO MONEDA
========================================================= */

function dinero(valor: number) {
  return `$${Number(valor || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 55,
    paddingHorizontal: 38,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },

  /* HEADER */

  header: {
    backgroundColor: "#111111",
    padding: 18,
    borderRadius: 8,
    marginBottom: 18,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 75,
    height: 75,
    objectFit: "contain",
  },

  companyBlock: {
    flex: 1,
    marginLeft: 14,
  },

  companyName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  companySubtitle: {
    color: "#DDDDDD",
    fontSize: 8,
    marginTop: 4,
  },

  quoteBlock: {
    width: 105,
    alignItems: "flex-end",
  },

  quoteTitle: {
    color: "#E31B23",
    fontSize: 15,
    fontWeight: "bold",
  },

  quoteDate: {
    color: "#FFFFFF",
    fontSize: 8,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: "#E31B23",
    marginTop: 14,
    marginBottom: 10,
  },

  branchName: {
    color: "#E31B23",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },

  branchData: {
    color: "#FFFFFF",
    fontSize: 8,
    lineHeight: 1.4,
  },

  /* SECCIONES */

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    backgroundColor: "#111111",
    color: "#FFFFFF",
    fontSize: 10,
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

  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  rowLast: {
    flexDirection: "row",
  },

  label: {
    fontWeight: "bold",
    width: 85,
    color: "#555555",
  },

  value: {
    flex: 1,
    color: "#222222",
  },

  /* VEHÍCULO */

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
    fontWeight: "bold",
    color: "#555555",
    width: 70,
  },

  vehicleValue: {
    flex: 1,
  },

  /* TABLA */

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D5D5D5",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111111",
    color: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E1E1E1",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E1E1E1",
    backgroundColor: "#F7F7F7",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  colCantidad: {
    width: "12%",
    textAlign: "center",
  },

  colDescripcion: {
    width: "53%",
  },

  colPrecio: {
    width: "17%",
    textAlign: "right",
  },

  colImporte: {
    width: "18%",
    textAlign: "right",
  },

  headerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 8,
  },

  /* TOTALES */

  totalsContainer: {
    marginTop: 12,
    alignItems: "flex-end",
  },

  totalRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  totalLabel: {
    color: "#555555",
  },

  totalValue: {
    fontWeight: "bold",
  },

  totalFinal: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    backgroundColor: "#E31B23",
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginTop: 4,
    borderRadius: 5,
  },

  totalFinalText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },

  /* NOTAS */

  notesBox: {
    borderWidth: 1,
    borderColor: "#E31B23",
    borderRadius: 5,
    padding: 10,
    marginTop: 4,
  },

  notesTitle: {
    color: "#E31B23",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
  },

  notesText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#444444",
  },

  /* FOOTER */

  footer: {
    position: "absolute",
    bottom: 20,
    left: 38,
    right: 38,
    borderTopWidth: 1,
    borderTopColor: "#222222",
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 7,
    color: "#666666",
  },

  footerBrand: {
    fontSize: 7,
    color: "#E31B23",
    fontWeight: "bold",
  },
});

/* =========================================================
   PDF
========================================================= */

export default function CotizacionPDF({
  vehiculo,
  conceptos,
  subtotal,
  iva,
  total,
  notas,
}: CotizacionPDFProps) {
  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  /*
    Busca la sucursal registrada en el cliente.

    Si por alguna razón no coincide con una de las opciones,
    se utiliza Oriente como respaldo para no romper el PDF.
  */

  const sucursal =
    sucursales[vehiculo.clientes.sucursal] ||
    sucursales["Oriente"];

  const folio = `COT-${Date.now().toString().slice(-6)}`;

  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image src="/logo.png" style={styles.logo} />

            <View style={styles.companyBlock}>
              <Text style={styles.companyName}>
                AUTOMOTRIZ EL GÜERO
              </Text>

              <Text style={styles.companySubtitle}>
                Servicio, mantenimiento y cuidado para tu vehículo
              </Text>
            </View>

            <View style={styles.quoteBlock}>
              <Text style={styles.quoteTitle}>
                COTIZACIÓN
              </Text>

              <Text style={styles.quoteDate}>
                Folio: {folio}
              </Text>

              <Text style={styles.quoteDate}>
                Fecha: {fecha}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.branchName}>
            {sucursal.nombre}
          </Text>

          <Text style={styles.branchData}>
            {sucursal.direccion} · {sucursal.referencia}
          </Text>

          <Text style={styles.branchData}>
            Tel. {sucursal.telefono}
          </Text>
        </View>

        {/* =================================================
            CLIENTE
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            DATOS DEL CLIENTE
          </Text>

          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Cliente:</Text>

              <Text style={styles.value}>
                {vehiculo.clientes.nombre}
              </Text>
            </View>

            <View style={styles.rowLast}>
              <Text style={styles.label}>Teléfono:</Text>

              <Text style={styles.value}>
                {vehiculo.clientes.telefono || "No registrado"}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            VEHÍCULO
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            DATOS DEL VEHÍCULO
          </Text>

          <View style={styles.sectionBody}>
            <View style={styles.vehicleGrid}>
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Marca:</Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.marca}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Modelo:</Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.modelo}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Año:</Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.anio}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Placas:</Text>

                <Text style={styles.vehicleValue}>
                  {vehiculo.placas}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Kilometraje:</Text>

                <Text style={styles.vehicleValue}>
                  {Number(
                    vehiculo.kilometraje || 0
                  ).toLocaleString("es-MX")} km
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* =================================================
            CONCEPTOS
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            CONCEPTOS DE LA COTIZACIÓN
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text
                style={[
                  styles.colCantidad,
                  styles.headerText,
                ]}
              >
                CANT.
              </Text>

              <Text
                style={[
                  styles.colDescripcion,
                  styles.headerText,
                ]}
              >
                DESCRIPCIÓN
              </Text>

              <Text
                style={[
                  styles.colPrecio,
                  styles.headerText,
                ]}
              >
                PRECIO
              </Text>

              <Text
                style={[
                  styles.colImporte,
                  styles.headerText,
                ]}
              >
                IMPORTE
              </Text>
            </View>

            {conceptos.length === 0 ? (
              <View style={styles.tableRow}>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    color: "#777777",
                    paddingVertical: 5,
                  }}
                >
                  Sin conceptos agregados
                </Text>
              </View>
            ) : (
              conceptos.map((concepto, index) => {
                const importe =
                  Number(concepto.cantidad || 0) *
                  Number(concepto.precio || 0);

                return (
                  <View
                    key={index}
                    style={
                      index % 2 === 0
                        ? styles.tableRow
                        : styles.tableRowAlt
                    }
                  >
                    <Text style={styles.colCantidad}>
                      {concepto.cantidad}
                    </Text>

                    <Text style={styles.colDescripcion}>
                      {concepto.descripcion}
                    </Text>

                    <Text style={styles.colPrecio}>
                      {dinero(concepto.precio)}
                    </Text>

                    <Text style={styles.colImporte}>
                      {dinero(importe)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

          {/* =================================================
              TOTALES
          ================================================= */}

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Subtotal:
              </Text>

              <Text style={styles.totalValue}>
                {dinero(subtotal)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                IVA:
              </Text>

              <Text style={styles.totalValue}>
                {dinero(iva)}
              </Text>
            </View>

            <View style={styles.totalFinal}>
              <Text style={styles.totalFinalText}>
                TOTAL
              </Text>

              <Text style={styles.totalFinalText}>
                {dinero(total)}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            NOTAS
        ================================================= */}

        {notas && notas.trim() !== "" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              OBSERVACIONES
            </Text>

            <View style={styles.notesBox}>
              <Text style={styles.notesText}>
                {notas}
              </Text>
            </View>
          </View>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Gracias por confiar en Automotriz El Güero
          </Text>

          <Text style={styles.footerBrand}>
            AUTOMOTRIZ EL GÜERO
          </Text>
        </View>
      </Page>
    </Document>
  );
}