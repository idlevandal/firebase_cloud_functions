import * as functions from "firebase-functions";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
const admin = require('firebase-admin');
const axios = require('axios').default;

const app = admin.initializeApp();
const firestore = app.firestore();

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

export const getUsers = functions.https.onRequest(async (req, res) => {
    // const users = await admin.firestore().collection('guitar').get();
    // GET ALL USERS
    // const users = await firestore.collection('user').get();
    // const data = users.docs;

    const userId = req.query.id || '8MlVvpZ3Iu25tc3UxEED';

    const selectedUser = await firestore.doc(`user/${userId}`).get();
    const selectedUserData = selectedUser.data();
    const results = selectedUserData.guitars;

    // REPLACE WITH getArrayData FUNCTION
    // const promises: Promise<DocumentSnapshot>[] = [];
    // results.forEach((id: string) => {
    //     const p = firestore.doc(`guitar/${id}`).get(); //.collection(modelName).doc('myId').   // same????
    //     promises.push(p);
    // });
    // const snapshots = await Promise.all(promises);
    // const responseArray = snapshots.map((sShot) => sShot.data());

    const responseArray = await getArrayData(results, 'guitar');

    // add response data to original data
    selectedUserData.guitars = responseArray;

    res.status(200).json({
        data: selectedUserData,
        id: userId
    });

});

// get the data for an array of documents from the selected collection
const getArrayData =  async (arrayOfIds: Array<string>, collectionName: string): Promise<Array<any>> => {
    const promisesArr: Promise<DocumentSnapshot>[] = [];
    arrayOfIds.forEach((id: string) => {
        const p = firestore.doc(`${collectionName}/${id}`).get(); //.collection(modelName).doc('myId').   // same????
        promisesArr.push(p);
    });
    const snapshots = await Promise.all(promisesArr);
    const responseArray = snapshots.map((sShot) => sShot.data());
    return responseArray;
}

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
    // documentId is a wildcard. eg you get a reference to it using context.params.documentId inside onUpdate/onDelete etc.
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
