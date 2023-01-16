const express = require('express')
const cluster = require('cluster')
const os= require('os') // to get the no of cpu , no of core inside our processor
const app = express()


const numCPU = os.cpus().length //12 core cpu

app.get('/' , (req,res)=>{
    for(let i=0 ; i<1e8 ;i++){
        //some long running task
    }
    res.send(`success .....executed from ${process.pid}`)
    // cluster.Worker.kill() //kill the current worker this is just for showing purpose 
})
//cluster uses the round robin approach
if(cluster.isMaster){
    for(let i=0 ;i< numCPU ;i++){
        cluster.fork() //will create a new worker process
    }
    //if any of the worker died 
    cluster.on('exit' ,(worker , code , signal)=>{
        console.log(`worker ${worker.process.pid} died `)
        cluster.fork();
    })
}else{
    app.listen(3000 ,()=>{ // all worker shares the same code
        console.log(`Server ${process.pid} is up and running on port @ http://localhost:3000`)
    })
}

// loadtest npm package
// loadtest -n 1000 -c 100 http://localhost:3000
