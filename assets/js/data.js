/* ============================================
   Contenedores B — Site Data
   All editable content in one place for easy
   CMS migration (WordPress / Sanity).
   ============================================ */

const siteData = {
  company: {
    name: "Contenedores B",
    tagline: "Contenedores marítimos con entrega a toda Baja California",
    subtagline:
      "Aparta el tuyo con solo el 5% — Hermético, con factura y pedimento.",
    cta: "Cotiza hoy",
    about:
      "Somos líderes en la venta de contenedores marítimos en Baja California. Contamos con inventario disponible, entrega a domicilio y completa formalidad en cada operación.",
    highlights: [
      "Aparta con solo el 5%",
      "Hermético y certificado",
      "Factura y pedimento incluidos",
      "Entrega en Ensenada y B.C.S.",
    ],
  },

  products: [
    {
      id: "estandar-chico",
      name: "Estándar Chico",
      subtitle: "20 pies",
      price: 2500,
      currency: "USD",
      dimensions: { length: "6m", width: "2.4m", height: "2.5m" },
      features: ["Hermético", "Factura y pedimento"],
      deposit: 5,
      image: "assets/images/products/estandar-chico.jpeg",
    },
    {
      id: "estandar-grande",
      name: "Estándar Grande",
      subtitle: "40 pies",
      price: 3300,
      currency: "USD",
      dimensions: { length: "12m", width: "2.4m", height: "2.6m" },
      features: ["Hermético", "Factura y pedimento"],
      deposit: 5,
      image: "assets/images/products/estandar-grande.jpeg",
    },
    {
      id: "40hc",
      name: "40 HC",
      subtitle: "High Cube",
      price: 3600,
      currency: "USD",
      dimensions: { length: "12m", width: "2.4m", height: "2.9m" },
      features: ["Hermético", "Factura y pedimento"],
      deposit: 5,
      image: "assets/images/products/40hc.jpeg",
    },
  ],

  transport: [
    { destination: "Ensenada", cost: 3000, currency: "MXN" },
    { destination: "B.C.S.", cost: 30000, currency: "MXN" },
  ],

  testimonials: [
    {
      name: "Carlos Ramírez",
      location: "Ensenada, B.C.",
      text: "Excelente servicio. Compré un contenedor de 20 pies para almacén y llegó en perfectas condiciones. El proceso fue rápido, formal y con toda la documentación en orden. Totalmente recomendados.",
    },
    {
      name: "Lorena Rivera",
      location: "Santa Rosalía, B.C.S.",
      text: "Necesitaba un contenedor High Cube para mi negocio en Santa Rosalía y pensé que sería complicado el envío a B.C.S. Pero el equipo de Contenedores B se encargó de todo. Muy profesionales y el contenedor está hermético, tal como lo prometieron.",
    },
    {
      name: "Eduardo García",
      location: "Loreto, B.C.S.",
      text: "Ya van dos contenedores que les compro. El primero de 20 pies y luego uno de 40. Apartar con el 5% es muy accesible y la factura y pedimento te dan tranquilidad. Sin duda, los mejores precios de la zona.",
    },
  ],

  team: [
    {
      id: "katia",
      name: "Katia Pacheco",
      role: "Líder de Ventas",
      phone: "646 198 0991",
      whatsapp: "https://wa.me/526461980991",
      image: "assets/images/team/katia.jpeg",
    },
    {
      id: "diego",
      name: "Diego Gerardo Rocha",
      role: "Líder de Ventas",
      phone: "615 103 8595",
      whatsapp: "https://wa.me/526151038595",
      image: "assets/images/team/diego.jpeg",
    },
    {
      id: "edson",
      name: "Edson Ahumada",
      role: "Líder de Ventas",
      phone: "612 151 6545",
      whatsapp: "https://wa.me/526121516545",
      image: "assets/images/team/edson.jpeg",
    },
  ],

  social: [
    { network: "facebook", url: "#", label: "Facebook" },
    { network: "instagram", url: "#", label: "Instagram" },
    { network: "whatsapp", url: "https://wa.me/526461980991", label: "WhatsApp" },
  ],
};
