# README
(Very) basic Server and Client for notifying. The server is implemented using node and has a single "/vault" endpoint. Sending a POST request to "/vault" generates a notification to the current supervisor "on shift", and places it on a queue. Sending a GET request to "/vault" removes notifications from the queue and returns them as the JSON response.  

## How to test
1. Install dependencies
`npm install`
2. Run server.js in a node process  
`node server.js`
3. Run client.html in a browser
4. Use the "Access Vault" button to send the request to the server to generate the notification
5. client.html uses a (basic) long-polling method to then request the notifications from the server that have been generated (since last time it was polled)