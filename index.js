const { json, send } = require('micro')
const https = require('https');
const microCors = require('micro-cors')
const cors = microCors({
  allowMethods: ['POST'],
  allowHeaders: [
    'Access-Control-Allow-Origin',
    'Content-Type',
  ],
})

const handler = async (request, response) => {
  const data = await json(request);

  const properties = []
  for (var key in data) {
    properties.push({
      "property": key,
      "value": data[key],
    })
  }

  const postData = {
    "properties": properties
  }

  console.log(postData)

  const options = {
  	hostname: 'api.hubapi.com',
    path: `/contacts/v1/contact/?hapikey=${process.env.HAPI_KEY}`,
  	method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': ' Bearer: ee5894a6-eae7-4a7b-bae6-341775be822d'
    }
  }

  // set up the request
  var request = https.request(options, function(response){
  	console.log("Status: " + response.statusCode);
  	console.log("Headers: " + JSON.stringify(response.headers));
  	response.setEncoding('utf8');
  	response.on('data', function(chunk){
  		console.log('Body: ' + chunk)
  	});
  });

  request.on('error', function(e){
  	console.log("Problem with request " + e.message)
  });

  // post the data
  request.write(postData);
  request.end()
  send(response, 200, "way to go")
}

module.exports = cors(handler)
