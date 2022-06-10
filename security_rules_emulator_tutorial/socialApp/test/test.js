import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { clearFirestoreData } from '@firebase/testing';

const MY_PROJECT_ID = 'fir-cf-tutorials';

describe('Our social app', async () => {
  afterEach(() => {
    clearFirestoreData();
  });

  let testEnv = await initializeTestEnvironment({
    projectId: MY_PROJECT_ID,
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });

  test.only('it can read items in the read-only collection', () => {
    const alice = testEnv.authenticatedContext('alice', {});
    const testDoc = db.collection('readonly').doc('testDoc');
    return firebase.assertSucceeds(testDoc.get()).then(() => {});
  });

  test("can't write to items in the read-only collection", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection('readonly').doc('testDoc2');
    await firebase.assertFails(testDoc.set({ foo: 'bar' }));
  });

  test('Can write to a user document with the same ID as our user', async () => {
    const myAuth = { uid: 'user_abc', email: 'abc@gmail.com' };
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID, auth: myAuth })
      .firestore();
    const testDoc = db.collection('users').doc('user_abc');
    const result = await firebase.assertSucceeds(testDoc.set({ foo: 'bar' }));
  });
});

////////////////////////////
// const firebase = require('@firebase/testing');

// describe('Our social app', () => {
//   test.only('it can read items in the read-only collection', () => {
//     const db = firebase
//       .initializeTestApp({ projectId: MY_PROJECT_ID })
//       .firestore();
//     const testDoc = db.collection('readonly').doc('testDoc');
//     return firebase.assertSucceeds(testDoc.get()).then(() => {});
//   });

//   test("can't write to items in the read-only collection", async () => {
//     const db = firebase
//       .initializeTestApp({ projectId: MY_PROJECT_ID })
//       .firestore();
//     const testDoc = db.collection('readonly').doc('testDoc2');
//     await firebase.assertFails(testDoc.set({ foo: 'bar' }));
//   });

//   test('Can write to a user document with the same ID as our user', async () => {
//     const myAuth = { uid: 'user_abc', email: 'abc@gmail.com' };
//     const db = firebase
//       .initializeTestApp({ projectId: MY_PROJECT_ID, auth: myAuth })
//       .firestore();
//     const testDoc = db.collection('users').doc('user_abc');
//     const result = await firebase.assertSucceeds(testDoc.set({ foo: 'bar' }));
//   });
// });
