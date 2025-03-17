const  amq = require('amqplib');
const RABBITMQ_URL = 'amqp://localhost:5672';

async function sendMail(){
    try{
        const connection = await amq.connect(RABBITMQ_URL);
        const channel  = await connection.createChannel();
        const EXCHANGE_NAME = 'mail_exchange';
        const routingKey1 = 'mail_routing_key1';
        const QUEUE_NAME1 = 'mail_queue1';
        const routingKey2 = 'mail_routing_key2';
        const QUEUE_NAME2 = 'mail_queue2';

        const message1 = {
            to: 'Consumer1',
            subject: 'Hello Consumer1',
            body: 'Hello World Consumer1',
            cc: 'Consumer1@example.com'
        }
        const message2 = {
            to: 'Consumer2',
            subject: 'Hello Consumer2',
            body: 'Hello World Consumer2',
            cc: 'Consumer2@example.com'
        }

        await channel.assertExchange(EXCHANGE_NAME, 'direct', {durable: false});
        await channel.assertQueue(QUEUE_NAME1,{durable: false});
        await channel.assertQueue(QUEUE_NAME2,{durable: false});

        await channel.bindQueue(QUEUE_NAME1, EXCHANGE_NAME,routingKey1);
        await channel.bindQueue(QUEUE_NAME2, EXCHANGE_NAME,routingKey2);

        channel.publish(EXCHANGE_NAME,routingKey1, Buffer.from(JSON.stringify(message1)));
        channel.publish(EXCHANGE_NAME,routingKey2, Buffer.from(JSON.stringify(message2)));
        console.log('Message sent successfully to Consumer1',message1);
        console.log('Message sent successfully to Consumer2',message2);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 5000);
    }catch(err){
        console.log('Failed to send message');
        console.error(err);
    }
}

sendMail();