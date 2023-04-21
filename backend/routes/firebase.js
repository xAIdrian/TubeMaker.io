// Import the functions you need from the SDKs you need
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const router = require("express").Router();
const multer = require('multer');


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp9LjyyZYGtbRYGnYUEO0ex4fM0_ghJqw",
  authDomain: "freeadmingptwebapp.firebaseapp.com",
  databaseURL: "https://freeadmingptwebapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "freeadmingptwebapp",
  storageBucket: "freeadmingptwebapp.appspot.com",
  messagingSenderId: "747467278125",
  appId: "1:747467278125:web:7c77769cc10bd84892f5a4",
  measurementId: "G-SQD6B5Q7LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(app);
// Create a storage reference from our storage service
const storageRef = ref(storage);

// Create a child reference
const userSpeech = ref(storage, 'user-speech');
const generatedSpeech = ref(storage, 'generated-speech');

// Child references can also take paths delimited by '/'
// const spaceRef = ref(storage, 'images/space.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"

router.post('/upload', async (req, res) => {
  try {
    const { title, artist, album } = req.body; // assuming you have title, artist, and album in the request body
    const file = req.file; // assuming you are using multer to handle file uploads
    const storagePath = `mp3/${file.originalname}`;

    // create file metadata
    const metadata = {
      contentType: 'audio/mpeg',
      metadata: {
        title,
        artist,
        album
      }
    };

    uploadBytes(storageRef, file, metadata).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/download', async (req, res) => {
  try {
    const fileRef = ref(storage, 'generated-speech/2021-10-20T15:57:04.000Z.mp3');
    const url = await getDownloadURL(fileRef);
    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

function getDownloadURL(fileRef) {
  getDownloadURL(ref(storage, 'images/stars.jpg'))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element
    const img = document.getElementById('myimg');
    img.setAttribute('src', url);
  })
  .catch((error) => {
    // Handle any errors
  });
}