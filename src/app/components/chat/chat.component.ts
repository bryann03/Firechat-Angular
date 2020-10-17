import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
   selector: 'app-chat',
   templateUrl: './chat.component.html',
   styles: [
   ]
})
export class ChatComponent implements OnInit {

   mensaje: string = "";
   elemento: any;
   constructor( public chatService: ChatService ) {
      this.chatService.cargarMensajes()
         .subscribe( () => {
            setTimeout(() => {
               //CÑODIGO PARA QUE LA BARRA DE SCROLL SE VAYA ABAJO DIRECTAMENTE AL CARGAR LOS MENSAJES
               this.elemento.scrollTop = this.elemento.scrollHeight;
            }, 20);
         });
    }

   ngOnInit(): void {
      this.elemento = document.getElementById("app-mensajes");
   }

   enviarMensaje() {
      if(this.mensaje.length > 0){
         this.chatService.addMensaje(this.mensaje)
            .then( () => {
               this.mensaje = "";
               console.log("¡MENSAJE ENVIADO!");
            })
            .catch( (error) => {
               console.log(error);
            })
      }
   }
}
