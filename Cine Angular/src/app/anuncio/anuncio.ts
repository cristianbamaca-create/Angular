
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-anuncio',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './anuncio.html',
  styleUrl: './anuncio.css'
})
export class Anuncio {

  private readonly http: HttpClient;
  formulario: FormGroup;
  anuncios: any = [];

  constructor(
    http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http = http;

    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      hashtag: ['', Validators.required]
    });

    this.buscarAnuncios();
  }

  buscarAnuncios() {
    this.http.get("http://localhost:8080/anuncio/buscar").subscribe(
      data => {
        this.anuncios = data;
        this.cdr.detectChanges();
      }
    );
  }

  guardar() {
    if (this.formulario.valid) {
      this.http.post("http://localhost:8080/anuncio/guardar", this.formulario.value).subscribe(
        res => {
          alert("Anuncio guardado con éxito");
          this.buscarAnuncios();
          this.formulario.reset();
        }
      );
    } else {
      alert("Completar campos");
    }
  }

}
