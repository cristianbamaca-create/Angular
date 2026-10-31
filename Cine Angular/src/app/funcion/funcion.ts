import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './funcion.html',
  styleUrl: './funcion.css'
})
export class Funcion {

  private readonly http: HttpClient;
  formulario: FormGroup;
  funciones: any = [];
  peliculas: any = [];
  salas: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http = http;
    this.formulario = this.fb.group({
      idPelicula: ['', Validators.required],
      idSala: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      precioEntrada: ['', Validators.required]
    });

    this.cargarCombos();
    this.buscarFunciones();
  }

  cargarCombos() {
    this.http.get("http://localhost:8080/pelicula/buscar").subscribe(
      data => {
        this.peliculas = data;
        this.cdr.detectChanges();
      }
    );
    this.http.get("http://localhost:8080/sala/buscar").subscribe(
      data => {
        this.salas = data;
        this.cdr.detectChanges();
      }
    );
  }

  buscarFunciones() {
    this.http.get("http://localhost:8080/funcion/buscar").subscribe(
      data => {
        this.funciones = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      // Formateamos la hora como un ISO Date para que Java Date lo reconozca
      const fechaSeleccionada = this.formulario.value.fecha;
      const horaSeleccionada = this.formulario.value.hora;

      const datosEnviar = {
        idPelicula: this.formulario.value.idPelicula,
        idSala: this.formulario.value.idSala,
        fecha: new Date(fechaSeleccionada),
        hora: new Date(`${fechaSeleccionada}T${horaSeleccionada}:00`),
        precioEntrada: this.formulario.value.precioEntrada
      };

      this.http.post("http://localhost:8080/funcion/guardar", datosEnviar).subscribe(
        res => {
          alert("Función guardada con éxito");
          this.buscarFunciones();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}