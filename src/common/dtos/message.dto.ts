import { Transform } from "class-transformer";
import { IsNotEmpty, Matches } from "class-validator";

import { IsString } from "class-validator";

class MessageDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => {
        let phone = value.replace(/[^\d]/g, '');
        if (phone.length === 13 && phone.startsWith('55')) {
            phone = phone.slice(0, -1);
        }
        return phone;
    })
    @Matches(/^\d{12}$/, {
        message: 'O número de telefone deve ser válido no padrão 5511999999999.',
    })
    phone: string;

    @IsNotEmpty()
    message: string;
}

export class SendMessageDto extends MessageDto {
    name?: string;
}

export class ReceiveMessageDto extends MessageDto {
    @IsNotEmpty()
    name: string;
}