ALTER TABLE `ihnn`.`question` 
DROP FOREIGN KEY `question_content_pack_link`;
ALTER TABLE `ihnn`.`question` 
ADD CONSTRAINT `question_content_pack_link`
  FOREIGN KEY (`content_pack_id_fk`)
  REFERENCES `ihnn`.`content_pack` (`content_pack_id`)
  ON DELETE CASCADE;