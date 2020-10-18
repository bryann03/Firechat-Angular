import { Mensaje } from './../interface/mensaje.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
   providedIn: 'root'
})
export class ChatService {

   private itemsCollection: AngularFirestoreCollection<Mensaje>;
   public mensajesChats: Mensaje[] = [];
   public usuario: any = {};

   constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
      this.auth.authState.subscribe(user => {
         //ESTE 'user' VIENE CON TODA LA INFO DEL USAURIO DE LA CUENTA CON LA QUE INICIA
         console.log('Estado del user: ', user);
         if(user){
            this.usuario.nombre = user.displayName;
            this.usuario.uid = user.uid;
         }
      })
   }

   login(tipoCuenta: string) {
      this.auth.signInWithPopup(new auth.GoogleAuthProvider());
   }
   logout() {
      this.usuario = {};
      this.auth.signOut();
   }

   cargarMensajes() {
      //PASAMOS POR PARÁMeTRO EL NOMBRE QUE TENEMO DE LA 'BD' EN 'cloudStore' de firebase
      //MANDAMOS UN QUERY A FIERBASE PARA QUE DEVUELVA ORDENADOS LOS MENSAJES
      //EN ESTE CASO LE DECIMOS QUE ORDENAMOS EL MENSAJE POR FECHA ASCENDENTE
      //AGREGAMOS TAMBIÑEN UN LIMITE DE 5 MENSAJES
      this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));

      return this.itemsCollection.valueChanges()
         .pipe(map((mensajes: Mensaje[]) => {
            this.mensajesChats = [];
            //LÓGICA PARA QUE LOS MENSAJES NUEVOS VAYAN APARECIENDO ABAJO
            for (const mensaje of mensajes) {
               //INSERTAMOS EL MENSAJE SIEMPRE EN LA PRIMERA POSICIÓN CON 'unshift()'
               this.mensajesChats.unshift(mensaje);
            }
            return this.mensajesChats;
         }));
   }

   addMensaje(mensaje: string) {

      let objectMensaje: Mensaje = {
         nombre: this.usuario.nombre,
         mensaje: mensaje,
         fecha: new Date().getTime(),
         uid: this.usuario.uid
      }
      return this.itemsCollection.add(objectMensaje);
   }

}
