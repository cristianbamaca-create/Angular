
import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonList,
  IonLabel
} from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
    CommonModule,
    FormsModule
  ]
})
export class Tab3Page {

  private readonly http: HttpClient;

  clientes: any[] = [];
  peliculas: any[] = [];
  funciones: any[] = [];
  asientos: any[] = [];
  reservas: any[] = [];
  detalles: any[] = [];

  asientosSeleccionados: number[] = [];
  guardando = false;
  cargando = true;

  nuevaReserva: any = {
    idCliente: null,
    idPelicula: null,
    idFuncion: null,
    cantidadEntradas: 1
  };

  constructor(
    http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.http = http;
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {

    this.cargando = true;

    forkJoin({
      clientes: this.http.get<any[]>(
        "http://localhost:8080/cliente/buscar"
      ),
      peliculas: this.http.get<any[]>(
        "http://localhost:8080/pelicula/buscar"
      ),
      funciones: this.http.get<any[]>(
        "http://localhost:8080/funcion/buscar"
      ),
      asientos: this.http.get<any[]>(
        "http://localhost:8080/asiento/buscar"
      ),
      reservas: this.http.get<any[]>(
        "http://localhost:8080/reserva/buscar"
      ),
      detalles: this.http.get<any[]>(
        "http://localhost:8080/detalle-reserva-asientos/buscar"
      )
    }).subscribe({

      next: datos => {

        this.clientes = datos.clientes;
        this.peliculas = datos.peliculas;
        this.funciones = datos.funciones;
        this.asientos = datos.asientos;
        this.reservas = datos.reservas;
        this.detalles = datos.detalles;

        this.cargando = false;
        this.cdr.detectChanges();

      },

      error: error => {

        console.log("Error:", error);
        this.cargando = true;

        alert(
          "No se pudieron cargar los datos: " +
          error.url
        );

      }

    });

  }

  seleccionarPelicula() {
    this.nuevaReserva.idFuncion = null;
    this.asientosSeleccionados = [];
  }

  funcionesPelicula() {

    if (this.nuevaReserva.idPelicula) {

      return this.funciones.filter(
        f => Number(f.idPelicula) ===
             Number(this.nuevaReserva.idPelicula)
      );

    }

    return this.funciones;

  }

  funcionSeleccionada() {

    return this.funciones.find(
      f => Number(f.idFuncion) ===
           Number(this.nuevaReserva.idFuncion)
    );

  }

  seleccionarFuncion() {

    this.asientosSeleccionados = [];

    const funcion = this.funcionSeleccionada();

    if (funcion) {
      this.nuevaReserva.idPelicula = funcion.idPelicula;
    }

  }

  cambiarTickets() {
    this.asientosSeleccionados = [];
  }

  calcularTotal() {

    const funcion = this.funcionSeleccionada();

    if (!funcion) {
      return 0;
    }

    return Number(funcion.precioEntrada) *
           Number(this.nuevaReserva.cantidadEntradas || 0);

  }

  asientosSala() {

    const funcion = this.funcionSeleccionada();

    if (!funcion) {
      return [];
    }

    return this.asientos.filter(
      a => Number(a.idSala) === Number(funcion.idSala)
    );

  }

  asientoOcupado(idAsiento: number) {

    return this.detalles.some(detalle => {

      const reserva = this.reservas.find(
        r => Number(r.idReserva) === Number(detalle.idReserva)
      );

      return reserva &&
        Number(reserva.idFuncion) ===
        Number(this.nuevaReserva.idFuncion) &&
        Number(detalle.idAsiento) === Number(idAsiento);

    });

  }

  seleccionarAsiento(idAsiento: number) {

    if (this.asientoOcupado(idAsiento)) {
      return;
    }

    const cantidad = Number(this.nuevaReserva.cantidadEntradas);

    if (this.asientosSeleccionados.includes(idAsiento)) {

      this.asientosSeleccionados =
        this.asientosSeleccionados.filter(
          id => id !== idAsiento
        );

    } else {

      if (this.asientosSeleccionados.length >= cantidad) {
        alert("Ya seleccionaste todos tus tickets.");
        return;
      }

      this.asientosSeleccionados.push(idAsiento);

    }

  }

  guardarReserva() {

    if (this.guardando || this.cargando) {
      return;
    }

    const cantidad = Number(this.nuevaReserva.cantidadEntradas);

    if (!this.nuevaReserva.idCliente ||
        !this.nuevaReserva.idFuncion) {

      alert("Seleccione cliente, película y función.");
      return;

    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {

      alert("Ingrese una cantidad válida de tickets.");
      return;

    }

    if (this.asientosSeleccionados.length !== cantidad) {

      alert("Seleccione un asiento por cada ticket.");
      return;

    }

    if (this.asientosSeleccionados.some(
      id => this.asientoOcupado(id)
    )) {

      alert("Uno de los asientos ya está ocupado.");
      return;

    }

    const reserva = {
      idCliente: Number(this.nuevaReserva.idCliente),
      idFuncion: Number(this.nuevaReserva.idFuncion),
      cantidadEntradas: cantidad,
      totalAPagar: this.calcularTotal(),
      fechaReserva: new Date().toISOString()
    };

    this.guardando = true;

    this.http.post<any>(
      "http://localhost:8080/reserva/guardar",
      reserva
    ).subscribe({

      next: res => {

        if (!res || !res.idReserva) {

          this.guardando = false;
          alert("No se recibió el ID de la reserva.");
          return;

        }

        const peticiones = this.asientosSeleccionados.map(
          idAsiento => this.http.post(
            "http://localhost:8080/detalle-reserva-asientos/guardar",
            {
              idReserva: res.idReserva,
              idAsiento: idAsiento
            }
          )
        );

        forkJoin(peticiones).subscribe({

          next: () => {

            alert("Reserva guardada correctamente.");

            this.nuevaReserva = {
              idCliente: null,
              idPelicula: null,
              idFuncion: null,
              cantidadEntradas: 1
            };

            this.asientosSeleccionados = [];
            this.guardando = false;

            this.cargarDatos();

          },

          error: error => {

            console.log("Error al guardar asientos:", error);

            this.guardando = false;

            alert(
              "La reserva se creó, pero hubo un problema al guardar los asientos. Revise los registros antes de intentar otra vez."
            );

            this.cargarDatos();

          }

        });

      },

      error: error => {

        console.log("Error al guardar:", error);

        this.guardando = false;
        alert("No se pudo guardar la reserva.");

      }

    });

  }

  nombreCliente(id: number) {

    const cliente = this.clientes.find(
      c => Number(c.idCliente) === Number(id)
    );

    return cliente
      ? cliente.nombres + " " + cliente.apellidos
      : "Cliente " + id;

  }

  nombreFuncion(id: number) {

    const funcion = this.funciones.find(
      f => Number(f.idFuncion) === Number(id)
    );

    if (!funcion) {
      return "Función " + id;
    }

    const pelicula = this.peliculas.find(
      p => Number(p.idPelicula) === Number(funcion.idPelicula)
    );

    return pelicula
      ? pelicula.titulo + " - Función " + id
      : "Función " + id;

  }

}
