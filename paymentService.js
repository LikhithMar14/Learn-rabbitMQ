const amqp = require("amqplib");

const receiveMessages = async () => {
    try{
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        const exchange = 'notification_exchange';
        const queue = 'payment_queue';

        await channel.assertExchange(exchange, 'topic', {durable: true});
        await channel.assertQueue(queue, {durable: true});
        channel.bindQueue(queue, exchange, 'payment.*');

        channel.consume(queue, (msg) => {
            console.log("Payment Service");
            if (msg !== null) {
                console.log("Recived Message Successfully!");
                console.log(JSON.parse(msg.content));
                channel.ack(msg);
            }
        });

    }catch(err){
        console.error("Error.. ",err);
    }
}

receiveMessages();
