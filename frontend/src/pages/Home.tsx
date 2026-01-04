import React, { useState } from 'react';

const features = [
    {
        id: 1,
        title: 'Примерить разные образы',
        subtitle: 'с помощью фильтров с переносом лица',
        badge: 'Создайте видео с образом',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format',
    },
    {
        id: 2,
        title: 'Нарисовать картинку',
        subtitle: 'в разных стилях с помощью Kandinsky',
        badge: 'AI Генерация',
        image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format',
    },
    {
        id: 3,
        title: 'Написать текст',
        subtitle: 'статьи, письма, резюме и многое другое',
        badge: 'Текстовый помощник',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format',
    },
];

const Home: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    return (
        <div className="home">
            <h1 className="page-title">Функции</h1>

            <div className="chips">
                <button
                    className={`chip ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    Все
                </button>
                <button
                    className={`chip ${activeFilter === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('favorites')}
                >
                    Избранные
                </button>
            </div>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div
                        key={feature.id}
                        className="feature-card animate-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <img src={feature.image} alt={feature.title} />
                        <div className="feature-card-overlay">
                            <h3>{feature.title}</h3>
                            <p>{feature.subtitle}</p>
                        </div>
                        <span className="feature-card-badge">{feature.badge}</span>
                        <button className="feature-card-favorite">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
        .home {
          padding: 1rem;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .features-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
      `}</style>
        </div>
    );
};

export default Home;
