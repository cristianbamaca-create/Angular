import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Bienvenida } from './bienvenida/bienvenida';
import { Anuncio } from './anuncio/anuncio';
import { Genero } from './genero/genero';
import { Clasificacion } from './clasificacion/clasificacion';
import { Sala } from './sala/sala';
import { Asiento } from './asiento/asiento';
import { Pelicula } from './pelicula/pelicula';
import { Funcion } from './funcion/funcion';
import { Examen } from './examen/examen';

import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    
    // Rutas protegidas
    { path: 'bienvenida', component: Bienvenida, canActivate: [authGuard] },
    { path: 'anuncio', component: Anuncio, canActivate: [authGuard] },
    { path: 'genero', component: Genero, canActivate: [authGuard] },
    { path: 'clasificacion', component: Clasificacion, canActivate: [authGuard] },
    { path: 'sala', component: Sala, canActivate: [authGuard] },
    { path: 'asiento', component: Asiento, canActivate: [authGuard] },
    { path: 'pelicula', component: Pelicula, canActivate: [authGuard] },
    { path: 'funcion', component: Funcion, canActivate: [authGuard] },
    { path: 'examen', component: Examen, canActivate: [authGuard] },
    
    { path: '**', redirectTo: 'login' }
];