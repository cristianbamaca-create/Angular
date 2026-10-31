import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class Bienvenida {

  private readonly htpp: HttpClient;
  formulario: FormGroup;
  usuarios: any = [];

  constructor(
    http: HttpClient, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.htpp = http;
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      nombres: ['', Validators.required]
    });

    this.buscarUsuarios();
  }

  buscarUsuarios() {
    this.htpp.get("http://localhost:8080/usuario/buscar").subscribe(
      data => {
        this.usuarios = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      let temp = { ...this.formulario.value };
      temp.fechaCreacion = new Date();
      this.htpp.post("http://localhost:8080/usuario/guardar", temp).subscribe(
        user => this.mostrar(user)
      );
    } else {
      alert("Completar campos");
    }
  }

  mostrar(user: any) {
    if (user?.idUsuario) {
      alert("Usuario creado exitosamente con ID: " + user.idUsuario);
      this.buscarUsuarios();
      this.formulario.reset();
    } else {
      alert("Error en el servidor");
    }
  }

}