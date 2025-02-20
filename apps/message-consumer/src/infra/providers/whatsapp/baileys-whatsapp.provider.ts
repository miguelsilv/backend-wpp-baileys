import { Message } from "@/core/domain/entities/message.entity";
import { WhatsAppProvider } from "./whatsapp.provider";
import { useMultiFileAuthState, WASocket } from "baileys";
import { makeWASocket } from "baileys";
import { DisconnectReason } from "baileys";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';


@Injectable()
export class BaileysWhatsappProvider implements WhatsAppProvider {
    private socket: WASocket;

    constructor(
        @InjectPinoLogger(BaileysWhatsappProvider.name)
        private readonly logger: PinoLogger
    ) {
        this.connect();
    }

    private async connect() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        this.socket = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: this.logger.logger as any
        });
        this.socket.ev.on('creds.update', saveCreds);

        this.socket.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect?.error?.cause !== DisconnectReason.loggedOut) {
                    this.logger.info('Reconectando ao WhatsApp...');
                    this.connect();
                }
            } else if (connection === 'open') {
                this.logger.info('Conexão WhatsApp estabelecida');
            }
        });
    }

    public async sendMessage(message: Message): Promise<void> {
        const content = message.getContent();

        if (!this.isConnected()) {
            this.logger.error('Socket não está conectado');
            throw new Error('Socket não está conectado');
        }

        try {
            await this.socket.sendMessage(
                message.getPhoneFormatedFromWhatsapp(), 
                { text: content }
            );
            this.logger.info({
                phone: message.getPhone(),
                content
            }, 'Mensagem enviada com sucesso');
        } catch (error) {
            this.logger.error({
                error,
                phone: message.getPhone(),
                content
            }, 'Erro ao enviar mensagem');
            throw error;
        }
    }

    isConnected(): boolean {
        return this.socket.ws.isOpen;
    }
}

