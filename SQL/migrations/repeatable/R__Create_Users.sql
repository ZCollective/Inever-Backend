CREATE USER IF NOT EXISTS 'server'@'%' IDENTIFIED BY 'IHNNSERVER';
GRANT ALL ON ihnn.* TO 'server'@'%';
FLUSH PRIVILEGES;