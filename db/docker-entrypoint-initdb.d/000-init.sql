CREATE USER akvo WITH CREATEDB PASSWORD 'password';

CREATE DATABASE water_footprint
WITH OWNER = akvo
     TEMPLATE = template0
     ENCODING = 'UTF8'
     LC_COLLATE = 'en_US.UTF-8'
     LC_CTYPE = 'en_US.UTF-8';
