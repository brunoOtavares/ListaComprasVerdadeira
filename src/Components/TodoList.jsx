import React, { useState } from 'react';
import './TodoList.css';

export default function TodoList({ shoppingList, setShoppingList }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setShoppingList([...shoppingList, { text: inputValue, completed: false }]);
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

  return (
    <div className="todo-list-container">
      <h2>Lista de Compras</h2>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Adicionar item..."
        />
        <button onClick={handleAddItem}>Adicionar</button>
      </div>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index} className={item.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleItem(index)}>{item.text}</span>
            <button onClick={() => handleRemoveItem(index)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
