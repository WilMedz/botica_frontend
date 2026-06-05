export class MovimientoInventario {
    idMovimiento: number = 0;
    idProducto: number = 0;
    tipo: string = 'ENTRADA'; // ENTRADA | SALIDA | AJUSTE
    cantidad: number = 0;
    stockAnterior?: number;
    stockNuevo?: number;
    motivo: string = '';
    fecha: string = '';
}
