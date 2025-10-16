import React, { useState } from 'react';
import { getItemEmoji } from '../utils/emojiMap';
import './TodoList.css';

export default function TodoList({ shoppingList, setShoppingList }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setShoppingList([...shoppingList, {
        text: inputValue,
        completed: false,
        emoji: getItemEmoji(inputValue)
      }]);
      setInputValue('');
    }
  };

  const handleToggleItem = (index) => {
    const newItems = [...shoppingList];
    newItems[index].completed = !newItems[index].completed;
    setShoppingList(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = shoppingList.filter((_, i) => i !== index);
    setShoppingList(newItems);
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
            <li key={index} className={item.completed ? 'completed' : ''}>
              <span onClick={() => handleToggleItem(index)}>
                <span className="item-emoji">{item.emoji || getItemEmoji(item.text)}</span>
                {item.text}
              </span>
              <button onClick={() => handleRemoveItem(index)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
