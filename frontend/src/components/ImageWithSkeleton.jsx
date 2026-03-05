import { useState } from 'react';

export const ImageWithSkeleton = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className} ${!loaded ? 'bg-gray-800 animate-pulse' : ''}`}>
       <img
         src={src}
         alt={alt}
         className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
         onLoad={() => setLoaded(true)}
       />
    </div>
  );
};
