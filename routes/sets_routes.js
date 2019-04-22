var express = require('express');
var router = express.Router();
var sets_dal = require('../model/sets_dal');

router.get('/home', function(req, res) {

    res.render('have/haveHome', { 'result':res });


});

router.get('/search', function(req, res) {
    sets_dal.search(req.query.set_search, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('sets/setsSearch', { 'result':result, 'search':req.query });
        }
    });

});

// View All have
router.get('/all', function(req, res) {
    sets_dal.getAll(function(err, result){
        if(err) {
            //res.send(err);
            res.render('sets/setsViewAll', { 'err': err, 'result':result });
        }
        else {
            res.render('sets/setsViewAll', { 'result':result });
        }
    });

});

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.Set_ID == null) {
        res.send('Set_ID is null');
    }
    else {
        sets_dal.getById(req.query.Set_ID, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {

               var sum = sets_dal.getSum(result);

               res.render('sets/setsViewById', {'result': result, 'sum': sum, 'Set_ID': req.query.Set_ID});
           }
        });
    }
});


// Return the add a new company form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually

    res.render('sets/setsAdd', {'result': res });

});


// View the company for the given id
router.post('/insert', function(req, res) {
    // simple validation
    if (req.body.Set_ID == "") {
        res.send('Set_ID must be provided.');
    }
    else if (req.body.Set_Name == "") {
        res.send('Set_Name must be provided.');
    }
    else {
        // passing all the query parameters (req.body) to the insert function instead of each individually
        sets_dal.insert(req.body, function(err,result) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                //res.redirect(302, '/sets/all');

                sets_dal.getAll(function(err, resh){
                    if(err) {
                        res.send(err);
                    }
                    else {
                        //res.redirect(302, '/sets/all');
                        res.render('sets/setsViewAll', { 'result':resh, 'was_successful': true, 'news': req.body.Set_Name });
                    }
                });

            }
        });
    }
});

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
                    res.render('have/haveViewAll', { 'result':result, 'hash': req.query.Card_ID });
                }
            });

        });
    }
});

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
                    res.render('have/haveViewAll', { 'result':result, 'hash': req.query.Card_ID });
                }
            });

        });
    }
});

router.get('/avgscore', function( req, res ) {

    movie_dal.getAvgScore( req.query.rating, function( err, result ) {
        res.render('have/haveAvgScore', { 'result':result });
    });

});

router.get('/top10', function( req, res ) {

    movie_dal.getTop10( function( err, result ) {
        res.render('have/haveAvgScore', { 'result':result });
    });

});

router.get('/edit', function(req, res){
    if(req.query.Set_ID == null) {
        res.send('A Set id is required');
    }
    else {
        sets_dal.edit(req.query.Set_ID, function(err, result){
            res.render('sets/setsUpdate', { 'result': result[0] });
        });
    }

});

router.post('/update', function(req, res) {
    sets_dal.update(req.body, function(err, result){

        sets_dal.getAll(function(err, resh){
            if(err) {
                res.send(err);
            }
            else {
                //res.redirect(302, '/sets/all');
                res.render('sets/setsViewAll', { 'result':resh, 'update_successful': true, 'news': req.body.Set_Name });
            }
        });
    });
});

// Delete a company for the given company_id
router.get('/delete', function(req, res){
    if(req.query.Set_ID == null) {
        res.send('Set_ID is null');
    }
    else {
         sets_dal.delete(req.query.Set_ID, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/sets/all');
             }
         });
    }
});


module.exports = router;
