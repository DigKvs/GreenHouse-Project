import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBT9yn96Cxr0DTyFBe12SsKTNptPOnQbtA",
    authDomain: "greengarden-fd823.firebaseapp.com",
    databaseURL: "https://greengarden-fd823-default-rtdb.firebaseio.com",
    projectId: "greengarden-fd823",
    storageBucket: "greengarden-fd823.firebasestorage.app",
    messagingSenderId: "393259051734",
    appId: "1:393259051734:web:f38468be9d92029d85b777",
    measurementId: "G-8HJ7V7Y4Y3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const service = {}
service.user = "";

service.load =  () => {
    console.log("loading data...");
    const userref = ref(database, service.user)
    
    return new Promise((resolve, reject) => {
        onValue(userref, (snapshot) => {
            const data = snapshot.val();
            if(data) {
                resolve(data);
            } else {
                reject(new Error("No data avaliable!"))
            }
        }, (error) => {
            reject(error)
        })
    }) 
}

service.set = (data) => {
    const url = service.user;
    set(ref(database, url)  , data)
}


export {service}