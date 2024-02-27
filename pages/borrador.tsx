// const collection = 'Cvs'
// const client = weaviate.client({
//   scheme: 'http',
//   host: '34.173.4.147:8080',
// });
// const vectorResults = await client.graphql
//   .get()
//   .withClassName(collection)
//   .withHybrid({
//     query: query,
//     alpha: 0.6,
//     fusionType: FusionType.rankedFusion
//   })
//   .withFields(`text metadata{filename} _additional { distance rerank(property: "text" query: "${query}") { score } }`)
//   .do();

// let consolidatedResults = vectorResults.data.Get[collection].reduce((acc: { [x: string]: any; }, {metadata, text}: any) => {
//   // Check if the filename already exists in the accumulator
//   if (acc[metadata.filename]) {
//     // If yes, append the text to the existing value
//     acc[metadata.filename] += `. ${text}`;
//   } else {
//     // If no, create a new entry in the accumulator
//     acc[metadata.filename] = text;
//   }
//   return acc;
// }, {});
// let textData = Object.entries(consolidatedResults).slice(0, 2).map(([key, value]) => `${key}: ${value}`).join('\n');
// setDocReference(Object.keys(consolidatedResults).slice(0, 2))

// const inputCode = `Given the following job description: ${query}, for each of the following candidates: ${textData}, give a short comment on the candidate's fit and an evaluation score out of 10. Keep the original order of the candidates. Answer in the job description language.`

// const query = "Necesito un ingeniero de datos con mínimo 2 años de experiencia, conocimiento de herramientas ETL, Docker y/o Kubernetes"
const query = `Given the following job description:
Necesito un ingeniero de datos con 2 años mínimo de experiencia.
Give a short comment and an evaluation score on fit out of 10 of the following candidate:
ALEJANDRO ROJAS BARBA 333 446 5682 alejandrorojasbarba@gmail.com https://bit.ly/2YEw7KR Guadalajara, Jalisco 333 446 5682 Guadalajara, Jalisco EXPERIENCIA PROFESIONAL LENGUAJES DE PROGRAMACIÓN Especialista de Ciencias de Datos
Laboratorios PiSA 3-4 años DAX, M Query Language 1-2 años Python, VBA Septiembre 2022 - Actualmente Analítica, procesamiento, modelado y reporteo de información para las áreas de Ciclo de Vida del Producto y Estabilidades utilizando Power BI, Power Query, Python y VBA. 6 meses a 1 SQL, Matlab, AMPL año HERRAMIENTAS 3-4 años Excel, Power BI, Power Query
Planeador de Proyectos Laboratorios PiSA Junio 2021 – Septiembre 2022 Monitoreo, modelado y reporteo de información sobre el desempeño de proyectos utilizando MS Project, Power BI y Power Query. Automatización de procesos internos con VBA y Python. 1-2 años Power Pivot, Jupyter Notebook, MS Project, Project Web App, DAX Studio 6 meses a 1 año Flask, Power Win32com, Folium, Scipy, Microsoft SQL Server, Tabular Editor, Minitab Automate, Pandas, LENGUAJES
Científico de Datos Jr. Levy Holding Noviembre 2020 – Junio 2021 Desarrollo de indicadores geoespaciales para análisis utilizando Python (Pandas, Scipy y Folium) y Microsoft SQL Server. Español Nativo Inglés Avanzado PROYECTOS Desarrollo de tableros de control Constellation Brands Becario de Ciencias de Datos Levy Holding Septiembre 2019 - Noviembre 2020 Septiembre 2019 – Noviembre 2020 Preparación, modelado y reporteo de información utilizando Excel y Power BI.
Octubre 2022 – Marzo 2023 Implementación de tableros en Power BI con indicadores para el monitoreo de distintos puntos de control en operaciones. las áreas de finanzas, comercial y FORMACIÓN ACADÉMICA Especialidad en Optimización de Sistemas Universidad Panamericana Junio 2019 – Junio 2020 Licenciatura en Ingeniería Mecatrónica Universidad Panamericana Junio 2015 – Junio 2019 Modelo de optimización para un problema de inventarios Universidad Panamericana
Noviembre 2019 – Junio 2020 Formulación matemática y simulación de un modelo de optimización capaz de obtener el esquema de pedidos adecuado para minimizar costos y satisfacer demanda. la
The comment has to be in the job description original language. Format the answer as JSON, with a key for the candidate's name, one for comment and one for the score
`
const chatEndpoint = "https://api.openai.com/v1/chat/completions";
const apiKey = "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";
const model = "gpt-3.5-turbo-0125";

const fetchJeopardyQuestions = async () => {
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
          "content": query
        }
      ],
      temperature: 0
    }),
  });
  const searchResults = await chatRequest.json();

  console.log(searchResults)
}

fetchJeopardyQuestions();
