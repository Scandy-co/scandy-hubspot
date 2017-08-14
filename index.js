require('now-env').config()
const { json, send } = require('micro');
const fetch = require('node-fetch');
const microCors = require('micro-cors');
const cors = microCors({
  allowMethods: ['POST'],
  allowHeaders: ['Access-Control-Allow-Origin', 'Content-Type'],
});

const handler = async (req, res) => {
  const data = await json(req);

  const properties = [];
  for (var key in data) {
    properties.push({
      property: key,
      value: data[key],
    });
  }

  const postData = JSON.stringify({
    properties: properties,
  });

  const response = await fetch(
    `https://api.hubapi.com/contacts/v1/contact/?hapikey=${process.env.HAPI_KEY}`,
    {
      method: `POST`,
      body: postData,
      headers: {
        'Content-Type': 'application/json',
        'COntent-Length': Buffer.byteLength(postData),
      },
    }
  );

  const responseJson = await response.json();
  if (process.env.NODE_ENV !== 'production') {
    console.log(responseJson)
  }
  return responseJson;
};

module.exports = cors(handler);
