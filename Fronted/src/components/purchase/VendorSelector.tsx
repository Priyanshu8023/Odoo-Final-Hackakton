import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
  address?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
  profileImageURL?: string;
  vendorRefNo?: string;
  type: string[];
}

interface VendorSelectorProps {
  value?: string;
  onValueChange: (vendorId: string, vendor: Vendor) => void;
  placeholder?: string;
  disabled?: boolean;
  refreshTrigger?: number; // Add refresh trigger prop
}

export const VendorSelector = ({ 
  value, 
  onValueChange, 
  placeholder = "Select vendor...", 
  disabled = false,
  refreshTrigger
}: VendorSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchVendors = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const response = await apiClient.getVendors(search);
      if (response.success) {
        setVendors(response.data.vendors);
      } else {
        console.error('Failed to fetch vendors:', response);
        toast({
          title: "Error",
          description: response.message || "Failed to fetch vendors",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch vendors on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors, refreshTrigger]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== "") {
        fetchVendors(searchQuery);
      } else {
        fetchVendors();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchVendors]);

  const selectedVendor = vendors.find((vendor) => vendor._id === value);

  const handleSelect = (vendor: Vendor) => {
    onValueChange(vendor._id, vendor);
    setOpen(false);
  };

  const formatAddress = (address?: Vendor['address']) => {
    if (!address) return "";
    const parts = [address.city, address.state, address.pincode].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedVendor ? (
            <div className="flex items-center space-x-2">
              <span className="truncate">{selectedVendor.name}</span>
              {selectedVendor.email && (
                <span className="text-sm text-muted-foreground">
                  ({selectedVendor.email})
                </span>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search vendors..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading vendors...</CommandEmpty>
            ) : vendors.length === 0 ? (
              <CommandEmpty>No vendors found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {vendors.map((vendor) => (
                  <CommandItem
                    key={vendor._id}
                    value={vendor._id}
                    onSelect={() => handleSelect(vendor)}
                    className="flex flex-col items-start space-y-1 p-3"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === vendor._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {vendor.email && (
                            <div className="truncate">📧 {vendor.email}</div>
                          )}
                          {vendor.mobile && (
                            <div className="truncate">📱 {vendor.mobile}</div>
                          )}
                          {formatAddress(vendor.address) && (
                            <div className="truncate">📍 {formatAddress(vendor.address)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
