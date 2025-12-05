const categorias = {
    "Fantasía": "Fantasy",
    "Ciencia ficción": "Science Fiction",
};

export default function Catalogo() {
    return (
        <main className="flex flex-wrap gap-5 px-25 py-10">
            <section className="w-1/6">
                <h2 className="font-medium mb-5 text-lg">Filtros</h2>
                <hr className="border-gray-200" />
                <h2 className="my-5 font-medium">Categoría</h2>
                <fieldset className="border-none">
                    <div className="flex flex-col gap-2">
                        {Object.entries(categorias).map(([categoria]) => (
                            <label key={categoria} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="categoria"
                                    value={categoria}
                                    className="peer sr-only"
                                />
                                <span className="block px-4 py-2 rounded-md transition-colors peer-checked:bg-gray-200 peer-checked:text-accent hover:bg-gray-100">
                                    {categoria}
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </section>
            <section className="">
                <h1  className="text-2xl font-medium">Explora Nuestro Catálogo de Libros</h1>
            </section>
        </main>
    );
}