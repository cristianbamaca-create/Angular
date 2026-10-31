import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface ExamenModel {
  idExamen?: number;
  fechaExamen?: string;
  nota: string;
  carnet: string;
}

@Component({
  selector: 'app-examen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './examen.html',
  styleUrls: ['./examen.css']
})
export class Examen implements OnInit {

  private baseUrl = 'http://localhost:8080/examen';

  examenes: ExamenModel[] = [];

  nuevoExamen: ExamenModel = {
    fechaExamen: '',
    nota: '',
    carnet: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerExamen();
  }

  obtenerExamen(): void {
    this.http.get<ExamenModel[]>(`${this.baseUrl}/buscar`).subscribe({
      next: (res) => {
        this.examenes = res;
      },
      error: (err) => {
        console.error('Error al obtener exámenes:', err);
      }
    });
  }

  // Renombrado a guardarExamen() para hacer match con el HTML
  guardarExamen(): void {
    if (!this.nuevoExamen.fechaExamen || !this.nuevoExamen.nota) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    this.http.post<ExamenModel>(`${this.baseUrl}/guardar`, this.nuevoExamen).subscribe({
      next: (res) => {
        alert(`Examen creado exitosamente con ID: ${res.idExamen}`);
        this.nuevoExamen = {
          fechaExamen: '',
          nota: '',
          carnet: ''
        };
        this.obtenerExamen();
      },
      error: (err) => {
        console.error('Error al guardar examen:', err);
        alert('Error al guardar el examen');
      }
    });
  }
}