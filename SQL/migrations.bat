@echo off

echo "Running Flyway for IHNN Mysql Database"

IF [%1] == [] GOTO NOARGUMENT;


flyway "-url=jdbc:mysql://127.0.0.1:3306?allowPublicKeyRetrieval=true&useSSL=false" "-user=root" "-password=IHNNADMIN" "-schemas=ihnn" "-locations=filesystem:./migrations" %1
GOTO EXIT;

:NOARGUMENT
echo "You need to specify an action. [migrate|clean|info|validate|undo|baseline|repair]"

:EXIT
