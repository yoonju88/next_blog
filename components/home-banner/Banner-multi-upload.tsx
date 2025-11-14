"use client"
import { Button } from "../ui/button";
import { useRef } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
// npm i @hello-pangea/dnd
import Image from "next/image";
import { Badge } from "../ui/badge";
import { MoveIcon, XIcon } from "lucide-react";
import { ImageUpload } from "@/types/image";
import { Input } from "../ui/input";

type Props = {
    images?: ImageUpload[];
    onImagesChangeAction: (images: ImageUpload[]) => void;
    urlFormatterAction: (image: ImageUpload) => string;
    buttonName: string;
    displayWidth: string;
    inputId: string;
    name: string;
}

export default function BannerMultiImageUpload({
    images = [],
    onImagesChangeAction,
    urlFormatterAction,
    buttonName,
    displayWidth,
    inputId,
    name

}: Props
) {

    const uploadInputRef = useRef<HTMLInputElement | null>(null)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newImages: ImageUpload[] = files.map((file, i) => {
            return {
                id: `${Date.now()}-${i}-${file.name}`,
                url: URL.createObjectURL(file),
                alt: "",
                file
            }
        })
        onImagesChangeAction([...images, ...newImages])
    }
    // 이미지를 드랙 하여 순서를 변경
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) { return };

        const items = Array.from(images) // 현재 이미지 목록 복사
        const [reorderImages] = items.splice(result.source.index, 1) // 드레그 된 이미지 제거   
        items.splice(result.destination.index, 0, reorderImages) // 새로운 위치에 이미지 추가
        onImagesChangeAction(items) // 변경되 이미지 목록 업데이트
    }
    // 이미지 업로드 리스트에서 삭제
    const handleDelete = (id: string) => {
        const updatedImages = images.filter((image) => image.id !== id)
        onImagesChangeAction(updatedImages)
    }

    const handleAltChange = (id: string, alt: string) => {
        const updatedImages = images.map((image) =>
            image.id === id ? { ...image, alt } : image
        )
        onImagesChangeAction(updatedImages)
    }

    return (
        <div className="w-full max-x-3xl m-auto p-4">
            <input
                type='file'
                id={inputId}
                name={name}
                ref={uploadInputRef}
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
            />
            <Button
                type="button"
                onClick={() => uploadInputRef?.current?.click()}
                className="w-full"
                variant="outline"
            >
                {buttonName}
            </Button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                    droppableId="property-images"
                    direction="horizontal"
                >
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {images.map((image, index) => {
                                const formattedUrl = urlFormatterAction(image);
                                //console.log("🔍 Formatted image URL:", formattedUrl); // ✅ 요기!
                                return (
                                    < Draggable
                                        key={image.id}
                                        draggableId={image.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                className="relative p-2"
                                            >
                                                <div className="bg-gray-100  rounded-lg flex items-center overflow-hidden gap-4 mt-6">
                                                    <div className={`${displayWidth} relative`}>
                                                        <Image
                                                            src={formattedUrl}
                                                            alt={image.alt || `Image ${index + 1}`}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 absolute bottom-6 left-10">
                                                        <p className="text-sm text-primary font-semibold">
                                                            Image {index + 1}
                                                        </p>
                                                        {index === 0 &&
                                                            <Badge variant="primary">
                                                                Main
                                                            </Badge>
                                                        }
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter alt text..."
                                                            value={image.alt || ""}
                                                            onChange={(e) => handleAltChange(image.id, e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 absolute top-14 right-8">
                                                        <button

                                                            className="text-orange-500 hover:scale-105 transition-all duration-300"
                                                            onClick={() => handleDelete(image.id)}>
                                                            <XIcon />
                                                        </button>
                                                        <div className="text-blue-400 hover:scale-105 transition-all duration-300">
                                                            <MoveIcon />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div >
    )
}
