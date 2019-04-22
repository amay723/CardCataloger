var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

exports = module.exports = app;

/* Not needed after TCG website structure update
//declare the function so it can be used locally
var stringParser = function(string) {

    string = string.substring(3);

    var i = 0;
    while( string[i] == ' ' ) {
        i++;
    }

    var j = string.length-1;
    while( string[j] == ' ' ) {
        j--;
    }

    var newS = "";
    while( i < j ) {
        newS += string[i++];
    }

    return newS;
};
//export the same function so it can be used by external callers
module.exports.stringParser = stringParser;
*/

exports.marketPrice = function(params, callback) {

    var url = params.TCG_Player;


    request.post(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var Card_ID;
            var price;

            var json = { Card_ID: params.Card_ID, price: "" };

            // Price data
            $('.price-point--market').filter(function () { // price-point__data'

                var data = $(this);

                json.price = data.find('td').text(); //eq(0).text();

            });

        }

        callback(error, json);
        //return price;

    });




};

exports.urlAdd = function(params, callback) {

    // All the web scraping magic will happen here
    // This often changes as the TCG Player site updates

    var url = params.url;

    request.post(url, function(error, response, html) {
        if(!error) {
            var $ = cheerio.load(html);

            var Card_Name, Card_Set, Card_No, Card_Rarity, Card_Type, Card_Type_Full, Attack, Defense,
                Card_Description, Image, TCG_Player, Set_Name;

            var json = {
                Card_Name: "", Card_Set: "", Card_No: "", Card_Rarity: "", Card_Type: "",
                Card_Type_Full: "", Attack: "", Defense: "", Card_Description: "", Image: "", TCG_Player: url,
                Set_Name: ""};

            // Get Image URL
            $('.product-details__image').filter(function () { // old image class: detailImage

                var data = $(this);

                Image = data.find('img').attr('src');

                json.Image = Image;

            });

            // Get Card Details
            $('.product-details__content').filter(function(){ // old cardDetails; new class product-description??? maybe no

                var data = $(this);

                // Card Name
                Card_Name = data.find('h1').text();
                // Card Set and Number
                Card_Set = data.find('dl').children().eq(1).text(); //find('tbody').children().eq(1).children().last().text();
                // Card Rarity
                Card_Rarity = data.find('dl').children().eq(3).text(); //find('tbody').children().eq(2).children().last().text();
                // Card Type and Card Type Full
                Card_Type_Full = data.find('dl').children().eq(5).text(); //find('tbody').children().eq(3).children().last().text();
                // Attack / Defense
                Attack = data.find('dl').children().eq(7).text(); //find('tbody').children().eq(4).children().last().text();
                // Card Description
                Card_Description = data.find('dl').children().last().text(); //find('tbody').children().last().children().last().text();
                // Set Name
                Set_Name = data.find('a').first().text();


                json.Card_Name = Card_Name;
                json.Set_Name = Set_Name;



                var i = 0;
                var j = Card_Set.length;
                var set = "";
                var no = "";
                while( Card_Set[i] != '-' ) {
                    set += Card_Set[i++];
                }
                i++;

                while( i < j ) {
                    no += Card_Set[i++];
                }
                json.Card_Set = set;
                json.Card_No = no;



                json.Card_Rarity = Card_Rarity;



                type_full = Card_Type_Full;
                json.Card_Type_Full = type_full;


                var type = "";
                for( var k = 0; type_full[k] != ' '; k++ ) {
                    type += type_full[k];
                }

                if( type == "SPELL" ) {
                    type = "Spell";
                }
                else if( type == "TRAP" ) {
                    type = "Trap";
                }
                else if( type == "/Token" ) {
                    type = "Token";
                }
                else {
                    type = "Monster";
                }

                /*
                // Separating out the single Type
                i, j = type_full.length;
                i--;
                while( type_full[i] != ' ' ) {
                    i--;
                }
                i++;
                var type = type_full[i];
                if( type == "C" ) {
                    type = "";

                    i -= 2;

                    while( type_full[i] != ' ' && type_full[i] != '/' ) {
                        i--;
                    }
                    if( type_full[i+1] == 'T' ) {
                        type = "Trap";
                    }
                    else if( type_full[i+1] == 'S' ) {
                        type = "Spell";
                    }
                    else {
                        res.send('Card Type Parse Error');
                    }
                }
                else {
                    type = "Monster";
                    //type = type.substring(0, 1).toUpperCase() + type.substring(1).toLowerCase();
                }
                */

                json.Card_Type = type;


                i = 0;
                j = Attack.length;
                var atk = "";
                while( Attack[i] != ' ' ) {
                    atk += Attack[i++];
                }
                i += 3;
                var def = "";
                while( i < j ) {
                    def += Attack[i++];
                }
                json.Attack = atk;
                json.Defense = def;


                json.Card_Description = Card_Description;

            });

        }

        callback( error, json );

    });

};