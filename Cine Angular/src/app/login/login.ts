import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      correo: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  guardar() {
  if (this.formulario.valid) {
    
    this.http.post("http://localhost:8080/usuario/login", this.formulario.value).subscribe(
      (res: any) => {
        if (res != null) {
          // Guardo la sesión
          localStorage.setItem('usuario', JSON.stringify(res));
          
          //validar
          alert("Bienvenido " + res.nombres);
          this.router.navigate(['/bienvenida']);
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      }
    );
  } else {
    alert("Completar campos");
  }
  }
}