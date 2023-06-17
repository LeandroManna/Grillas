import codecs

# Ruta del archivo XML
xml_file = "xml/reportv_23061603552306240350.xml"

# Leer el contenido del archivo usando la codificación iso-8859-1
with codecs.open(xml_file, "r", "iso-8859-1") as file:
    content = file.read()

# Convertir el contenido a UTF-8
content_utf8 = content.encode("utf-8")

# Escribir el contenido convertido en un nuevo archivo
output_file = "xml/grilla.xml"
with open(output_file, "wb") as file:
    file.write(content_utf8)

print("Archivo convertido a UTF-8 con éxito.")
