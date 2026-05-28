export class Producto {
    idProducto: number = 0;
    nombre: string = '';
    codigoBarra: string = '';
    descripcion: string = '';
    precioCompra: number = 0;
    precioVenta: number = 0;
    stock: number = 0;
    stockMinimo: number = 20;
    estado: boolean = true;
    fechaVencimiento: string = '';
    idCategoria: number = 0;
    idProveedor: number = 0;
}