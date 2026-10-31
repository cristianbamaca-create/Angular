import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pelicula',
  standalone: true,
  imports: [
    ReactiveFormsModule, // <-- ¡ESTE ES EL QUE FALTA O NO SE GUARDÓ!
    FormsModule, 
    CommonModule, 
    RouterLink
  ],
  templateUrl: './pelicula.html',
  styleUrl: './pelicula.css'
})
export class Pelicula {

  private readonly http: HttpClient;
  formulario: FormGroup;
  peliculas: any = [];
  generos: any = [];
  clasificaciones: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http = http;
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: [''],
      duracionMinutos: ['', Validators.required],
      idGenero: ['', Validators.required],
      idClasificacion: ['', Validators.required],
      imagenPromocional: ['']
    });

    this.cargarCombos();
    this.buscarPeliculas();
  }

  cargarCombos() {
    this.http.get("http://localhost:8080/genero/buscar").subscribe(
      data => {
        this.generos = data;
        this.cdr.detectChanges();
      }
    );
    this.http.get("http://localhost:8080/clasificacion/buscar").subscribe(
      data => {
        this.clasificaciones = data;
        this.cdr.detectChanges();
      }
    );
  }

  buscarPeliculas() {
    this.http.get("http://localhost:8080/pelicula/buscar").subscribe(
      data => {
        this.peliculas = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      this.http.post("http://localhost:8080/pelicula/guardar", this.formulario.value).subscribe(
        res => {
          alert("Película guardada con éxito");
          this.buscarPeliculas();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}