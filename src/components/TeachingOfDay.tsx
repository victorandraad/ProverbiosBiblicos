import { useEffect, useState, useRef } from 'react'
import { BibleVerse } from '../models/BibleVerse';
import { getMultipleBibleVerses } from '../api/bibleApi';
import './TeachingOfDay.css';
import { defaultProverbs, shuffleArray } from '../data/defaultProverbs';

const SlowDownMessage = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 2500);
    return;
  }, [onClose]);

  return (
    <div className="slow-down-message">
      <div className="slow-down-content">
        <div className="slow-down-icon">⏱️</div>
        <h3>Devagar, amigo!</h3>
        <p>Leia com calma. Cada versículo merece sua atenção e reflexão.</p>
        <p className="slow-down-subtitle">A sabedoria vem com a meditação, não com a pressa.</p>
      </div>
    </div>
  );
};

const InteractiveLoading = () => {
  const [loadingText, setLoadingText] = useState('Buscando palavra de sabedoria');
  const dotsRef = useRef(0);

  useEffect(() => {
    setInterval(() => {
      dotsRef.current = (dotsRef.current + 1) % 4;
      const dots = '.'.repeat(dotsRef.current);
      setLoadingText(`Buscando palavra de sabedoria${dots}`);
    }, 500);

    return;
  }, []);

  return (
    <div className="loading-container interactive-loading">
      <div className="loading-animation">
        <div className="loading-book">📖</div>
        <div className="loading-pulse"></div>
      </div>
      <p className="loading-text">{loadingText}</p>
      <p className="loading-subtitle">Aguarde enquanto buscamos versículos especiais para você...</p>
    </div>
  );
};

const TeachingOfDay = () => {
  const [todaysTeaching, setTodaysTeaching] = useState<BibleVerse | null>(null);
  const [verseQueue, setVerseQueue] = useState<BibleVerse[]>([]);
  const [lastClickTime, setLastClickTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [showSlowDown, setShowSlowDown] = useState<boolean>(false);

  const loadInitialVerses = async () => {
    setIsLoading(true);
    
    try {
      const [fetch1, fetch2] = await Promise.all([
        getMultipleBibleVerses(1),
        getMultipleBibleVerses(1)
      ]);
      
      const allVerses = [...defaultProverbs, ...fetch1, ...fetch2];
      const shuffledVerses = shuffleArray(allVerses);
      
      setTodaysTeaching(shuffledVerses[0]);
      setVerseQueue(shuffledVerses.slice(1));
    } catch (err) {
      console.warn('Erro ao carregar versículos, usando apenas padrões:', err);
      const shuffledDefault = shuffleArray(defaultProverbs);
      setTodaysTeaching(shuffledDefault[0]);
      setVerseQueue(shuffledDefault.slice(1));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialVerses();
  }, []);

  useEffect(() => {
    fetchNewTeaching();
  }, [lastClickTime]);

  const fetchNewTeaching = async () => {
    try {
      const bibleVerses = await getMultipleBibleVerses(2);
      setVerseQueue(prev => {
        const newQueue = [...prev, ...bibleVerses];
        return shuffleArray(newQueue);
      });
    } catch (err) {
      console.warn('Erro ao buscar novos versículos:', err);
    }
  };

  const handleNextVerse = async () => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 3000) {
      setShowSlowDown(true);
      return;
    }
    
    if (verseQueue.length > 0) {
      setLastClickTime(currentTime);
      setTodaysTeaching(verseQueue[0]);
      setVerseQueue(prev => {
        const newQueue = prev.slice(1);
        return shuffleArray(newQueue);
      });
    } else {
      setIsLoading(true);
      await fetchNewTeaching();
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <InteractiveLoading />;
  }
  if (!todaysTeaching) {
    return (
      <div className="no-teaching-container">
        <p>Nenhum ensinamento disponível no momento.</p>
        <button className="btn-primary" onClick={loadInitialVerses}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  const verseText = todaysTeaching.verses.map(verse => verse.text).join(' ');
  const bookName = todaysTeaching.verses[0]?.book_name || 'Bíblia';

  return (
    <>
      {showSlowDown && <SlowDownMessage onClose={() => setShowSlowDown(false)} />}
      
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
            disabled={verseQueue.length === 0}
          >
            {verseQueue.length === 0 ? 'Carregar mais versículos' : 'Próximo versículo'}
          </button>
          {verseQueue.length > 0 && (
            <div className="verse-queue-indicator">
              {verseQueue.length} versículo{verseQueue.length > 1 ? 's' : ''} pronto{verseQueue.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeachingOfDay;