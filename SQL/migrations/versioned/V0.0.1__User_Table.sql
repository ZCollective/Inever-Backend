-- Adding Role Table
CREATE TABLE `ihnn`.`role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(100) NOT NULL,
  `role_description` VARCHAR(255) NOT NULL DEFAULT 'No Description Available',
  PRIMARY KEY (`role_id`),
  UNIQUE INDEX `role_id_UNIQUE` (`role_id` ASC) VISIBLE,
  UNIQUE INDEX `role_name_UNIQUE` (`role_name` ASC) VISIBLE);

-- Adding Admin Role
INSERT INTO `ihnn`.`role` (`role_name`, `role_description`) VALUES ('Administrator', 'This user can administer the system. He has all available permissions.');

-- Adding User Table
CREATE TABLE `ihnn`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_email` VARCHAR(255) NOT NULL,
  `user_password` VARCHAR(60) NOT NULL,
  `user_username` VARCHAR(255) NOT NULL,
  `user_role_id_fk` INT NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_username_UNIQUE` (`user_username` ASC) VISIBLE,
  INDEX `user_role_id_link_idx` (`user_role_id_fk` ASC) VISIBLE,
  CONSTRAINT `user_role_id_link`
    FOREIGN KEY (`user_role_id_fk`)
    REFERENCES `ihnn`.`role` (`role_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

-- Adding default Admin user
INSERT INTO ihnn.user (user_email, user_password, user_username, user_role_id_fk) VALUES ('admin@test.com', '$2a$10$wCZ9LXyAJL1iOZQXY9OyBurc5xyavjGneu4Eep5wKXmyXhtpNwGYC', 'admin', 1)