import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from './button';
import { Icon } from './icons';
import { Typography } from './typography';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onQuantityChange,
    min = 1,
    max,
    disabled = false,
    label,
    className,
}) => {
    const handleDecrease = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        } else if (min === 0 && quantity > 0) {
            // Allow going to 0 if min is 0
            onQuantityChange(0);
        }
    };

    const handleIncrease = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if (!max || quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    return (
        <div className={className}>
            {label && (
                <Typography variant="body2" gutterBottom>
                    {label}
                </Typography>
            )}
            <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden h-10">
                <Button
                    onClick={handleDecrease}
                    variant="ghost"
                    size="sm"
                    iconOnly
                    disabled={disabled || (min === 0 ? quantity <= 0 : quantity <= min)}
                    className="rounded-none border-0 hover:bg-gray-100 h-full min-w-[2.5rem] flex items-center justify-center"
                >
                    <Icon icon={Minus} size="sm" color="primary" />
                </Button>
                <div className="flex items-center justify-center min-w-[3rem] px-3 h-full border-x border-gray-200">
                    <Typography 
                        variant="h6" 
                        className="text-center font-semibold"
                    >
                        {quantity}
                    </Typography>
                </div>
                <Button
                    onClick={handleIncrease}
                    variant="ghost"
                    size="sm"
                    iconOnly
                    disabled={disabled || (max ? quantity >= max : false)}
                    className="rounded-none border-0 hover:bg-gray-100 h-full min-w-[2.5rem] flex items-center justify-center"
                >
                    <Icon icon={Plus} size="sm" color="primary" />
                </Button>
            </div>
        </div>
    );
};

