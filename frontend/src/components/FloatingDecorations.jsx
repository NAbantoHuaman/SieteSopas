export const FloatingDecorations = () => {
  return (
    <>
      {/* Decoración Izquierda flotante (Sopa) */}
      <div className="fixed left-[2%] top-1/2 -translate-y-1/2 w-44 md:w-52 lg:w-[18rem] opacity-70 pointer-events-none animate-float hidden lg:block z-0">
        <img src="/images/siete_sopas/sopa_criolla_original.png" alt="Sopa Criolla" className="w-full h-auto object-contain drop-shadow-2xl" />
      </div>

      {/* Decoración Derecha flotante (Pan/Calientito) */}
      <div className="fixed right-[2%] top-1/2 -translate-y-1/2 w-36 md:w-44 lg:w-[15rem] opacity-70 pointer-events-none animate-float-reverse hidden lg:block z-0">
        <img src="/images/siete_sopas/Pan.png" alt="Decoración Derecha" className="w-full h-auto object-contain drop-shadow-2xl" />
      </div>
    </>
  );
};
