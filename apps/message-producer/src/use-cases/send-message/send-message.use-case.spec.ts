import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageUseCase } from './send-message.use-case';
import { WhatsAppProvider } from '../../../../core/common/providers/whatsapp/whatsapp.provider';
import { MessageRepository } from '../../../../core/domain/repositories/message-repository.abstract';
import { Message } from '../../../../core/domain/entities/message.entity';

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let mockMessageRepository: jest.Mocked<MessageRepository>;
  let mockWhatsAppProvider: jest.Mocked<WhatsAppProvider>;

  beforeEach(async () => {
    mockMessageRepository = {
      save: jest.fn(),
    } as any;

    mockWhatsAppProvider = {
      sendMessage: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessageUseCase,
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
        {
          provide: WhatsAppProvider,
          useValue: mockWhatsAppProvider,
        },
      ],
    }).compile();

    useCase = module.get<SendMessageUseCase>(SendMessageUseCase);
  });

  describe('execute', () => {
    it('deve enviar mensagem e salvar no repositório com sucesso', async () => {
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
        author: 'Test Author',
      };

      const expectedMessage = new Message(inputMessage);

      mockWhatsAppProvider.sendMessage.mockResolvedValue(undefined);
      mockMessageRepository.save.mockResolvedValue(undefined);

      await useCase.execute(inputMessage);

      expect(mockWhatsAppProvider.sendMessage).toHaveBeenCalledWith(expectedMessage);
      expect(mockMessageRepository.save).toHaveBeenCalledWith(expectedMessage);
      expect(mockWhatsAppProvider.sendMessage).toHaveBeenCalledTimes(1);
      expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve enviar mensagem sem autor e salvar no repositório', async () => {
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
      };

      const expectedMessage = new Message(inputMessage);

      mockWhatsAppProvider.sendMessage.mockResolvedValue(undefined);
      mockMessageRepository.save.mockResolvedValue(undefined);

      await useCase.execute(inputMessage);

      expect(mockWhatsAppProvider.sendMessage).toHaveBeenCalledWith(expectedMessage);
      expect(mockMessageRepository.save).toHaveBeenCalledWith(expectedMessage);
    });

    it('deve lançar erro se o envio da mensagem falhar', async () => {
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
      };

      const expectedError = new Error('Falha ao enviar mensagem');
      mockWhatsAppProvider.sendMessage.mockRejectedValue(expectedError);

      await expect(useCase.execute(inputMessage)).rejects.toThrow(expectedError);
      expect(mockMessageRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro se falhar ao salvar no repositório', async () => {
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
      };

      const expectedError = new Error('Falha ao salvar mensagem');
      mockWhatsAppProvider.sendMessage.mockResolvedValue(undefined);
      mockMessageRepository.save.mockRejectedValue(expectedError);

      await expect(useCase.execute(inputMessage)).rejects.toThrow(expectedError);
      expect(mockWhatsAppProvider.sendMessage).toHaveBeenCalled();
    });
  });
}); 