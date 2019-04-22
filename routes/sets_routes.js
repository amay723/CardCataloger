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

// View the set for the given id
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


// Return the add a new set form
router.get('/add', function(req, res){

    res.render('sets/setsAdd', {'result': res });

});

router.post('/insert', function(req, res) {
    // simple validation
    if (req.body.Set_ID == "") {
        res.send('Set_ID must be provided.');
    }
    else if (req.body.Set_Name == "") {
        res.send('Set_Name must be provided.');
    }
    else {
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
