import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageUseCase } from './send-message.use-case';
import { MessageRepository } from '../../../../core/domain/repositories/message-repository.abstract';
import { Message } from '../../../../core/domain/entities/message.entity';
import { MessageProducer } from '../../queues/producers/message.producer';

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let mockMessageRepository: jest.Mocked<MessageRepository>;
  let mockMessageProducer: jest.Mocked<MessageProducer>;

  beforeEach(async () => {
    mockMessageRepository = {
      save: jest.fn(),
    } as any;

    mockMessageProducer = {
      addMessageToQueue: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessageUseCase,
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
        {
          provide: MessageProducer,
          useValue: mockMessageProducer,
        },
      ],
    }).compile();

    useCase = module.get<SendMessageUseCase>(SendMessageUseCase);
  });

  describe('execute', () => {
    it('deve salvar e adicionar mensagem à fila com sucesso quando autor é fornecido', async () => {
      // Arrange
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
        author: 'Test Author',
      };
      const expectedMessage = new Message(inputMessage);

      // Act
      await useCase.execute(inputMessage);

      // Assert
      expect(mockMessageRepository.save).toHaveBeenCalledWith(expectedMessage);
      expect(mockMessageProducer.addMessageToQueue).toHaveBeenCalledWith(expectedMessage);
      expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMessageProducer.addMessageToQueue).toHaveBeenCalledTimes(1);
    });

    it('deve salvar e adicionar mensagem à fila com sucesso quando autor não é fornecido', async () => {
      // Arrange
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
      };
      const expectedMessage = new Message(inputMessage);

      // Act
      await useCase.execute(inputMessage);

      // Assert
      expect(mockMessageRepository.save).toHaveBeenCalledWith(expectedMessage);
      expect(mockMessageProducer.addMessageToQueue).toHaveBeenCalledWith(expectedMessage);
    });

    it('deve lançar erro se falhar ao salvar no repositório', async () => {
      // Arrange
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
      };
      const expectedError = new Error('Falha ao salvar mensagem');
      mockMessageRepository.save.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(inputMessage)).rejects.toThrow(expectedError);
      expect(mockMessageProducer.addMessageToQueue).not.toHaveBeenCalled();
    });

    it('deve lançar erro se falhar ao adicionar mensagem à fila', async () => {
      // Arrange
      const inputMessage = {
        content: 'Test message',
        phone: '+5511999999999',
      };
      const expectedError = new Error('Falha ao adicionar mensagem à fila');
      mockMessageProducer.addMessageToQueue.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(inputMessage)).rejects.toThrow(expectedError);
      expect(mockMessageRepository.save).toHaveBeenCalled();
    });
  });
}); 