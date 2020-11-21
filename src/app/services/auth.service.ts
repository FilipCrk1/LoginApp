import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    useToken: string;
    private url = 'https://identitytoolkit.googleapis.com/v1';
    private apikey = ' AIzaSyBJYluKWtrF5LeRUP98B0bSETfpJh0Xk_E';
  //Crear Nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  constructor( private http: HttpClient ) {
    this.leerToken();
  }

  logout() {
  localStorage.removeItem('token');
  }
  login( usuario: UsuarioModel ) {
    const authData = {
      ...usuario,
      returnSecureToken: true
     };
     return this.http.post(
        `${ this.url }/accounts:signInWithPassword?key=${ this.apikey }`,
       authData
     ).pipe(
      map( resp => {
        console.log('entro en el map')
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }
  nuevoUsuario( usuario: UsuarioModel ) {
   const authData = {
    ...usuario,
    returnSecureToken: true
   };
   return this.http.post(
     `${ this.url }/accounts:signUp?key=${ this.apikey }`,
     authData
   ).pipe(
     map( resp => {
       console.log('entro en el map')
       this.guardarToken( resp['idToken']);
       return resp;
     })
   );
  }
  private guardarToken( idToken: string ) {
   this.useToken = idToken;
   localStorage.setItem('token', idToken);
  }
  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.useToken = localStorage.getItem('token');
    } else {
      this.useToken = '';
    }
      return this.useToken;
  }
    estaAutenticado(): boolean {
      return this.useToken.length > 2;
    }
}
