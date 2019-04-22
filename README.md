To run this project:

`git clone https://github.com/amay723/CardCataloger.git`

`cd CardCataloger`

`npm install`

`node bin/www`

Then open a web browser to: `localhost:3000`


Most of the funcitonalities of this site require a database with the appropriate card tables. Before running this project: 
1. import the YGO_DB_Setup.sql file into a SQL database
2. Edit the database config file `db_connection-blank.js` with your appropriate information and rename the file to `db_connection.js`

Card Cataloger provides a simple and efficient way to document and view all cards in your collection, currently only supporting YuGiOh cards. You can search for cards by name or in a particular set. Wishlists allow you to mark cards you want to buy, and each card contains a link to the TCG Player website (not endorsed) for when you finally decide to buy!

Feeling a bit too lazy to copy and paste all those card details into a web form? You can simply copy and paste the TCG Player url for the specific card you want and let us do the rest of the work for you. Note: This can be unreliable as TCG Player site updates can break this feature. 
