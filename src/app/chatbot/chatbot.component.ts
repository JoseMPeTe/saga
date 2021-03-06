import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/auth.service';
import { Subscription } from 'rxjs';

const dialogflowURL =
  'https://europe-west6-saga-1f81f.cloudfunctions.net/dialogflowGateway'; //'https://YOUR-CLOUDFUNCTION/dialogflowGateway';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  messages = <any>[];
  loading = false;

  // Random ID to maintain session with server https://cloud.google.com/dialogflow/es/docs/quick/api
  sessionId: string;

  imageURL: any;
  darkSubscription: Subscription;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.addBotMessage('Presencia humana detectada 🤖. ¿Como puedo ayudarle? ');
    this.sessionId =
      Math.random().toString(36).slice(-5) + this.auth.getUserId();
    console.log('sesionID desde chatComponent  ' + this.sessionId);

    this.darkChat();

    this.auth.afAuth.onAuthStateChanged(() => {
      this.imageURL = this.auth.getImageURL();
    });
  }

  //Método para que si se toca el switch de modo oscuro, cambie el fondo del chat
  darkChat() {
    const chat = document.getElementById('msg-inbox');
    //Estado del switch cuando se inicia el chat
    let switchDarkValue = this.auth.getSwitch().get('switch').value;
    if (switchDarkValue) {
      chat.setAttribute('class', 'chat bg-dark  text-white');
    } else {
      chat.setAttribute('class', 'chat text-dark');
    }
    //Suscripción a cambios de estado del switch, después de iniciado el componente chat
    this.darkSubscription = this.auth
      .getSwitch()
      .get('switch')
      .valueChanges.subscribe((value) => {
        if (value) {
          chat.setAttribute('class', 'chat bg-dark  text-white');
        } else {
          chat.setAttribute('class', 'chat text-dark');
        }
      });
  }

  handleUserMessage(event: any) {
    console.log(event);
    const text = event.message;
    this.addUserMessage(text);

    this.loading = true;

    // Make the request
    this.http
      .post<any>(dialogflowURL, {
        sessionId: this.sessionId,
        queryInput: {
          text: {
            text,
            languageCode: 'es',
          },
        },
      })
      .subscribe((res) => {
        // console.log("res antes de addbotMess"+JSON.stringify(res))
        const { fulfillmentText } = res;
        this.addBotMessage(fulfillmentText);
        this.loading = false;
        const chat = document.getElementById('msg-page');
        chat.scrollTop = chat.scrollHeight;
      });
  }

  addUserMessage(text: any) {
    this.messages.push({
      text,
      sender: 'Usuario',
      reply: true,
      avatar: this.imageURL,
      date: new Date(),
    });
  }

  addBotMessage(text: string) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar:
        'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png',
      date: new Date(),
    });
  }
}
