import { useEffect, useState, useCallback } from 'react'
import { BibleVerse } from '../models/BibleVerse';
import { getMultipleBibleVerses } from '../api/bibleApi';
import './TeachingOfDay.css';

const TeachingOfDay = () => {
  const [todaysTeaching, setTodaysTeaching] = useState<BibleVerse | null>(null);
  const [verseQueue, setVerseQueue] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreVerses = useCallback(async () => {
    setIsLoadingMore(true);
    
    while (true) {
      try {
        const verses = await getMultipleBibleVerses(3);
        setVerseQueue(prev => [...prev, ...verses]);
        setIsLoadingMore(false);
        return;
      } catch (err) {
        console.warn('Erro ao carregar versículos em background, tentando novamente...', err);
        // Aguarda um pouco antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }, []);

  const fetchNewTeaching = useCallback(async () => {
    let retries = 0;
    const maxRetries = 5;
    
    setIsLoading(true);
    
    while (retries < maxRetries) {
      try {
        // Carrega 3 novos versículos
        const verses = await getMultipleBibleVerses(3);
        
        // Define o primeiro como o atual
        setTodaysTeaching(verses[0]);
        
        // Mantém os outros na fila para próximas requisições
        if (verses.length > 1) {
          setVerseQueue(verses.slice(1));
        } else {
          setVerseQueue([]);
        }
        
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn(`Erro ao buscar versículos (tentativa ${retries + 1}/${maxRetries}):`, err);
        retries++;
        // Aguarda um pouco antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Se esgotou todas as tentativas, continua tentando até conseguir
    while (true) {
      try {
        const verses = await getMultipleBibleVerses(3);
        setTodaysTeaching(verses[0]);
        if (verses.length > 1) {
          setVerseQueue(verses.slice(1));
        } else {
          setVerseQueue([]);
        }
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('Erro ao buscar versículos, tentando novamente...', err);
        // Aguarda um pouco antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }, []);

  useEffect(() => {
    fetchNewTeaching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextVerse = () => {
    setVerseQueue(prev => {
      if (prev.length > 0) {
        // Usa o próximo da fila
        const nextVerse = prev[0];
        const newQueue = prev.slice(1);
        setTodaysTeaching(nextVerse);
        
        // Se a fila está ficando baixa (1 ou menos), carrega mais em background
        if (newQueue.length <= 1) {
          loadMoreVerses();
        }
        
        return newQueue;
      } else {
        // Se não tem na fila, busca novos
        fetchNewTeaching();
        return prev;
      }
    });
  };

  // Não mostra erro ao usuário, apenas continua tentando

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!todaysTeaching) {
    return (
      <div className="no-teaching-container">
        <p>Nenhum ensinamento disponível no momento.</p>
        <button className="btn-primary" onClick={fetchNewTeaching}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  const verseText = todaysTeaching.verses.map(verse => verse.text).join(' ');
  const bookName = todaysTeaching.verses[0]?.book_name || 'Bíblia';

  return (
    <div className="teaching-container">
      <div className="verse-header">
        <div className="verse-number">{todaysTeaching.reference}</div>
        <div className="book-name">{bookName}</div>
      </div>
      
      <div className="verse-content">
        <blockquote className="verse-text">
          {verseText}
        </blockquote>
      </div>

      <div className="verse-footer">
        <div className="verse-reference">{todaysTeaching.reference}</div>
        <button 
          className="btn-primary btn-new-verse" 
          onClick={handleNextVerse}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'Carregando...' : 'Próximo Versículo'}
        </button>
        {verseQueue.length > 0 && (
          <div className="verse-queue-indicator">
            {verseQueue.length} versículo{verseQueue.length > 1 ? 's' : ''} pronto{verseQueue.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingOfDay;