var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */


exports.getAll = function(callback) {
    var query = 'SELECT Set_ID, Set_Name, fn_total_set_cards(Set_ID) AS \'Total\' FROM ygo_set ' +
                'ORDER BY Total desc;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getSum = function(list) {

    var sum = 0;

    for( var i = 0; i < list.length; i++ ) {
        sum += list[i].Amount;
    }

    return sum;
};

exports.getById = function(Set_ID, callback) {
    var query = 'SELECT c.*, Set_Name, Amount FROM ygo_set s ' +
                'LEFT JOIN ygo_card c ON s.Set_ID = c.Card_Set ' +
                'JOIN ygo_owned o ON c.Card_ID = o.Card_ID ' +
                'WHERE Set_ID = ? ' +
                'ORDER BY c.Card_No';

    console.log(query);

    connection.query(query, Set_ID, function(err, result) {

        callback(err, result);
    });
};

exports.search = function(have_search, callback) {
    var query = 'select Set_ID, Set_Name, fn_total_set_cards(Set_ID) AS \'Total\' from ygo_set ' +
                'WHERE Set_Name LIKE \'%\' ?  \'%\' OR Set_ID LIKE \'%\' ? \'%\' ';

    var queryData = [have_search, have_search];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.count = function(have_search, callback) {
    var query = 'SELECT count(*) as Total FROM ygo_set ' +
        'WHERE Set_Name LIKE \'%\' ?  \'%\' OR Set_ID LIKE \'%\' ? \'%\' ';

    var queryData = [have_search, have_search];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

// Gets info for Sets, Types, and Rarity
exports.getAdd = function(callback) {
    var query = 'CALL ygo_getAdd();';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getSets = function(callback) {
    var query = 'SELECT * FROM ygo_set';

    connection.query(query, function(err, result) {
        callback(err, result);
    })
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO ygo_set VALUES (?)';

    var queryData = [params.Set_ID, params.Set_Name];

    connection.query(query, [queryData], function(err, result) {

        callback(err, result);

    });

};

exports.decAmt = function(Card_ID, callback) {

    var query = 'SELECT Amount FROM ygo_owned ' +
                'WHERE Card_ID = ?';

    //var queryData = Card_ID;

    connection.query(query, Card_ID, function(err, result) {

        query = 'UPDATE ygo_owned SET Amount = ? WHERE Card_ID = ?';
        var queryData = [result[0].Amount - 1, Card_ID];

        connection.query(query, queryData, function(err, result) {

            callback(err, result);
        });

    });

};

exports.incAmt = function(Card_ID, callback) {

    var query = 'SELECT Amount FROM ygo_owned ' +
        'WHERE Card_ID = ?';

    //var queryData = Card_ID;

    connection.query(query, Card_ID, function(err, result) {

        query = 'UPDATE ygo_owned SET Amount = ? WHERE Card_ID = ?';
        var queryData = [result[0].Amount + 1, Card_ID];

        connection.query(query, queryData, function(err, result) {

            callback(err, result);
        });

    });

};

exports.delete = function(Set_ID, callback) {
    var query = 'DELETE FROM ygo_set WHERE Set_ID = ?';

    connection.query(query, Set_ID, function(err, result) {
        callback(err, result);
    });

};

exports.update = function(params, callback) {
    var query = 'UPDATE ygo_set SET Set_ID = ?, Set_Name = ? WHERE Set_ID = ?';
    var queryData = [params.Set_ID, params.Set_Name, params.oldSet_ID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.edit = function(Set_ID, callback) {
    var query = 'SELECT * FROM ygo_set WHERE Set_ID = ?';

    connection.query(query, Set_ID, function(err, result) {
        callback(err, result);
    });
};