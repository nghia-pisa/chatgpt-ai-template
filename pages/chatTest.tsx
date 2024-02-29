require('dotenv').config()

async function chatTest() {
  const chatEndpoint = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.OPENAI_API_KEY;
  const model = "gpt-3.5-turbo-0125";

  const chatRequest = await fetch(chatEndpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: model,
      response_format: { "type": "json_object" },
      messages: [
        {
          "role": "system",
          "content": "As a Retrieval Augmented Generation chatbot, please answer user queries with only the provided context. If the provided context does not have enough information, say so."
        },
        {
          "role": "user",
          "content": `Given the following job description:
          Necesito un científico de datos con conocimiento de metodologías de auto-aprendizaje y experiencia en el manejo de plataformas de computación en la nube como Google Cloud Platform
          Give a short comment in spanish and an evaluation score on fit out of 10 of the following candidate:
          ING. INDUSTRIAL & TECNÓLOGO EN INFORMÁTICA Ing. Héctor Manuel Camacho Chávez 3312348803 hectorcmch@gmail.com 10 de octubre de 1995 La Estancia, Zapopan, Jalisco EXPERIENCIA PROFESIONAL HABILIDADES\nELÉCTRICA CHAPALA. Analista de SGC y Big Data. 2022 Responsable de administrar el sistema de captura de los KPIs y reportaje de los mismos. Concentración, diseño y conexión de diferentes fuentes de información para reportajes en tiempo real. Creación, mantenimiento y actualización de fuentes de información y tableros de Google DataStudio para toma de decisiones por parte de consejo y alta dirección. Mejora de consulta de información automatizada con SQL: Implementación de la conexión de las\nbases de datos SQL Server con plataformas de Google como Apps Scripts y DataStudio a través de querys personalizados, llegando a conectar más de una base de datos distinta, manejando un alto número de tablas, aplicando fórmulas y cálculos en el query para no modificar la fuente y mostrar la información deseada.\nAnálisis y manejo de data. • Calidad en el trabajo, buena priorización y toma de decisiones. Responsable y organizado. • Con habilidades de planeación y solución de problemas. • Trabajo en equipo, supervisión y seguimiento de compromisos con colaboradores. • Apasionado por el aprendizaje.\nGRUPO PRASCO. Calidad y Procesos. 2022 Encargado de crear el control documental de los procesos y establecer las bases para el sistema de gestión de calidad. Análisis de datos, extracción de información y creación de BDs y tableros de KPIs. Creación de manuales operativos y auditorías de calidad en obra. Implementación de proyectos de mejora para los procesos de Costos y Presupuestos y Compras: Estandarización de códigos y descripciones de la base maestra de presupuestos, Estandarización de base\nde datos de cotizaciones, vigencias y comparativa del precio más competitivo.\nPROGRAMAS\nC++, Python, JavaScript, HTML Básico/ Microsoft Office (Excel, Tablas dinámicas) Alto Microsoft Visio Alto (Diagramas) Google Workspace (Hojas de cálculo, Drive, Sites, etc.) Google DataStudio (Reportaje de datos en tiempo real) Monday y Trello (Gestión de Proyectos) Alto Alto Alto Neodata: ERP Alto\nSQL Intermedio Intermedio ELÉCTRICA CHAPALA. Líder de proyecto de mejora. 2022 Proyecto de reestructuración y homologación de códigos y descripciones de insumos en bases de datos y ERP, utilizados en presupuestos, catálogos de obra y control de obra. Implementación de criterios y políticas para el control y correcto nombramiento de los insumos. Implementación de un nuevo proceso y formato para la reducción de inventario a través de la búsqueda de insumos similares/sustitutos. IDIOMAS\nEspañol: Nativo Inglés: Intermedio (Alta comprensión en escucha y en lectura) REFERENCIAS\nAuxiliar de Dirección Operativa. 2018 - 2022 Aseguramiento de los informes y bitácoras de actividades de áreas operativas (Medición de Indicadores) con la creación de tableros en la plataforma DataStudio de Google. Análisis de datos, cumplimiento a peticiones de consultas y transformación de la información de las distintas BDs. Automatización de actividades mediante implementación de herramientas tecnológicas. Soporte de plataformas Google Suite, Monday, NeoData. Participación en la creación de\ndocumentación para el SGC y alineación a Norma ISO 9001. Liderar proyectos de planes de acción. Desarrollo y participación en planes y estrategias aplicadas a diversas procesos operativos y estratégicos. Auditorías a procesos. Análisis de Información y generación de Reportes.\nJorge Mercado 3334492290 mercadoruizjorgearturo@gmail.com Becario de Sistema de Gestión de Calidad. 2018 Mantenimiento del control documental. Apoyo a auditorías internas y desarrollo de metodologías de mejora continua. Documentación de procedimientos, políticas, manuales, formatos, etc. ESTUDIOS\nSalvador Trinidad Centro de Enseñanza Técnica Industrial| Docente 3314103362 trinidad.ceti@gmail.com 2014-2018 Titulo Ingeniería Industrial GDL-MX Centro de Enseñanza Técnica Industrial 2010-2014 Bachillerato, Titulo Tecnólogo Informática y Computación GDL-MX Centro de Enseñanza Técnica Industrial
          Format the response in JSON with the following schema: {"name": candidate's name, "score": evaluation score, "comment": comment}`
        }
      ],
      temperature: 1
    }),
  });

  // if (!chatRequest.ok) {
  //   throw new Error(`Error from external API: ${chatRequest.statusText}`);
  // }

  // Parse the JSON response
  const data = await chatRequest.json();

  const fs = require('fs');
  fs.writeFile('test.txt', JSON.stringify(data), (err) => {
    if (err) throw err;
  });
};

// chatTest();
console.log(process.env.OPENAI_API)

