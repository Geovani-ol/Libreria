import { useState } from "react";
import BookCard from "./BookCard";

export default function BookCarousel({ books, title = "Libros Relacionados" }) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const cardWidth = 280; // Approximate width of a book card including gap
    const visibleCards = 4; // Number of cards to scroll

    const canScrollLeft = scrollPosition > 0;
    const canScrollRight = scrollPosition < books.length - visibleCards;

    const scrollLeft = () => {
        setScrollPosition(Math.max(0, scrollPosition - visibleCards));
    };

    const scrollRight = () => {
        setScrollPosition(Math.min(books.length - visibleCards, scrollPosition + visibleCards));
    };

    if (!books || books.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full transition-colors ${canScrollLeft
                            ? 'bg-accent text-white hover:bg-blue-950'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Anterior"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full transition-colors ${canScrollRight
                            ? 'bg-accent text-white hover:bg-blue-950'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Siguiente"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden relative">
                <div
                    className="flex gap-6 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${scrollPosition * cardWidth}px)` }}
                >
                    {books.map(book => (
                        <div key={book.id} className="shrink-0 w-64">
                            <BookCard book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
