export class DetalleVenta {
    idDetalleVenta?: number;
    idVenta?: number;
    idProducto: number = 0;
    cantidad: number = 1;
    precioUnitario: number = 0;
    subtotal: number = 0;
    
    // Auxiliar para UI
    nombreProducto?: string;
}

export class Venta {
    idVenta?: number;
    idCliente: number = 0;
    nombreCliente?: string;
    fecha: string = '';
    total: number = 0;
    estado: string = 'PAGADO'; // PAGADO o ANULADO
    observacion: string = '';
    detalles: DetalleVenta[] = [];
}