import { WhatsappAdapter } from "./whatsapp.adapter";
import makeWASocket, { Browsers, DisconnectReason, WASocket, useMultiFileAuthState } from 'baileys';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaileysWhatsappAdapter extends WhatsappAdapter {

    private socket: WASocket;

    constructor() {
        super();
        this.connect();
    }

    private async connect() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        this.socket = makeWASocket({
            printQRInTerminal: true,
            auth: state
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

    public async sendMessage(phone: string, message: string): Promise<void> {
        const phoneNumber = `${phone}@s.whatsapp.net`;

        try {
            await this.socket.sendMessage(phoneNumber, { text: message });
            console.log(`Mensagem enviada para ${phone}: ${message}`);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    }
}
