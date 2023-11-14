const { getUserByEmail, getUserTransactions, getTransactionById } = require('../services/transaction.service');

module.exports = {
    getUserTransaction: (req, res) => {

        const pageSize = 10;

        console.log("started");
        const data = req.query;

        getUserByEmail(data.emailAddress, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }

            if (results.length <= 0) {
                return res.json({
                    status: 'fail',
                    message: "user not found",
                });
            }

            data.id = results[0].member_row_id;

            getUserTransactions(data, (err, records) => {

                if (err) {
                    console.log(err);
                    return;
                }


                if(!records){
                    return res.json({
                        status: 'fail',
                        message: "Records not found",
                    });
                }

                paginated_result = paginate(records, data, pageSize);

                return res.json({
                    status: 'success',
                    totalRecord: records.recordset.length,
                    currentPage: data.page,
                    pageSize: pageSize,
                    data: paginated_result,
                });

            });

        });
    },

    getTransactionById: (req, res) => {

        const request_id = req.params.request_id;

        getTransactionById(request_id, (err, results) => {

            if (err) {
                console.log(err);
                return;
            }

            if (results.recordset.length <= 0) {
                return res.json({
                    status: 'fail',
                    message: "Transaction was not found"
                });
            }

            return res.json({
                status: 'success',
                data: results.recordset,
            });
        })
    }
}




function paginate(records, data, pagesize) {

    let pageSize = pagesize;
    let page = data.page

    let txn_history;
    let end;

    let start = (page * pageSize) - pageSize;
    console.log('start ==> ', start);

    let remainder = records.recordset.length - ((page * pageSize) - pageSize);
    console.log('remainder ==> ', remainder);

    if (remainder > 10) {
        console.log("remainder id greater than 10");

        end = page * pageSize;
        console.log('end ==> ', end);

        txn_history = records.recordset.slice(start, end);
        return txn_history;

    } else {
        console.log("remainder is lesser than 10");

        end = start + remainder;
        console.log('end ==> ', end);

        txn_history = records.recordset.slice(start, end);

        return txn_history;
    }
}