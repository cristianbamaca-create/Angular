import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sala',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './sala.html',
  styleUrl: './sala.css'
})
export class Sala {

  private readonly htpp: HttpClient;
  formulario: FormGroup;
  salas: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.htpp = http;
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: ['', Validators.required]
    });

    this.buscarSalas();
  }

  buscarSalas() {
    this.htpp.get("http://localhost:8080/sala/buscar").subscribe(
      data => {
        this.salas = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      this.htpp.post("http://localhost:8080/sala/guardar", this.formulario.value).subscribe(
        res => {
          alert("Sala guardada con éxito");
          this.buscarSalas();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}
