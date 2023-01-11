const express = require('express');
const mssql = require('mssql');
const cors = require('cors');



const config = {
    server: "52.36.115.89",
    port: 1433,
    user: "nellobyte",
    password: "}R:SS,\\[k:Os>wW1",
    database: "nellobytesystems_com",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 100000
      },
       options: {
          encrypt: true,
            enableArithAbort: true,
        },
  
};
console.log(config.password);

const pool = new mssql.ConnectionPool(config);


pool.connect().then(()=>{
  console.log("Connection established successfully");
}).catch((err)=>{
  console.log(err);
  console.log("Error establishing connection");
});

const sql  = pool.request();

const app = express();

app.use(cors({
  origin : "*",
}));

app.get('/getTransactions/:user_key', async (req, res) => {
const user_key = req.params.user_key;
const query = `Select * from member_auth where api_key = '${user_key}'`;
let user_id;

 await sql.query((query), (err, result)=> {

   // Execute the query
    if (err) {
      // Handle the error
    }

    // Convert the results to a JSON string
    const json = JSON.stringify(result);

    // Send the JSON data in the response
    const data = JSON.parse(json);
    // console.log(data.recordsets[0][0].member_row_id);
    user_id =  data.recordsets[0][0].member_row_id;
    // user_id = 77;
    // res.send(json);

    // console.log("Gotten user id ==>", user_id);
    const query2 = `Select transasction_date,transaction_status,product_description,product_amount,amount_charged,customer_id from transactions where member_row_id = '${user_id}'`;
    
    sql.query((query2), (err, result2)=> {
    
      // Execute the query
       if (err) {
         // Handle the error
       }
    
       // Convert the results to a JSON string
       console.log(result2);
       const json = JSON.stringify(result2.recordsets[0]);
    
       // Send the JSON data in the response
       const data = JSON.parse(json);

       res.send(json);
    
    });

});


});


app.get('/getTransactions', async (req, res)=>{
const query =  'SELECT * from transactions';
    sql.query((query), (err, result)=>{

      if(err){

      }
      const data = JSON.stringify(result);
      console.log(result);
      res.send(data);
  
    });
  
  });


// app.get('/getTransactions', async (req, res)=>{
//     // const pool = await mssql.connect(config);
//    const result = pool.request().query('SELECT * from transactions');

//     res.send('Connected to the database successfully');
//     console.log(result);
  
//     res.status(500).send('Error connecting to the database');
// });



app.listen(3000);