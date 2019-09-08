ALTER TABLE `ihnn`.`proposals` 
ADD COLUMN `proposal_entry_date` DATETIME NOT NULL DEFAULT NOW() AFTER `proposal_sender_name`;
