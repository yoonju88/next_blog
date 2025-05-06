"use client"
import { Button } from "./ui/button";
import { useRef } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
// npm i @hello-pangea/dnd
import Image from "next/image";
import { Badge } from "./ui/badge";
import { MoveIcon, XIcon } from "lucide-react";

export type ImageUpload = {
    id: string;
    url: string;
    file?: File;
}

type Props = {
    images?: ImageUpload[];
    onImagesChangeAction: (images: ImageUpload[]) => void;
    urlFormatter: (image: ImageUpload) => string;
}

export default function MultiImageUpload({
    images = [],
    onImagesChangeAction,
    urlFormatter
}: Props
) {

    const uploadInputRef = useRef<HTMLInputElement | null>(null)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newImages = files.map((file, i) => {
            return {
                id: `${Date.now()}-${i}-${file.name}`,
                url: URL.createObjectURL(file),
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
    const handleDelete = (id: string) => {
        const updatedImages = images.filter((image) => image.id !== id)
        onImagesChangeAction(updatedImages)
    }

    return (
        <div className="w-full max-x-3xl m-auto p-4">
            <input
                type='file'
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
                Upload Images
            </Button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                    droppableId="property-images"
                    direction="vertical"
                >
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {images.map((image, index) => (
                                <Draggable
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
                                            <div className="bg-gray-100 rounded-lg flex items-center overflow-hidden gap-4">
                                                <div className="size-16 relative">
                                                    <Image
                                                        src={urlFormatter ? urlFormatter(image) : image.url}
                                                        alt={`item image${index}`}
                                                        fill
                                                        className='object-cover'
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-xm font-medium">
                                                        Image {index + 1}
                                                    </p>
                                                    {index === 0 &&
                                                        <Badge variant="primary">
                                                            Main
                                                        </Badge>
                                                    }
                                                </div>
                                                <div className="flex items-center p-4">
                                                    <button
                                                        className="text-orange-500 p-2"
                                                        onClick={() => handleDelete(image.id)}>
                                                        <XIcon />
                                                    </button>
                                                    <div className="text-blue-400">
                                                        <MoveIcon />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
