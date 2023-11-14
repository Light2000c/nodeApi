const mssql = require('mssql');

const config = {
    // server: "52.36.115.89",
    // port: 1433,
    // user: "nellobyte",
    // password: "}R:SS,\\[k:Os>wW1",
    // database: "nellobytesystems_com",
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: "}R:SS,\\[k:Os>wW1",
    database: process.env.DB_NAME,
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



const pool = new mssql.ConnectionPool(config);

pool.connect().then(() => {
    console.log("Connection established successfully");
}).catch((err) => {
    console.log(err);
    console.log("Error establishing connection");
});

const sql = pool.request();

module.exports = {

    getUserByEmail: (email, callBack) => {


        sql.query(`Select * From member Where email_address = '${email}'`, (error, results) => {

            if (error) {
                callBack(error);
            }

            return callBack(null, results.recordset);

        })

    },

    getUserTransactions: (data, callBack) => {

        let querys = '';

        if (data.dateFrom != 'undefined' && data.dateTo != 'undefined') {
            console.log("entered here 1");
            querys = `SELECT request_date, request_id, transaction_status,product_amount,amount_charged,customer_id FROM transactions WHERE member_row_id = '${data.id}' AND request_date >= '${data.dateFrom}' AND request_date <= '${data.dateTo}'`;
        } else if (data.dateFrom != 'undefined' && data.dateTo == 'undefined') {
            console.log("entered here 2");
            querys = `SELECT request_date, request_id, transaction_status,product_amount,amount_charged,customer_id FROM transactions WHERE member_row_id = '${data.id}' AND request_date >= '${data.dateFrom}'`;
        } else if (data.dateFrom == 'undefined' && data.dateTo != 'undefined') {
            console.log("entered here 3");
            querys = `SELECT request_date, request_id, transaction_status,product_amount,amount_charged,customer_id FROM transactions WHERE member_row_id = '${data.id}' AND request_date <= '${data.dateTo}'`;
        } else {
            console.log("entered here 4");
            querys = `Select request_date,  request_id, transaction_status,product_amount,amount_charged,customer_id FROM transactions where member_row_id = '${data.id}' Order by request_date Desc`;

        }

        sql.query(querys, (error, results) => {

            if (error) {
                callBack(error);
            }

            return callBack(null, results);
        });

    },

    getTransactionById: (request_id, callBack) => {

        pool.query(`Select * from transactions where request_id = '${request_id}'`, (error, results) => {

            if (error) {
                console.log(error);
                callBack(error);
            }

            return callBack(null, results);

        });
    }

}