import Image from "next/image";
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
    item: {
        id: string;
        quantity: number;
        property: {
            id: string;
            name: string;
            price: number;
            images: string[];
            onSale?: boolean;
            salePrice?: number;
        };
    };
    updateQuantity: (propertyId: string, quantity: number) => void;
    removeFromCart: (propertyId: string) => void;
}

export default function CartItem({ item, updateQuantity, removeFromCart }: CartItemProps) {
    const unitPrice = item.property.price;
    const totalPriceForItem = unitPrice * item.quantity;

    return (
        <div className="flex gap-4 py-4 border-b border-gray-200">
            <div className="relative w-15 h-15">
                <Image
                    src={imageUrlFormatter(item.property.images[0])}
                    alt={item.property.name}
                    fill
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex-1 flex justify-between items-center">
                <div>
                    <h3 className="font-medium">{item.property.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {unitPrice.toLocaleString()} € x {item.quantity} = {totalPriceForItem.toLocaleString()} €
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.property.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.property.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.property.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}