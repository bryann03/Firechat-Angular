import { ChatService } from 'src/app/providers/chat.service';
import { Component } from '@angular/core';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {

   constructor(public chatService: ChatService) { }

   logout() {
      this.chatService.logout();
   }
}
