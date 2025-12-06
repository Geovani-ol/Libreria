export default function BookCard({ book }) {
    return (
        <article className="group cursor-pointer transition-all duration-300 hover:scale-105">
            <a href={`/book/${book.id}`} className="block h-full">
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                    {/* Imagen del libro */}
                    <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
                        <img
                            src={book.image}
                            alt={`Portada de ${book.title}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            data-astro-transition-name={`book-image-${book.id}`}
                        />
                        {book.discount && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                -{book.discount}%
                            </span>
                        )}
                    </div>

                    {/* Información del libro */}
                    <div className="p-4 flex flex-col grow">
                        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                            {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                            {book.author}
                        </p>

                        {/* Precio */}
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                    ${book.price.toFixed(2)}
                                </span>
                                {book.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ${book.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}
