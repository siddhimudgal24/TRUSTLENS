@echo off
cd /d "%~dp0backend"
set CP=C:\Users\shory\.m2\repository\javax\servlet\javax.servlet-api\4.0.1\javax.servlet-api-4.0.1.jar;C:\Users\shory\.m2\repository\javax\servlet\jsp\javax.servlet.jsp-api\2.3.3\javax.servlet.jsp-api-2.3.3.jar;C:\Users\shory\.m2\repository\com\mysql\mysql-connector-j\8.3.0\mysql-connector-j-8.3.0.jar;C:\Users\shory\.m2\repository\com\google\code\gson\gson\2.10.1\gson-2.10.1.jar;C:\Users\shory\.m2\repository\org\mindrot\jbcrypt\0.4\jbcrypt-0.4.jar;C:\Users\shory\.m2\repository\com\sun\mail\javax.mail\1.6.2\javax.mail-1.6.2.jar;C:\Users\shory\.m2\repository\javax\activation\activation\1.1\activation-1.1.jar

echo Compiling latest Java backend code...
powershell -Command "$cp = '%CP%'; $files = (Get-ChildItem -Path 'src/main/java' -Recurse -Filter '*.java').FullName; javac -d bin -cp $cp $files"

echo Starting TrustLens Java Backend Server...
java -cp "bin;%CP%" com.trustlens.ServerRunner
