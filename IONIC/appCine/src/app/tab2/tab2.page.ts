
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    CommonModule
  ]
})
export class Tab2Page implements OnInit {

  private readonly http: HttpClient;

  funciones: any[] = [];
  peliculas: any[] = [];
  salas: any[] = [];

  constructor(http: HttpClient, private cdr: ChangeDetectorRef) {
    this.http = http;
  }

  ngOnInit() {
    this.consultarPeliculas();
    this.consultarSalas();
    this.consultarFunciones();
  }

  consultarFunciones() {

    this.http.get<any[]>(
      "http://localhost:8080/funcion/buscar"
    ).subscribe(
      res => {
        this.funciones = res;
        this.cdr.detectChanges();
      },
      error => {
        console.log("Error al consultar funciones:", error);
      }
    );

  }

  consultarPeliculas() {

    this.http.get<any[]>(
      "http://localhost:8080/pelicula/buscar"
    ).subscribe(
      res => {
        this.peliculas = res;
        this.cdr.detectChanges();
      },
      error => {
        console.log("Error al consultar películas:", error);
      }
    );

  }

  consultarSalas() {

    this.http.get<any[]>(
      "http://localhost:8080/sala/buscar"
    ).subscribe(
      res => {
        this.salas = res;
        this.cdr.detectChanges();
      },
      error => {
        console.log("Error al consultar salas:", error);
      }
    );

  }

  nombrePelicula(id: number) {

    const pelicula = this.peliculas.find(
      p => p.idPelicula == id
    );

    return pelicula ? pelicula.titulo : "Película " + id;

  }

  nombreSala(id: number) {

    const sala = this.salas.find(
      s => s.idSala == id
    );

    return sala ? sala.nombre : "Sala " + id;

  }

  actualizarFunciones() {
    this.consultarPeliculas();
    this.consultarSalas();
    this.consultarFunciones();
  }

}

