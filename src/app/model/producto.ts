import { Categoria } from "./categoria";
import { Proveedor } from "./proveedor";

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

    // Relaciones
    categoria: Categoria = new Categoria();
    proveedor: Proveedor = new Proveedor();

    // backend en GET
    nombreCategoria?: string;
    razonSocialProveedor?: string;
}