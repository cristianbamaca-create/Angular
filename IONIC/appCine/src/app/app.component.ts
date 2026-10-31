
import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonCard,
  IonCardContent, IonCardHeader,
  IonCardSubtitle, IonCardTitle,
  IonInput, IonItem, IonList,
  IonButton, IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { accessibilityOutline, personAddOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonCard,
    IonCardContent, IonCardHeader,
    IonCardSubtitle, IonCardTitle,
    IonInput, IonItem, IonList,
    IonButton, IonIcon, FormsModule, CommonModule
  ],
})
export class AppComponent {

  private readonly htpp: HttpClient;

  usuario: any = null;
  usuarioLogin: any = {};

  mostrarRegistro: boolean = false;
  nuevoUsuario: any = {};

  constructor(http: HttpClient, private cdr: ChangeDetectorRef) {
    addIcons({ accessibilityOutline, personAddOutline });
    this.htpp = http;
  }

  login() {

    if (this.usuarioLogin.correo && this.usuarioLogin.contrasena) {

      this.htpp.post(
        "http://localhost:8080/usuario/login",
        this.usuarioLogin
      ).subscribe(
        (res: any) => {
          this.validar(res);
        },
        error => {
          console.log("Error:", error);
          alert("Error al conectar con el servidor");
        }
      );

    } else {
      alert("Ingrese correo y contraseña");
    }

  }

  validar(usuario: any) {

    if (usuario?.idUsuario) {

      this.usuario = usuario;
      this.cdr.detectChanges();

      console.log("Usuario encontrado:", usuario);
      alert("Bienvenido " + usuario.nombres);

    } else {
      alert("Usuario o contraseña incorrectos");
    }

  }

  abrirRegistro() {
    this.mostrarRegistro = true;
  }

  cancelarRegistro() {
    this.mostrarRegistro = false;
    this.nuevoUsuario = {};
  }

  crearCuenta() {

    if (this.nuevoUsuario.nombres &&
        this.nuevoUsuario.apellidos &&
        this.nuevoUsuario.correo &&
        this.nuevoUsuario.telefono &&
        this.nuevoUsuario.contrasena) {

      const datos = {
        nombres: this.nuevoUsuario.nombres,
        apellidos: this.nuevoUsuario.apellidos,
        correo: this.nuevoUsuario.correo,
        telefono: this.nuevoUsuario.telefono,
        contrasena: this.nuevoUsuario.contrasena,
        nombreUsuario: this.nuevoUsuario.correo,
        idRol: 4,
        fotografia: ""
      };

      this.htpp.post(
        "http://localhost:8080/usuario/guardar",
        datos
      ).subscribe(
        (res: any) => {

          console.log("Usuario guardado:", res);

          alert("Cuenta creada correctamente");

          this.nuevoUsuario = {};
          this.mostrarRegistro = false;

          this.cdr.detectChanges();

        },
        error => {
          console.log("Error al guardar:", error);
          alert("No se pudo crear la cuenta");
        }
      );

    } else {
      alert("Complete todos los campos");
    }

  }

}
