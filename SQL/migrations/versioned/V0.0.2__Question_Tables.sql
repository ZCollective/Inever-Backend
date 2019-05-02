-- Adding Content Pack Tables
CREATE TABLE `ihnn`.`content_pack` (
  `content_pack_id` INT NOT NULL AUTO_INCREMENT,
  `content_pack_name` VARCHAR(200) NOT NULL,
  `content_pack_description` VARCHAR(500) NOT NULL DEFAULT 'No Description Available',
  `content_pack_keywords` VARCHAR(100) NOT NULL DEFAULT 'NA',
  `content_pack_min_age` INT NOT NULL DEFAULT 18,
  `content_pack_version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`content_pack_id`),
  UNIQUE INDEX `content_pack_id_UNIQUE` (`content_pack_id` ASC) VISIBLE,
  UNIQUE INDEX `content_pack_name_UNIQUE` (`content_pack_name` ASC) VISIBLE);

-- Adding Question Pack Tables

CREATE TABLE `ihnn`.`question` (
  `question_id` INT NOT NULL AUTO_INCREMENT,
  `question_string` TEXT NOT NULL,
  `content_pack_id_fk` INT NOT NULL,
  PRIMARY KEY (`question_id`),
  UNIQUE INDEX `question_id_UNIQUE` (`question_id` ASC) VISIBLE,
  INDEX `question_content_pack_link_idx` (`content_pack_id_fk` ASC) VISIBLE,
  CONSTRAINT `question_content_pack_link`
    FOREIGN KEY (`content_pack_id_fk`)
    REFERENCES `ihnn`.`content_pack` (`content_pack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);