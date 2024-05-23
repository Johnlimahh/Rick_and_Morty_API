import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/Rick_and_Morty.svg'; // Importe a imagem JPG

function App() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1); // Estado para a página atual da API
  const [currentIndex, setCurrentIndex] = useState(0); // Índice do personagem atual
  const [searchId, setSearchId] = useState(''); // Estado para o ID do personagem a ser pesquisado
  const [singleCharacter, setSingleCharacter] = useState(null); // Estado para armazenar um único personagem

  const getApi = async (page) => {
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await res.json();

      console.log(data.results);

      setCharacters(data.results);
      setCurrentIndex(0); // Resetar o índice do personagem ao mudar de página
      setSingleCharacter(null); // Resetar o personagem único ao mudar de página
    } catch (error) {
      console.log(error);
    }
  };

  const getCharacterById = async (id) => {
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      const data = await res.json();
      setSingleCharacter(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApi(page);
  }, [page]); // Chame a API novamente quando a página mudar

  const handleNextCharacter = () => {
    if (singleCharacter) {
      const nextIndex = characters.findIndex(char => char.id === singleCharacter.id) + 1;
      if (nextIndex < characters.length) {
        setSingleCharacter(characters[nextIndex]);
      } else {
        setPage(page + 1);
        setSearchId('');
      }
    } else if (searchId) {
      const currentId = parseInt(searchId, 10);
      const nextId = currentId + 1;
      if (nextId <= characters[characters.length - 1].id) {
        setSearchId(nextId.toString());
      } else {
        setPage(page + 1);
        setSearchId('');
      }
    } else if (currentIndex < characters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPage(page + 1); // Ir para a próxima página
    }
  };
  
  const handlePreviousCharacter = () => {
    if (singleCharacter) {
      const prevIndex = characters.findIndex(char => char.id === singleCharacter.id) - 1;
      if (prevIndex >= 0) {
        setSingleCharacter(characters[prevIndex]);
      } else {
        setSearchId('');
      }
    } else if (searchId) {
      const currentId = parseInt(searchId, 10);
      const prevId = currentId - 1;
      if (prevId >= characters[0].id) {
        setSearchId(prevId.toString());
      } else if (page > 1) {
        setPage(page - 1); // Ir para a página anterior
        setSearchId('');
      }
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (page > 1) {
      setPage(page - 1); // Ir para a página anterior
    }
  };
  ;
  
  
  
  
  
  
  

  const handleSearch = () => {
    if (searchId) {
      getCharacterById(searchId);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Rick and Morty" className="logo" />
      </header>
      <div className="search">
        <input
          type="text"
          placeholder="Enter character ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Pesquisar</button>
      </div>
      {singleCharacter ? (
        <div className="character">
          <div className="character-info">
            <h3>{singleCharacter.name}</h3>
            <img src={singleCharacter.image} alt={singleCharacter.name} />
          </div>
          <div className="character-details">
            <p><strong>Species:</strong> {singleCharacter.species}</p>
            <p><strong>Status:</strong> {singleCharacter.status}</p>
            <p><strong>Type:</strong> {singleCharacter.type || 'Unknown'}</p>
            <p><strong>Gender:</strong> {singleCharacter.gender}</p>
            <p><strong>Origin:</strong> {singleCharacter.origin.name}</p>
            <p><strong>Location:</strong> {singleCharacter.location.name}</p>
          </div>
        </div>
      ) : (
        characters.length > 0 && (
          <div className="character">
            <div className="character-info">
              <h3>{characters[currentIndex].name}</h3>
              <img src={characters[currentIndex].image} alt={characters[currentIndex].name} />
            </div>
            <div className="character-details">
              <p><strong>Species:</strong> {characters[currentIndex].species}</p>
              <p><strong>Status:</strong> {characters[currentIndex].status}</p>
              <p><strong>Type:</strong> {characters[currentIndex].type || 'Unknown'}</p>
              <p><strong>Gender:</strong> {characters[currentIndex].gender}</p>
              <p><strong>Origin:</strong> {characters[currentIndex].origin.name}</p>
              <p><strong>Location:</strong> {characters[currentIndex].location.name}</p>
            </div>
          </div>
        )
      )}
      <footer>
        <div className="navigation">
          <button
            onClick={handlePreviousCharacter}
            disabled={page === 1 && currentIndex === 0 && !searchId} // Desabilita o botão "Anterior" na primeira página e no primeiro personagem
          >
            Anterior
          </button>
          <button onClick={handleNextCharacter}>
            Próximo
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
