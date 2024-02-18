const mqtt = require('mqtt')
const fs = require('fs')


const url = 'a3gozzilrkv83v-ats.iot.us-east-1.amazonaws.com'


// Create an MQTT client instance
const options = {
  // Clean session
  clean: true,
  connectTimeout: 4000,
  // Authentication
  clientId: 'parcheggio',
  username: 'admin',
  password: 'password',
  ca:fs.readFileSync("./secrets/rootCA.pem"),
  cert:fs.readFileSync("./secrets/cert.crt"),
  key:fs.readFileSync("./secrets/private.key")
}
const client  = mqtt.connect(url, options)
client.on('connect', function () {
  console.log('Connected')
  // Subscribe to a topic
  client.subscribe('test', function (err) {
    if (!err) {
      // Publish a message to a topic
      client.publish('test', 'Web Server connected')
    }
    else{
        console.log(err)
    }
  })
})

// Receive messages
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
