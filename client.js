const rpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto",{});

const grpcObj = rpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const client = new todoPackage.Todo("localhost:40000",rpc.credentials.createInsecure());
const text = process.argv[2];
client.createTodo({
    "id":"-1",
    "text" : text
},(err,response)=>{
    console.log("received response from server " + JSON.stringify(response));
});


client.readTodo({},(error,response)=>{
    console.log("received response from server " + JSON.stringify(response));
})

const call = client.readTodoStream();

call.on("data",item=>{
    console.log( " received data in stream from server ", JSON.stringify(item));
})

call.on("end",e=>{
    console.log( " closing server stream ");
})