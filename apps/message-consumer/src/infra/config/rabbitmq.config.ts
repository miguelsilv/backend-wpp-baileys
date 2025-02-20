import { RmqOptions, Transport } from '@nestjs/microservices';

 const rabbitMQConfig = () => (<RmqOptions>{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'message_queue',
      noAck: false,
      queueOptions: {
        durable: true
      },
    },
  });

export default rabbitMQConfig;