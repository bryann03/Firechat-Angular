import { Mensaje } from './../interface/mensaje.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class ChatService {

   private itemsCollection: AngularFirestoreCollection<Mensaje>;
   public mensajesChats: Mensaje[] = [];

   constructor( private afs: AngularFirestore ) { }

   cargarMensajes(){
      //PASAMOS POR PARÁMeTRO EL NOMBRE QUE TENEMO DE LA 'BD' EN 'cloudStore' de firebase
      //MANDAMOS UN QUERY A FIERBASE PARA QUE DEVUELVA ORDENADOS LOS MENSAJES
      //EN ESTE CASO LE DECIMOS QUE ORDENAMOS EL MENSAJE POR FECHA ASCENDENTE
      //AGREGAMOS TAMBIÑEN UN LIMITE DE 5 MENSAJES
      this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5) );

      return this.itemsCollection.valueChanges()
                  .pipe(map( (mensajes:Mensaje[] )=> {
                     this.mensajesChats = [];
                     //LÓGICA PARA QUE LOS MENSAJES NUEVOS VAYAN APARECIENDO ABAJO
                     for (const mensaje of mensajes) {
                        //INSERTAMOS EL MENSAJE SIEMPRE EN LA PRIMERA POSICIÓN CON 'unshift()'
                        this.mensajesChats.unshift(mensaje);
                     }
                     return this.mensajesChats;
                  }));
   }

   addMensaje( mensaje: string ){

      let objectMensaje: Mensaje = {
         nombre: 'Bryan H',
         mensaje: mensaje,
         fecha: new Date().getTime()
      }
      return this.itemsCollection.add( objectMensaje );
   }
}
