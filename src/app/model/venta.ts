import { Cliente } from "./cliente";

export class DetalleVenta {
    idDetalleVenta: number = 0;
    cantidad: number = 0;
    precioUnitario: number = 0;
    subTotal: number = 0;
}

export class Venta {
    idVenta: number = 0;
    cliente: Cliente = new Cliente();
    fecha: string = '';
    total: number = 0;
    estado: string = '';
    observacion: string = '';
    detalles: DetalleVenta[] = [];
}