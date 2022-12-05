const http = require("http");

const server = http.createServer((req, res) => {
	const urlPath = req.url;
	console.log(`request to path: ${urlPath}`);
	if (urlPath === "/overview") {
		res.end('Welcome to the "overview page" of the nginX project');
	} else if (urlPath === "/api") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				product_id: "xyz12u3",
				product_name: "NginX injector",
			})
		);
	} else if (urlPath === "/prod/room-code" || urlPath === "/prod/room-code/") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				"roomCode": "LOLCAL"
			})
		);
	} else if (urlPath === "/prod/join-seder" || urlPath === "/prod/join-seder/") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				"gameName":"Locala",
				"roomCode":"LOLCAL",
				"result":"success"
			})
		);
	} else if (urlPath === "/prod/close-seder" || urlPath === "/prod/close-seder/") {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(
			JSON.stringify({
				result: "success"
			})
		);
	} else if (urlPath === "/prod/submit-libs" || urlPath === "/prod/submit-libs/") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				result: "ok"
			})
		);
	} else {
		console.log("backend.js got a request");
		res.end("Successfully started a server");
	}
});

server.listen(3007, () => {
	console.log("Listening for request");
});