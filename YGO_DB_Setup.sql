SET SQL_SAFE_UPDATES = 0;
-- Yu-Gi-Oh Database

-- Individual Card Table
drop table if exists ygo_card;
CREATE TABLE ygo_card (
	Card_ID INT AUTO_INCREMENT PRIMARY KEY,
    Card_Name VARCHAR(50) NOT NULL,
    Card_Set VARCHAR(5) NOT NULL,
    Card_No VARCHAR(7) NOT NULL,
    Card_Rarity VARCHAR(20) NOT NULL,
    Card_Type VARCHAR(7) NOT NULL,
    Card_Type_Full VARCHAR(45) NOT NULL,
    Attack VARCHAR(4),
    Defense VARCHAR(4),
    Card_Description VARCHAR(650) NOT NULL,
    Image VARCHAR(70) DEFAULT 'http://i.tcgplayer.com/0_200w.jpg',
    TCG_Player VARCHAR(175),

    UNIQUE (Card_Set, Card_No),
    
    FOREIGN KEY (Card_Set) REFERENCES ygo_set(Set_ID) ON DELETE CASCADE,
    FOREIGN KEY (Card_Rarity) REFERENCES ygo_rarity(Rarity) ON DELETE CASCADE,
    FOREIGN KEY (Card_Type) REFERENCES ygo_card_type(Type) ON DELETE CASCADE 
);


-- Set Table
drop table if exists ygo_set;
CREATE TABLE ygo_set (
	Set_ID VARCHAR(5) PRIMARY KEY NOT NULL,
    Set_Name VARCHAR(40) NOT NULL
);
            
-- Rarity Table
drop table if exists ygo_rarity;
CREATE TABLE ygo_rarity  (
	Rarity VARCHAR(20) PRIMARY KEY
);
            
-- Card Type
drop table if exists ygo_card_type;
CREATE TABLE ygo_card_type (
	Type VARCHAR(7) PRIMARY KEY
);
            
-- Create Owned Table
drop table if exists ygo_owned;
CREATE TABLE ygo_owned (
	Card_ID INT PRIMARY KEY,
    Amount INT NOT NULL,
    Notes VARCHAR(40),
    FOREIGN KEY (Card_ID) REFERENCES ygo_card(Card_ID) ON DELETE CASCADE
);
            
-- Create Wishlist Table 
drop table if exists ygo_wishlist;
CREATE TABLE ygo_wishlist (
	Card_ID INT PRIMARY KEY,
    FOREIGN KEY (Card_ID) REFERENCES ygo_card(Card_ID) ON DELETE CASCADE 
);
            

-- Necessary information to display the add card page
DROP PROCEDURE IF EXISTS ygo_getAdd;
DELIMITER //
create procedure ygo_getAdd( ) 
begin
	select * from ygo_set;
    
    select * from ygo_rarity;
    
    select * from ygo_card_type;
end; //
DELIMITER ;

-- Necessary information to display the update card page
DROP PROCEDURE IF EXISTS ygo_getUpdate;
DELIMITER //
create procedure ygo_getUpdate(_Card_ID INT ) 
begin
	select * from ygo_set;
    
    select * from ygo_rarity;
    
    select * from ygo_card_type;
    
    SELECT c.*, Set_Name, Notes, Amount FROM ygo_card c
	LEFT JOIN ygo_set s ON c.Card_Set = s.Set_ID
	LEFT JOIN ygo_owned o ON c.Card_ID = o.Card_ID
	WHERE c.Card_ID = _Card_ID;
    

end; //
DELIMITER ;

-- Find totals number of cards owned in set
DROP FUNCTION IF EXISTS fn_total_set_cards;
DELIMITER //
CREATE FUNCTION fn_total_set_cards(_Set_ID VARCHAR(5)) RETURNS INT
BEGIN
DECLARE _total INT;
SELECT count(*) INTO _total FROM ygo_card c JOIN ygo_owned o ON c.Card_ID = o.Card_ID WHERE Card_Set = _Set_ID;
  RETURN _total;
END//
DELIMITER ;

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Needed Table fields
insert into ygo_card_type values ('Monster'), ('Spell'), ('Trap'), ('Token');
insert into ygo_rarity values ('Common'), ('Ultra Rare'), ('Super Rare'), ('Secret Rare'), ('Ultimate Rare'), ('Ghost/Gold Rare'), ('Rare'), ('Gold Rare'), ('Parallel Rare');
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




/* Sample Insert Commands
insert into ygo_set values ('SD2', 'Structure Deck: Zombie Madness');
select * from ygo_set;

            
            
insert into ygo_card (Card_Name, Card_Set, Card_No, Card_Rarity, Card_Type, Card_Type_Full, Attack, Defense, Card_Description, Image, TCG_Player) values (
				'Torrential Tribute',
                'SD2',
                'EN025',
                'Common',
                'Trap',
                'TRAP /Normal Trap',
                0,
                0,
                'You can only activate this card when a monster is Normal Summoned, Flip Summoned or Special Summoned. Destroy all monsters on the field.',
                'http://i.tcgplayer.com/25308_200w.jpg',
                'http://shop.tcgplayer.com/yugioh/structure-deck-zombie-madness/torrential-tribute'
                );
select * from ygo_card;
insert into ygo_owned (Card_ID, Amount) values (1, 1);
select * from ygo_owned;
 */

