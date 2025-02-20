import { Message } from "@/core/domain/entities/message.entity";
import { WhatsAppProvider } from "./whatsapp.provider";
import { useMultiFileAuthState, WASocket } from "baileys";
import { makeWASocket } from "baileys";
import { DisconnectReason } from "baileys";
import { Injectable } from "@nestjs/common";
import pino from "pino";
@Injectable()
export class BaileysWhatsappProvider implements WhatsAppProvider {

    private socket: WASocket;

    constructor() {
        this.connect();
    }

    private async connect() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        this.socket = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: pino({}),
        });
        this.socket.ev.on('creds.update', saveCreds);

        this.socket.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                if (lastDisconnect?.error?.cause !== DisconnectReason.loggedOut) {
                    console.log('Reconectando...');
                    this.connect();
                }
            }
        })
    }

    public async sendMessage(message: Message): Promise<void> {
        const content = message.getContent();

        if (!this.isConnected()) {
            throw new Error('Socket não está conectado');
        }

        await this.socket.sendMessage(message.getPhoneFormatedFromWhatsapp(), { text: content });
        console.log(`Mensagem enviada para ${message.getPhone()}: ${content}`);
    }

    isConnected(): boolean {
        return this.socket.ws.isOpen
    }
}

