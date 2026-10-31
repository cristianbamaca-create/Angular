import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clasificacion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './clasificacion.html',
  styleUrl: './clasificacion.css'
})
export class Clasificacion {

  private readonly htpp: HttpClient;
  formulario: FormGroup;
  clasificaciones: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.htpp = http;
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    this.buscarClasificaciones();
  }

  buscarClasificaciones() {
    this.htpp.get("http://localhost:8080/clasificacion/buscar").subscribe(
      data => {
        this.clasificaciones = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      this.htpp.post("http://localhost:8080/clasificacion/guardar", this.formulario.value).subscribe(
        res => {
          alert("Clasificación guardada con éxito");
          this.buscarClasificaciones();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}