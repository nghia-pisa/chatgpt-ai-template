async function searchTest() {
  const searchEndpoint = "http://34.173.4.147:8080/v1/graphql";
  const collection = "Cvs";
  const userQuery = "Necesito un ingeniero de datos con 2 años de experiencia"

  const searchBody = {
    query: `
      {
        Get {
          ${collection}(
            hybrid: {
              query: "${userQuery}"
              properties: ["text"]
              alpha: 0.6
              fusionType: relativeScoreFusion
            }
            autocut: 2
          ) {
            text
            filename
            _additional {
              rerank(
                property: "text"
                query: "${userQuery}"
              ) {
                score
              }
            }
          }
        }
      }
    `,
  };
  
  const searchRequest = await fetch(searchEndpoint, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchBody)
  });

  const data = await searchRequest.json();

  // Parse the JSON response
  const newArray = data.data.Get.Cvs.map(({ filename, text }) => ({ filename, text }))

  const fs = require('fs');
  fs.writeFile('test.txt', JSON.stringify(data), (err) => {
    if (err) throw err;
  });
};

searchTest();
