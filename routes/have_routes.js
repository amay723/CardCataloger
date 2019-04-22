var express = require('express');
var router = express.Router();
var have_dal = require('../model/have_dal');
var scraper = require('../model/scraper');

router.get('/home', function(req, res) {

    res.render('have/haveHome', { 'result':res });


});

router.get('/search', function(req, res) {
    have_dal.search(req.query.have_search, function(err, result){
        if(err) {
            //res.send(err);
            res.render('have/haveSearch', { 'err': err, 'result':result, 'search':req.query });
        }
        else {
            res.render('have/haveSearch', { 'result':result, 'search':req.query });
        }
    });

});

// View All Cards
router.get('/all', function(req, res) {

    var page = parseInt(req.query.Page);

    have_dal.getAll(page, function(err, result){

        if(err) {
            //res.send(err);
            // If error, still render the page but with error message
            res.render('have/haveViewAll', {'err': err, 'result':result, 'sum': sum, 'hash': '#', 'page': page });
        }
        else {

            var sum = have_dal.getSum(result);

            //var price = scraper.marketPrice(result);

            res.render('have/haveViewAll', {'result':result, 'sum': sum, 'hash': '#', 'page': page });
        }
    });

});

// View Card by ID
router.get('/', function(req, res){
    if(req.query.Card_ID == null) {
        res.send('Card_ID is null');
    }
    else {
        have_dal.getById(req.query.Card_ID, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('have/haveViewById', {'result': result[0], 'Card_ID': req.query.Card_ID});
           }
        });
    }
});


// Manually add a new card
router.get('/add', function(req, res){

    have_dal.getAdd( function(err, result) {
        if(err) {
            res.send(err);
        }
        else {
            res.render('have/haveAdd', {'result': res, 'sets': result[0], 'rarity': result[1], 'type': result[2]});
        }
    });

});

router.get('/addByURL', function(req, res){

    scraper.urlAdd(req.query, function(err, result) {
        if( err ) {
            res.send(err);
        }
        else {
            res.render('have/haveAddByURL', {'result': result, 'ins': req.query.ins});
        }
    })
    //res.render('have/haveAddByURL', {'URL': req.query.url });

});

router.get('/wishlistAdd', function(req, res){

    have_dal.getAdd( function(err, result) {
        if( err ) {
            res.send(err);
        }
        else {
            res.render('have/haveWishlistAdd', {
                'result': res,
                'sets': result[0],
                'rarity': result[1],
                'type': result[2]
            });
        }
    });

});

router.get('/wishlistAll', function(req, res) {

    have_dal.getWishlistAll( function( err, result ) {

        if( err ) {
            res.render('have/haveWishlistAll', {'err': err, 'result': result});
        }
        else {
            res.render('have/haveWishlistAll', {'result': result});
        }
        /*
        var price = [];

        for( var i = 0; i < result.length; i++ ) {
            scraper.marketPrice(result[i], function(err, mPrice) {
                price.push(mPrice);
                console.log(mPrice);
                if( price.length == result.length ) {

                    var fPrice = [];
                    var p;
                    for( var j = 0; j < result.length; j++ ) {

                        for( var k = 0; k < price.length; k++ ) {
                            if( price[k].Card_ID == result[j].Card_ID ) {
                                p = price[k].price;
                            }
                        }

                        fPrice.push(p);
                    }
                    res.render('have/haveWishlistAll', {'result': result, 'price': fPrice});
                }
            });
        }
    */


    });
});

// Submit a new card
router.post('/insert', function(req, res) {

    // Check if all fields were filled
    if (req.body.Card_Name == "") {
        res.send('Card Name must be provided.');
    }
    else if (req.body.Card_No == "") {
        res.send('Card Number must be provided.');
    }
    else if ( req.body.Card_Type_Full == "" ) {
        res.send('Card Type Full must be provided')
    }
    else if (req.body.Attack == "" || req.body.Defense == "") {
        res.send('Attack/Defense must be provided');
    }
    else if (req.body.Card_Description == "") {
        res.send('Description must be provided');
    }
    else if (req.body.Amount == "" || req.body.Amount == null) {
        res.send('Amount must be provided');
    }
    else if (req.body.Set_Name == "" ) {
        res.send('Set name must be provided');
    }
    else {

        // Defauly Image if none found
        if (req.body.Image == "") {
            req.body.Image = 'http://i.tcgplayer.com/0_200w.jpg';
        }
        have_dal.insert(req.body, function(err,Card_Name) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                have_dal.getAll(function(err, result){
                    if(err) {
                        res.send(err);
                    }
                    else {

                        var sum = have_dal.getSum(result);

                        res.render('have/haveViewAll', { 'result':result, 'was_successful': true, 'newc': Card_Name,
                            'sum': sum, 'hash': '#' });
                    }
                });

            }
        });
    }
});

// Insert into Wishlist
router.post('/insertW', function(req, res) {

    // Check if all fields were filled
    if (req.body.Card_Name == "") {
        res.send('Card Name must be provided.');
    }
    else if (req.body.Card_No == "") {
        res.send('Card Number must be provided.');
    }
    else if ( req.body.Card_Type_Full == "" ) {
        res.send('Card Type Full must be provided')
    }
    else if (req.body.Attack == "" || req.body.Defense == "") {
        res.send('Attack/Defense must be provided');
    }
    else if (req.body.Card_Description == "") {
        res.send('Description must be provided');
    }
    else {

        // Default Image if none given
        if (req.body.Image == "") {
            req.body.Image = 'http://i.tcgplayer.com/0_200w.jpg';
        }
        have_dal.insertW(req.body, function(err,Card_Name) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                have_dal.getWishlistAll(function(err, result){
                    if(err) {
                        res.send(err);
                    }
                    else {
                        res.render('have/haveWishlistAll', { 'result':result, 'was_successful': true, 'newc': Card_Name, 'hash': '#' });
                    }
                });

            }
        });
    }
});

// Decrement number of particular card owned
router.get('/decAmt', function( req, res ) {

    if( req.query.Card_ID == null ) {
        res.send('Card_ID is null');
    }
    else {
        have_dal.decAmt( req.query.Card_ID, function( err, resh ) {

            have_dal.getAll(function(err, result){
                if(err) {
                    res.send(err);
                }
                else {

                    var sum = have_dal(result);

                    res.render('have/haveViewAll', { 'result':result, 'sum': sum, 'hash': req.query.Card_ID });
                }
            });

        });
    }
});

// Increment number of particular card owned
router.get('/incAmt', function( req, res ) {

    if( req.query.Card_ID == null ) {
        res.send('Card_ID is null');
    }
    else {
        have_dal.incAmt( req.query.Card_ID, function( err, resh ) {

            have_dal.getAll(function(err, result){
                if(err) {
                    res.send(err);
                }
                else {

                    var sum = have_dal.getSum(result);

                    res.render('have/haveViewAll', { 'result':result, 'sum': sum, 'hash': '#' }); // 'hash': req.query.Card_ID
                }
            });

        });
    }
});

// Move card from Wishlist to Owned list
router.post('/addToOwned', function( req, res ) {

    if( req.body.Card_ID == null ) {
        res.send('Card_ID is null');
    }
    else {
        have_dal.wish2own( req.body.Card_ID, function( err, Card_Name ) {

            if(err) {
                res.send(err);
            }
            else {

                have_dal.getAll(function(err, result){
                    if(err) {
                        res.send(err);
                    }
                    else {

                        var sum = have_dal.getSum(result);

                        res.render('have/haveViewAll', { 'result':result, 'add_successful': true, 'newc': Card_Name,
                            'sum': sum, 'hash': '#' });
                    }
                });
            }

        });
    }
});


router.get('/edit', function(req, res){
    if(req.query.Card_ID == null) {
        res.send('A Card id is required');
    }
    else {
        have_dal.edit(req.query.Card_ID, function(err, result){
            res.render('have/haveUpdate', {'result': result[3][0],'sets': result[0], 'rarity': result[1], 'type': result[2]});
        });
    }

});

router.post('/update', function(req, res) {
    have_dal.update(req.body, function(err, result){

        if(err) {
            res.send(err);
        }
        else {
            have_dal.getAll(function(err, result){
                if(err) {
                    res.send(err);
                }
                else {

                    var sum = have_dal.getSum(result);

                    res.render('have/haveViewAll', { 'result':result, 'hash': req.body.Card_ID,
                        'update_successful': true, 'sum': sum, 'newc':req.body.Card_Name });
                }
            });
        }

    });
});

// Delete a particular card
router.get('/delete', function(req, res){
    if(req.query.Card_ID == null) {
        res.send('Card_ID is null');
    }
    else {
         have_dal.delete(req.query.Card_ID, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/have/all');
             }
         });
    }
});

// Delete a particular card from the wishlist
router.get('/deleteW', function(req, res){
    if(req.query.Card_ID == null) {
        res.send('Card_ID is null');
    }
    else {
        have_dal.delete(req.query.Card_ID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/have/wishlistAll');
            }
        });
    }
});


module.exports = router;
