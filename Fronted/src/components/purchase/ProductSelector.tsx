import React, { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  type: string;
  sales_price: number;
  purchase_price: number;
  hsn_code?: string;
  category_name?: string;
  sale_tax_id?: string;
  sale_tax_name?: string;
  sale_tax_rate?: number;
  purchase_tax_id?: string;
  purchase_tax_name?: string;
  purchase_tax_rate?: number;
  created_at: string;
}

interface ProductSelectorProps {
  value: string;
  onSelect: (productId: string, product: Product) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  value,
  onSelect,
  onClear,
  placeholder = "Select product...",
  disabled = false,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, refreshProducts, productsLoading } = useData();
  const { toast } = useToast();

  // Refresh products when component mounts
  useEffect(() => {
    if (products.length === 0 && !productsLoading) {
      refreshProducts();
    }
  }, [products.length, productsLoading, refreshProducts]);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.hsn_code && product.hsn_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.category_name && product.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Find selected product
  const selectedProduct = products.find(product => product.id === value);

  const handleSelect = useCallback((product: Product) => {
    onSelect(product.id, product);
    setOpen(false);
    setSearchQuery('');
  }, [onSelect]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    setSearchQuery('');
  }, [onClear]);

  const handleRefresh = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await refreshProducts();
      toast({
        title: "Refreshed",
        description: `Loaded ${products.length} products`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh products",
        variant: "destructive",
      });
    }
  }, [refreshProducts, products.length, toast]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedProduct && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedProduct ? (
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{selectedProduct.name}</span>
              <div className="flex items-center space-x-1 ml-2">
                {onClear && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span>{placeholder}</span>
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  disabled={productsLoading}
                >
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {productsLoading ? "Loading products..." : "No products found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <div className="text-sm text-muted-foreground">
                      <span>Purchase: ₹{product.purchase_price}</span>
                      {product.purchase_tax_name && (
                        <span className="ml-2">
                          | Tax: {product.purchase_tax_name} ({product.purchase_tax_rate}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
