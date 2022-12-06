import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';


@WebSocketGateway({ cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService   
  ) {}
  
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload:JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    
    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    

  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  //message-from-client
  @SubscribeMessage('message-from-client')  //cuando trabajamos con este decorador tenemos acceso al socket que esta emitiendo el evento y el payload (q puede ser cualquier cosa)
  handleMessageClient(client: Socket, payload: NewMessageDto ){
    //emitimos el mensaje a quien se le envió el mensaje(no a todos)
    // client.emit('messages-from-server',{
    //   fullName: 'Sou yo',
    //   message: payload.message || 'no-message!!'
    // })

    //Emitir a todos menos al cliente que emitió el mensaje originalmente
    // client.broadcast.emit('messages-from-server',{
    //    fullName: 'syou yo',
    //    message: payload.message
    // })

    //Emitir a todos los clientes, incluyendo a quien origino el mensaje
    this.wss.emit('messages-from-server',{
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message
   })
  }
}
