import { useEffect, useState } from 'react'
import { BibleVerse } from '../models/BibleVerse';
import { getMultipleBibleVerses } from '../api/bibleApi';
import './TeachingOfDay.css';
import { defaultProverbs } from '../data/defaultProverbs';

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

const TeachingOfDay = () => {
  const [todaysTeaching, setTodaysTeaching] = useState<BibleVerse | null>(defaultProverbs[0]);
  const [verseQueue, setVerseQueue] = useState<BibleVerse[]>(defaultProverbs.slice(1));
  const [lastClickTime, setLastClickTime] = useState<number>(new Date().getSeconds());
  const [isLoading, setIsLoading] = useState(false);
  const [showSlowDown, setShowSlowDown] = useState<boolean>(false);

  const fetchNewTeaching = async () => {
    const bibleVerses = await getMultipleBibleVerses(2);
    setVerseQueue(prev => [...prev, ...bibleVerses]);
  };

  useEffect(() => {
    fetchNewTeaching();
  }, [lastClickTime]);

  const handleNextVerse = async () => {
    const currentTime = new Date().getSeconds();
    console.log(currentTime, lastClickTime);
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 5) {
      setShowSlowDown(true);
      return;
    }
    
    if (verseQueue.length > 0) {
      setLastClickTime(currentTime);
      setTodaysTeaching(verseQueue[0]);
      setVerseQueue(verseQueue.slice(1));
    } else {
      setIsLoading(true);
      await fetchNewTeaching();
      setIsLoading(false);
    }
  };

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
        <button className="btn-primary" onClick={() => fetchNewTeaching()}>
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