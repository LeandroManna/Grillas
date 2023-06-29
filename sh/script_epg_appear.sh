#!/bin/bash

IP_EPG=192.168.57.56
PORT_EPG=13013
PXML="C:/xampp/htdocs/xml/"
PLOG="C:/xampp/htdocs/sh/script_epg_appear.logs"

echo '0) Borrando archivo xml actual...' > $PLOG
rm -f $PXML/*.xml
STATUS=$?
if [ $STATUS != 0 ]; then
    echo "  - Error al borrar archivo xml local en $PXML" >> $PLOG
else
    echo "  - Archivo xml borrado en $PXML" >> $PLOG
fi
cd $PXML

######################################
# Descargar XML de ftp
######################################
HOST='ftp.filestv.com.ar'
USER='UnicableAppearTv'
PASSWD='Un1c4bl3'

echo '1) Conexion a FTP...' >> $PLOG
cd $PXML
ftp -n $HOST << END_SCRIPT
quote USER $USER
quote PASS $PASSWD
binary
prompt
mget -i
quit
END_SCRIPT

######################################
# Matar/Relanzar netcat
######################################

echo '2) Ejecutando Netcat...' >> $PLOG
killall nc &>> $PLOG
cd $PXML
AXML=$(ls *$(date +"%y%m%d")*)
new_name="reportv_$(date +"%y%m%d").xml"
mv $AXML $new_name

# Cambiar la codificación del archivo a UTF-8
iconv -f ISO-8859-1 -t UTF-8 $new_name > temp.xml
mv temp.xml $new_name

nohup nc -v $IP_EPG $PORT_EPG < $PXML/$new_name & >> $PLOG
