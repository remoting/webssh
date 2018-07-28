var pty = require('pty.js');
var io = require('socket.io');
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session'); 

var app = express();
app.use("/exec", express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    httpOnly: false,
    keys: ['key1', 'key2']
}));
 
var server = http.createServer(app);
var sio = io.listen(server, {path: '/exec/socket.io'});

sio.sockets.on('connection', function (socket) {

    console.log('A socket connected!');

    socket.on('createTerminal', function(term_id, func){
        var args;
        try{
            args = term_id.split('|');
        }catch(e){
            console.log("ERROR in:", e);
            return func("token error"); 
        } 
        // 验证
        if (args.length!=4) {
            console.log("ERROR args length:", args.length)
            return func("toeken error"); 
        } 
        
        var host=process.env['K8S_HOST'];
        // kubectl exec -it --namespace ss podname -c cname bash
        var cmd = ['exec', '-it', '--namespace', args[0], args[1], '-c', args[2], args[3]] 
        var term = pty.spawn('kubectl', cmd, {
            name: 'xterm-256color',
            cwd: "~/"
        });

        term.setEncoding("utf8");
        term.on('data', function(data) {
            socket.emit('output', data);
        }); 
        term.on('exit', function(){
            socket.emit('exit', {})
        });
        //////////////////////
        socket.on('input', function (data) {
            term.write(data);
        });
        socket.on('resize', function (data) {
            console.log('resize:' + data.w + "－－－" + data.h);
            term.resize(data.w, data.h);
        });
        socket.on('disconnect', function(){
                term.destroy()
        });
        func(term_id);
    });
});

var host = "0.0.0.0";
var env_port = process.env.WEBSSH_PORT || 50000;

server.listen(env_port, host, function() {
    console.log("Listening on %s:%d in %s mode", host, env_port, app.settings.env);
});