import React, { useState } from 'react';
import { getItemEmoji } from '../utils/emojiMap';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './TodoList.css';

export default function TodoList({ shoppingList, setShoppingList, auth, db }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = async () => {
    if (inputValue.trim()) {
      const newItem = {
        text: inputValue,
        completed: false,
        emoji: getItemEmoji(inputValue)
      };
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'shoppingList'), newItem);
      }
      setInputValue('');
    }
  };

  const handleToggleItem = async (item) => {
    const user = auth.currentUser;
    if (user) {
      const itemRef = doc(db, 'users', user.uid, 'shoppingList', item.id);
      await updateDoc(itemRef, { completed: !item.completed });
    }
  };

  const handleRemoveItem = async (item) => {
    const user = auth.currentUser;
    if (user) {
      const itemRef = doc(db, 'users', user.uid, 'shoppingList', item.id);
      await deleteDoc(itemRef);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="todo-list-container">
      <h2>Lista de Compras</h2>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Adicionar item..."
        />
        <button onClick={handleAddItem}>Adicionar</button>
      </div>
      {shoppingList.length === 0 ? (
        <div className="empty-state">
          Sua lista de compras está vazia. Adicione itens para começar!
        </div>
      ) : (
        <ul>
          {shoppingList.map((item, index) => (
            <li key={item.id} className={item.completed ? 'completed' : ''}>
              <span onClick={() => handleToggleItem(item)}>
                <span className="item-emoji">{item.emoji || getItemEmoji(item.text)}</span>
                {item.text}
              </span>
              <button onClick={() => handleRemoveItem(item)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
