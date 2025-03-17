const amqp = require("amqplib");


const sendMessage = async(routingKey,message) => {
    try{
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel  = await connection.createChannel();
        const EXCHANGE_NAME = 'notification_exchange';
        const EXCHANGE_TYPE = 'topic';


        await channel.assertExchange(EXCHANGE_NAME,EXCHANGE_TYPE,{durable:true});

        channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));

        console.log(" [x] Sent %s: '%s'",routingKey,JSON.stringify(message));
        console.log(`${routingKey} message sent successfully`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 5000);

    }catch(err){
        console.error(err);

    }
};

sendMessage("order.placed", {orderId:1234,status:"placed"});
sendMessage("payment.processed", {orderId:67867,status:"processed"});