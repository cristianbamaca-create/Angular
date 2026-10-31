
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
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
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
export class Tab1Page implements OnInit {

  private readonly http: HttpClient;

  anuncios: any[] = [];

  constructor(http: HttpClient, private cdr: ChangeDetectorRef) {
    this.http = http;
  }

  ngOnInit() {
    this.consultarAnuncios();
  }

  consultarAnuncios() {

    this.http.get<any[]>(
      "http://localhost:8080/anuncio/buscar"
    ).subscribe(
      res => {
        this.anuncios = res;
        this.cdr.detectChanges();
      },
      error => {
        console.log("Error al consultar anuncios:", error);
      }
    );

  }

}
