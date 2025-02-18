// TODO: Implementar camada anticorrupção para o whatsapp adapter

import { Injectable } from "@nestjs/common";

export abstract class WhatsappAdapter {
    public abstract sendMessage(phone: string, message: string): Promise<void>;
}

