"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/types/image";
import { Input } from "../ui/input";
import imageUrlFormatter from "@/lib/imageUrlFormatter";
import Image from "next/image";
import { UploadIcon, XIcon } from "lucide-react";


interface SingleImageUploadProps {
    image: ImageUpload | null;
    onImageChangeAction: (image: ImageUpload) => void;
    urlFormatter: (image: ImageUpload) => string;
    buttonName: string;
    displayWidth: string;
    inputId?: string;
}


export function SingleImageUpload({
    image,
    onImageChangeAction,
    urlFormatter,
    buttonName,
    displayWidth,
    inputId,
}: SingleImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (image) {
            setPreviewUrl(urlFormatter(image));
        } else {
            setPreviewUrl(null);
        }
    }, [image, urlFormatter]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newImage: ImageUpload = {
            id: `${Date.now()}-${file.name}`,
            file,
            url: URL.createObjectURL(file),
            alt: image?.alt || "",
        };

        onImageChangeAction(newImage);
    };
    const handleRemove = () => {
        setPreviewUrl(null);
        onImageChangeAction({
            id: "",
            url: "",
            alt: "",
        });
    };
    return (
        <div className="flex flex-col gap-4">
            {previewUrl ? (
                <div className="relative">
                    <div className={`bg-accent rounded-lg overflow-hidden ${displayWidth}`}>
                        <Image
                            src={previewUrl}
                            alt={image?.alt || "No image yet"}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="link"
                        onClick={handleRemove}
                        className="absolute top-2 right-2  text-foreground"
                    >
                        <XIcon />
                    </Button>
                </div>
            ) : (
                <div> </div>
            )}
            <Input
                type="file"
                accept="image/*"
                id={inputId}
                className="hidden"
                onChange={handleFileChange}
            />

            <label htmlFor={inputId}>
                <Button type="button" variant="default" asChild>
                    <span className="flex items-center gap-2 cursor-pointer">
                        <UploadIcon size={16} />
                        {buttonName}
                    </span>
                </Button>
            </label>
        </div>
    );
}