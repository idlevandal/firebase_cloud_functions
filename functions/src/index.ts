import * as functions from "firebase-functions";
const axios = require('axios').default;

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const hollowWorld = functions.https.onRequest((req, res) => {
    res.status(200).json({
        name: 'Dave'
    });
});

export const api = functions.https.onRequest(async (req, res) => {
    switch (req.method) {
        case 'GET':
            const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
            res.send(response.data);
            break;
        case 'POST':
            const body = req.body;
            res.send(body);
            break;
        case 'DELETE':
            res.send('It was a DELETE request');
            break;
    }
});

// run functions on Firebase AUTH events

export const userAdd = functions.auth.user().onCreate(user => {
    console.log(`${user.email} is created...`);
    return Promise.resolve();
    
});

export const userDeleted = functions.auth.user().onDelete(user => {
    console.log(`${user.email} has been deleted...`);
    return Promise.resolve();
});

// run functions on FIRESTORE events
export const valueAdded = functions.firestore
    .document('/fruits/{documentId}')
    .onCreate((snapshot, context) => {
        console.log(snapshot.data());
        return Promise.resolve();
});

export const valueDeleted = functions.firestore
    .document('/fruits/{documentId}')
    .onDelete((snapshot, context) => {
        console.log(snapshot.data(), 'deleted');
        return Promise.resolve();
});

export const valueUpated = functions.firestore
    .document('/fruits/{documentId}')
    .onUpdate((snapshot, context) => {
        console.log('Before', snapshot.before.data());
        console.log('After', snapshot.after.data());
        return Promise.resolve();
});

// scheduled Functions / cron jobs.
// can pass cron expression or app engine yaml (cron.yaml)
// https://cloud.google.com/appengine/docs/standard/python/config/cronref

export const scheduledFunction = functions.pubsub.schedule('* * * * *').onRun(context => {
    console.log('I am running/executing every minute...');
    return null;
});