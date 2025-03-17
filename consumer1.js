const amqp  = require("amqplib");;
const RABBITMQ_URL = 'amqp://localhost:5672';


async function receiveMessage(){
    try{
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        const QUEUE_NAME1 = 'mail_queue1';

        await channel.assertQueue(QUEUE_NAME1,{durable: false});
        channel.consume("mail_queue1", (msg) => {
            console.log("Consumer 1");

            if(msg !== null){
                console.log("Recived Message Successfully!");
                console.log(JSON.parse(msg.content));
                channel.ack(msg);
            }
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 5000);
    }catch(err){
        console.log(err);

    }
}

receiveMessage();