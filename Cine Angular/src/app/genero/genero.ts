import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-genero',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './genero.html',
  styleUrl: './genero.css'
})
export class Genero {

  private readonly http: HttpClient;
  formulario: FormGroup;
  generos: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http = http;
    this.formulario = this.fb.group({
      nombre: ['', Validators.required]
    });

    this.buscarGeneros();
  }

  buscarGeneros() {
    this.http.get("http://localhost:8080/genero/buscar").subscribe(
      data => {
        this.generos = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      this.http.post("http://localhost:8080/genero/guardar", this.formulario.value).subscribe(
        res => {
          alert("Género guardado con éxito");
          this.buscarGeneros();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}