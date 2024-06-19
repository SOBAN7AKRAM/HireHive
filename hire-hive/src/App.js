
import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState('');
  useEffect(() => {
    fetch("http://localhost:8000/index")
      .then(response => response.json())
      .then(data => setData(data.hello))
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="App">
      <h1>{data}</h1>
    </div>
  );
}

export default App;
