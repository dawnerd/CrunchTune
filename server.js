var sys = require("sys"),
	http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	ws = require('websocket-server');

http.createServer(function (request, response) {
	if(request.url == '/') request.url = '/index.html';
	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd(), uri);
	path.exists(filename, function(exists) {
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});  
            response.write("404 Not Found\n");  
            response.end();  
            return;
		}
		
		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/plain"});  
                response.write(err + "\n");  
                response.end();  
                return;
			}
			
			response.writeHead(200);
			response.write(file, "binary");
			response.end();
		})
	})
}).listen(80);

var server = ws.createServer();
server.addListener("connection", function(connection){
	sys.debug('socket connection started');
	connection.addListener("message", function(msg){
		sys.debug(msg);
		server.send(msg);
	});
});

server.listen(8000);