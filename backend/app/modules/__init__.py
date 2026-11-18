# Importar los modelos acá hace que SQLModel conozca TODAS las tablas y que las
# relaciones escritas como texto ("Pedido", "Producto"...) se puedan resolver,
# sin importar qué módulo se importe primero.
from app.modules.categorias import models as _categorias
from app.modules.pedidos import models as _pedidos 
from app.modules.productos import models as _productos
from app.modules.usuarios import models as _usuarios