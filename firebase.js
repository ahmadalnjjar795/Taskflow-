// إعدادات Firebase
// روح على https://console.firebase.google.com → أنشئ مشروع جديد
// بعدين: Project Settings → General → Your apps → Web app (</>) → هتلاقي الأكواد هاي
// وفعّل Authentication → Sign-in method → Email/Password

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyArUSq34AY6y7fSi-D8GJffivVD7B433r4',
  authDomain: 'tasks-6a0d7.firebaseapp.com',
  projectId: 'tasks-6a0d7',
  storageBucket: 'tasks-6a0d7.firebasestorage.app',
  messagingSenderId: '789173764642',
  appId: '1:789173764642:web:f3498d685d7211caa3c07b',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
