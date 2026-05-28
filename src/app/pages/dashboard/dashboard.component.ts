import { Component, inject, OnInit, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private categoriaService = inject(CategoriaService);
  private proveedorService = inject(ProveedorService);

  @ViewChild('ventasChart') ventasChart!: ElementRef;
  @ViewChild('ingresosChart') ingresosChart!: ElementRef;

  totalCategorias = signal<number>(0);
  totalProveedores = signal<number>(0);
  fechaHoy: string = '';

  ngOnInit(): void {      //trabajar con señales (signals de angular)
    this.categoriaService.findAll().subscribe(data => this.totalCategorias.set(data.length));
    this.proveedorService.findAll().subscribe(data => this.totalProveedores.set(data.length));

    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  ngAfterViewInit(): void {
    const labels = this.obtenerUltimosDias(7);
    const ventas = [5, 3, 8, 4, 7, 6, 9];
    const ingresos = [320, 150, 480, 210, 390, 275, 430];

    new Chart(this.ventasChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas',
          data: ventas,
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

    new Chart(this.ingresosChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ingresos S/.',
          data: ingresos,
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
          x: { grid: { display: false } }
        }
      }
    });
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