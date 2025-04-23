import { Firestore, getFirestore } from "firebase-admin/firestore";
import { getApps, ServiceAccount } from "firebase-admin/app"
import admin from 'firebase-admin'
import { Auth, getAuth } from "firebase-admin/auth";
// npm install firebase-admin --save

const serviceAccount = {
    "type": "service_account",
    "project_id": "yoonju-blog",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASES_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40yoonju-blog.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
}


let firestore: Firestore
//getApps()를 호출하여 이미 초기화된 Firebase 앱들의 리스트를 가져옵니다.
let auth: Auth;
const currentApps = getApps();

if (!currentApps.length) {
    const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    firestore = getFirestore(app);
    auth = getAuth(app);
} else {
    const app = currentApps[0];
    firestore = getFirestore(app);
    auth = getAuth(app);
}
//설정된 firestore 객체를 모듈로 내보냄으로써 다른 파일에서 Firestore 데이터베이스를 사용할 수 있도록 합니다.
export { firestore, auth }
