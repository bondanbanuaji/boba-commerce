import { useState } from 'react';
import { cn } from '@lib/utils';

interface ProductGalleryProps {
    images: string[]; // Array of image URLs
    name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    // Fallback if no images
    const displayImages = images.length > 0 ? images : ['/placeholder.png'];

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {displayImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                            selectedImage === index
                                ? "border-boba-primary ring-2 ring-boba-primary/20"
                                : "border-transparent hover:border-gray-200"
                        )}
                    >
                        <img
                            src={image}
                            alt={`${name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-square bg-white rounded-2xl overflow-hidden shadow-sm relative group">
                <img
                    src={displayImages[selectedImage]}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        </div>
    );
}
