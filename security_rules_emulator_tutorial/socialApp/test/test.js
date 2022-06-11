const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'fir-cf-tutorials';
const myId = 'user_abc';
const theirId = 'user_xyz';
const myAuth = { uid: myId, email: 'abc@gmail.com' };

const getFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
};

const getAdminFirestore = () => {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
};

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

describe('Our social app', () => {
  test('it can read items in the read-only collection', () => {
    const db = getFirestore(null);
    const testDoc = db.collection('readonly').doc('testDoc');
    return firebase.assertSucceeds(testDoc.get()).then(() => {});
  });

  test("can't write to items in the read-only collection", async () => {
    const db = getFirestore(null);
    const testDoc = db.collection('readonly').doc('testDoc2');
    await firebase.assertFails(testDoc.set({ foo: 'bar' }));
  });

  test('Can write to a user document with the same ID as our user', async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection('users').doc(myId);
    await firebase.assertSucceeds(testDoc.set({ foo: 'bar' }));
  });

  test('Can write to a user document with a different ID as our user', async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection('users').doc(theirId);
    await firebase.assertFails(testDoc.set({ foo: 'bar' }));
  });

  test('Can read posts marked public', async () => {
    const db = getFirestore(null);
    const testQuery = db
      .collection('posts')
      .where('visibility', '==', 'public');
    await firebase.assertSucceeds(testQuery.get());
  });

  test('Can query personal posts', async () => {
    const db = getFirestore(myAuth);
    const testQuery = db.collection('posts').where('authorId', '==', myId);
    await firebase.assertSucceeds(testQuery.get());
  });

  test("Can't query all posts", async () => {
    const db = getFirestore(myAuth);
    const testQuery = db.collection('posts');
    await firebase.assertFails(testQuery.get());
  });

  test('Can read a single public post', async () => {
    const admin = getAdminFirestore();
    const postId = 'public_post';
    const setupDoc = admin.collection('posts').doc(postId);
    await setupDoc.set({ authorId: theirId, visibility: 'public' });

    const db = getFirestore(null);
    const testRead = db.collection('posts').doc(postId);
    await firebase.assertSucceeds(testRead.get());
  });

  test('Can read a private post belonging to the user', async () => {
    const admin = getAdminFirestore();
    const postId = 'private_post';
    const setupDoc = admin.collection('posts').doc(postId);
    await setupDoc.set({ authorId: myId, visibility: 'private' });

    const db = getFirestore(myAuth);
    const testRead = db.collection('posts').doc(postId);
    await firebase.assertSucceeds(testRead.get());
  });

  test("Can't read a private post belonging to another user", async () => {
    const admin = getAdminFirestore();
    const postId = 'private_post';
    const setupDoc = admin.collection('posts').doc(postId);
    await setupDoc.set({ authorId: theirId, visibility: 'private' });

    const db = getFirestore(myAuth);
    const testRead = db.collection('posts').doc(postId);
    await firebase.assertFails(testRead.get());
  });
});

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
