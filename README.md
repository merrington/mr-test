# README
(Very) basic Server and Client for notifying. The server is implemented using node and has a single "/vault" endpoint. Sending a POST request to "/vault" generates a notification to the current supervisor "on shift", and places it on a queue. Sending a GET request to "/vault" removes notifications from the queue and returns them as the JSON response.  

The client.html has 2 basic client functions - the first is a button to simulate getting access to the vault which sends a POST request to the server. The second is on a 10 second interval, a GET request is sent to the server to get the current notifications and display them (in JSON format).

## How to test
1. Install dependencies  
`npm install`
2. Run server.js in a node process  
`node server.js`
3. Run client.html in a browser
4. Use the "Access Vault" button to send the request to the server to generate the notification. Watch for responses from the GET requests displaying notifications currently on the queue (notifications are removed from the queue as they are read during building the GET response).
