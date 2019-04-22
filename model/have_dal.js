var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */


exports.getAll = function(page, callback) {

    var offset;

    if( page == null ) {
        offset = 0
    }
    else {
        offset = (page - 1) * 25;
    }
    var query = 'SELECT c.*, Amount, Set_Name, Set_ID FROM ygo_card c ' +
        'JOIN ygo_owned o ON c.Card_ID = o.Card_ID ' +
        'JOIN ygo_set s ON c.Card_Set = s.Set_ID ' +
        'ORDER BY Set_ID asc, c.Card_No asc ' +
        'LIMIT 25 ' +
        'OFFSET ?;';

    var queryData = [offset];

    console.log(query);

    connection.query(query, queryData, function(err, result) {
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

exports.getById = function(Card_ID, callback) {
    var query = 'SELECT c.*, Set_Name, Notes, Amount FROM ygo_card c ' +
        'LEFT JOIN ygo_set s ON c.Card_Set = s.Set_ID ' +
        'LEFT JOIN ygo_owned o ON c.Card_ID = o.Card_ID ' +
        'WHERE c.Card_ID = ?';

    var queryData = [Card_ID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.search = function(have_search, callback) {
    var query = 'SELECT c.*, Amount, Set_Name, Set_ID FROM ygo_card c ' +
                'JOIN ygo_owned o ON c.Card_ID = o.Card_ID ' +
                'LEFT JOIN ygo_set s ON c.Card_Set = s.Set_ID ' +
                'WHERE Card_Name LIKE \'%\' ?  \'%\' ';

    var queryData = [have_search];
    console.log(query);

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

exports.getWishlistAll = function(callback) {
    var query = 'SELECT c.*, Set_Name FROM ygo_wishlist w ' +
                'LEFT JOIN ygo_card c ON w.Card_ID = c.Card_ID ' +
                'LEFT JOIN ygo_set s ON c.Card_Set = s.Set_ID;';

    connection.query(query, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // Experimental add new set if not already exists
    var query = 'SELECT * FROM ygo_set WHERE Set_ID = ?';

    var querydata = [params.Card_Set];

    connection.query(query, querydata, function(err, result) {

        if( result.length == 0 ) { // Set does not exist, we need to insert a new one

            query = 'INSERT INTO ygo_set VALUES (?)';
            queryData = [params.Card_Set, params.Set_Name];


            connection.query(query, querydata, function () { // New set inserted, time to insert card data

                // Inserting new card data
                query = 'INSERT INTO ygo_card (Card_Name, Card_Set, Card_No, Card_Rarity, Card_Type, Card_Type_Full, Attack, ' +
                    'Defense, Card_Description, Image, TCG_Player) values (?)';

                if( params.Card_Type != "Monster" ) {
                    params.Attack = 0;
                    params.Defense = 0;
                }

                queryData = [params.Card_Name, params.Card_Set, params.Card_No, params.Card_Rarity, params.Card_Type,
                    params.Card_Type_Full, params.Attack, params.Defense, params.Card_Description,
                    params.Image, params.TCG_Player];

                connection.query(query, [queryData], function(err, result) {

                    if( err ) {
                        callback(err, result);
                    }
                    else {
                        var Card_ID = result.insertId;

                        query = 'INSERT INTO ygo_owned (Card_ID, Amount, Notes) VALUES (?)';

                        queryData = [Card_ID, params.Amount, params.Notes];

                        connection.query(query, [queryData], function(err, result) {

                            callback(err, params.Card_Name);
                        });
                    }

                });

            });

        }

        else { // Set already exists, this needs to be optimized to no duplicate code, but whateva


            // Inserting new card data
            query = 'INSERT INTO ygo_card (Card_Name, Card_Set, Card_No, Card_Rarity, Card_Type, Card_Type_Full, Attack, ' +
                'Defense, Card_Description, Image, TCG_Player) values (?)';

            if( params.Card_Type != "Monster" ) {
                params.Attack = 0;
                params.Defense = 0;
            }

            queryData = [params.Card_Name, params.Card_Set, params.Card_No, params.Card_Rarity, params.Card_Type,
                params.Card_Type_Full, params.Attack, params.Defense, params.Card_Description,
                params.Image, params.TCG_Player];

            connection.query(query, [queryData], function(err, result) {

                if( err ) {
                    callback(err, result);
                }
                else {
                    var Card_ID = result.insertId;

                    query = 'INSERT INTO ygo_owned (Card_ID, Amount, Notes) VALUES (?)';

                    queryData = [Card_ID, params.Amount, params.Notes];

                    connection.query(query, [queryData], function(err, result) {

                        callback(err, params.Card_Name);
                    });
                }

            });

        }



    });



};

exports.insertW = function(params, callback) {


    var query = 'INSERT INTO ygo_card (Card_Name, Card_Set, Card_No, Card_Rarity, Card_Type, Card_Type_Full, Attack, ' +
        'Defense, Card_Description, Image, TCG_Player) values (?)';

    if( params.Card_Type != "Monster" ) {
        params.Attack = 0;
        params.Defense = 0;
    }

    var queryData = [params.Card_Name, params.Card_Set, params.Card_No, params.Card_Rarity, params.Card_Type,
        params.Card_Type_Full, params.Attack, params.Defense, params.Card_Description,
        params.Image, params.TCG_Player];

    connection.query(query, [queryData], function(err, result) {

        if( err ) {
            callback(err, result);
        }
        else {
            var Card_ID = result.insertId;

            query = 'INSERT INTO ygo_wishlist VALUES (?)';

            connection.query(query, Card_ID, function(err, result) {

                callback(err, params.Card_Name);
            });
        }

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

exports.wish2own = function(Card_ID, callback) {

    var query = 'DELETE FROM ygo_wishlist WHERE Card_ID = ?';

    connection.query(query, Card_ID, function(err, res) {

        query = 'INSERT INTO ygo_owned (Card_ID, Amount) VALUES (?, 1)';

        connection.query(query, Card_ID, function(err, result) {

            query = 'SELECT Card_Name FROM ygo_card WHERE Card_ID = ?';

            connection.query(query, Card_ID, function(err, resh) {

                callback(err, resh[0].Card_Name);
            });
        });
    });
};

exports.delete = function(Card_ID, callback) {
    var query = 'DELETE FROM ygo_card WHERE Card_ID = ?';
    var queryData = [Card_ID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

/* More practical to use delete, as a card on the wishlist is most likely already not in your owned list
exports.deleteW = function(Card_ID, callback) {
    var query = 'DELETE FROM ygo_wishlist WHERE Card_ID = ?';
    var queryData = [Card_ID];

    connection.query(query, queryData, function(err, result) {

        query = 'DELETE FROM ygo_card WHERE Card_ID = ?';

        connection.query(query, queryData, function(err, result) {

            callback(err, result);
        });
    });

}; */

exports.update = function(params, callback) {
    var query = 'UPDATE ygo_card SET ' +
                    'Card_Name = ?, ' +
                    'Card_Set = ?, ' +
                    'Card_No = ?, ' +
                    'Card_Rarity = ?, ' +
                    'Card_Type = ?, ' +
                    'Card_Type_Full = ?, ' +
                    'Attack = ?, ' +
                    'Defense = ?, ' +
                    'Card_Description = ?, ' +
                    'Image = ?, ' +
                    'TCG_Player = ? ' +
                'WHERE Card_ID = ?';

    var queryData = [params.Card_Name, params.Card_Set, params.Card_No, params.Card_Rarity, params.Card_Type,
                    params.Card_Type_Full, params.Attack, params.Defense, params.Card_Description, params.Image,
                    params.TCG_Player, params.Card_ID];

    connection.query(query, queryData, function(err, result) {

        query = 'UPDATE ygo_owned SET Amount = ?, Notes = ? WHERE Card_ID = ?';

        queryData = [params.Amount, params.Notes, params.Card_ID];

        connection.query(query, queryData, function(err, result) {

            callback(err, result);
        });

    });
};

exports.edit = function(Card_ID, callback) {
    var query = 'CALL ygo_getUpdate(?)';

    connection.query(query, Card_ID, function(err, result) {
        callback(err, result);
    });
};