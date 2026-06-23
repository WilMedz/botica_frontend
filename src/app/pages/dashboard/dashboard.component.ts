import { Component, inject, OnInit, signal, ElementRef, ViewChild, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { ClienteService } from '../../services/cliente.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Chart, registerables } from 'chart.js';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { Venta } from '../../model/venta';
import { RouterLink } from "@angular/router";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private proveedorService = inject(ProveedorService);
  private productoService = inject(ProductoService);
  private clienteService = inject(ClienteService);
  private ventaService = inject(VentaService);

  @ViewChild('ventasChart') ventasChart!: ElementRef;
  @ViewChild('ingresosChart') ingresosChart!: ElementRef;

  totalCategorias = signal<number>(0);
  totalProveedores = signal<number>(0);
  totalProductos = signal<number>(0);
  totalClientes = signal<number>(0);
  totalVentas = signal<number>(0);
  ventasRecientes = signal<Venta[]>([]);
  fechaHoy: string = '';

  private todasLasVentas: Venta[] = []
  rangoVentas = signal<number>(7);
  rangoIngresos = signal<number>(7);
  private chartVentas: Chart | null = null;
  private chartIngresos: Chart | null = null;

  ngOnInit(): void {
    this.categoriaService.findAll().subscribe(data => this.totalCategorias.set(data.length));
    this.proveedorService.findAll().subscribe(data => this.totalProveedores.set(data.length));
    this.productoService.findAll().subscribe(data => this.totalProductos.set(data.length));
    this.clienteService.findAll().subscribe(data => this.totalClientes.set(data.length));
    this.ventaService.findAll().subscribe(data => {
      this.totalVentas.set(data.length);
      this.todasLasVentas = data;

      const ordenadas = [...data].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      this.ventasRecientes.set(ordenadas.slice(0, 5));

      this.actualizarGraficoVentas(this.rangoVentas());
      this.actualizarGraficoIngresos(this.rangoIngresos());
    });

    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  actualizarGraficoVentas(dias: number): void {
    this.rangoVentas.set(dias);
    const { labels, conteoVentas } = this.calcularDatosGrafico(this.todasLasVentas, dias);

    if (this.chartVentas) {
      this.chartVentas.destroy();
    }

    this.chartVentas = new Chart(this.ventasChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas',
          data: conteoVentas,
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          borderColor: 'rgba(124, 58, 237, 0.8)',
          borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  actualizarGraficoIngresos(dias: number): void {
    this.rangoIngresos.set(dias);
    const { labels, sumaIngresos } = this.calcularDatosGrafico(this.todasLasVentas, dias);

    if (this.chartIngresos) {
      this.chartIngresos.destroy();
    }

    this.chartIngresos = new Chart(this.ingresosChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ingresos S/.',
          data: sumaIngresos,
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderColor: 'rgba(5, 150, 105, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(5, 150, 105, 0.8)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
          x: {grid: { display: false } }
        }
      }
    });
  }

  calcularDatosGrafico(ventas: Venta[], dias: number) {
    const labels = this.obtenerUltimosDias(dias);
    const conteoVentas: number[] = new Array(dias).fill(0);
    const sumaIngresos: number[] = new Array(dias).fill(0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const venta of ventas) {
      const fechaVenta = new Date(venta.fecha);
      fechaVenta.setHours(0, 0, 0, 0);

      const diffDias = Math.round((hoy.getTime() - fechaVenta.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDias >= 0 && diffDias < dias) {
        const index = dias - 1 - diffDias;
        conteoVentas[index]++;
        sumaIngresos[index] += venta.total;
      }
    }

    return { labels, conteoVentas, sumaIngresos };
  }

  obtenerUltimosDias(n: number): string[] {
    const dias = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dias.push(d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }));
    }
    return dias;
  }
}