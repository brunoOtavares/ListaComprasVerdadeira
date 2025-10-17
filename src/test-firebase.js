// Arquivo para testar a conexão com o Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8O60X4lA4gacVUZtgbzhaYQLVnwqr6EU",
  authDomain: "lista-de-comr.firebaseapp.com",
  projectId: "lista-de-comr",
  storageBucket: "lista-de-comr.appspot.com",
  messagingSenderId: "928934741826",
  appId: "1:928934741826:web:7f6b6c9c7c6c9c7c6c9c7c"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Testa a conexão com o Firestore
const testConnection = async () => {
  try {
    console.log("Testando conexão com o Firestore...");
    
    // Tenta acessar uma coleção (pode não existir ainda)
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log("Conexão bem-sucedida! Documentos encontrados:", querySnapshot.size);
  } catch (error) {
    console.error("Erro na conexão com o Firestore:", error.code, error.message);
    
    // Verifica se é um erro de permissão
    if (error.code === 'permission-denied') {
      console.error("Erro de permissão. Verifique as regras de segurança do Firestore.");
    } else if (error.code === 'unavailable' || error.code === 'resource-exhausted') {
      console.error("Serviço indisponível. Verifique se o Firestore está ativado no projeto.");
    }
  }
};

testConnection();