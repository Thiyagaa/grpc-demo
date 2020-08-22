const rpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

process.cwd();

console.log(process.cwd());
const packageDef = protoLoader.loadSync("gRPCtodo/todo.proto",{});

const grpcObj = rpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;


const server = new rpc.Server();

server.bind("localhost:40000",rpc.ServerCredentials.createInsecure())

server.addService(todoPackage.Todo.service,{
    "createTodo" : createTodo,
    "readTodo" : readTodo,
    "readTodoStream" : readTodoStream
});

server.start();

const todos = [];

function createTodo(call, callback){
    const todoItem = {
        "id" : todos.length+1,
        "text" : call.request.text
    }
    todos.push(todoItem);

    callback(null,todoItem);
}

function readTodo(call, callback){
    callback(null,{"items": todos});
}

function readTodoStream(call, callback){
    todos.forEach(i=> call.write(i));
    call.end();
}