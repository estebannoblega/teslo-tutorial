import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Socket} from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


interface ConnectedClient{
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>    
        //* OTRA FORMA, ES CREAR EN EL USERSERVICE LOS METODOS NECESARIOS, ESTO SE HIZO SOLO PARA MOSTRAR QUE TAMBIEN ES POSIBLE INYECCION DE DEPENDENCIAS
    ){}

    private connectedClients: ConnectedClient = {}

    async registerClient(client: Socket, clientId: string){

        const user = await this.userRepository.findOneBy({id: clientId});
        if(!user){
            throw new Error('User not found');
        }
        if(!user.isActive) throw new Error('User not active');

        this.checkUserConnection(user);
        
        this.connectedClients[client.id] = {
            socket: client,
            user
        };

    }

    removeClient(clientId: string){
        delete this.connectedClients[clientId];
    }

    getConnectedClients():string[]{
        return Object.keys(this.connectedClients);
    }

    getUserFullNameBySocketId(socketId: string){
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User){
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];

            if(connectedClient.user.id===user.id){
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}
