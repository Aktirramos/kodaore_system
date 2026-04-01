"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SmartImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc: string;
};

export function SmartImage({ src, fallbackSrc, alt, onError, ...props }: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
}
