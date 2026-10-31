import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-asiento',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './asiento.html',
  styleUrl: './asiento.css'
})
export class Asiento {

  private readonly http: HttpClient;
  formulario: FormGroup;
  asientos: any = [];
  salas: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http = http;
    this.formulario = this.fb.group({
      idSala: ['', Validators.required],
      fila: ['', Validators.required],
      numero: ['', Validators.required]
    });

    this.buscarSalas();
    this.buscarAsientos();
  }

  buscarSalas() {
    this.http.get("http://localhost:8080/sala/buscar").subscribe(
      data => {
        this.salas = data;
        this.cdr.detectChanges();
      }
    );
  }

  buscarAsientos() {
    this.http.get("http://localhost:8080/asiento/buscar").subscribe(
      data => {
        this.asientos = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      this.http.post("http://localhost:8080/asiento/guardar", this.formulario.value).subscribe(
        res => {
          alert("Asiento guardado con éxito");
          this.buscarAsientos();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}