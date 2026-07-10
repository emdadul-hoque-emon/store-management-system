"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Barcode, X, PackageSearch, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { searchProducts, findByBarcode } from "@/lib/product-catalog";
import type { LineItem } from "@/types/invoice";
import { useDebounce } from "@/hooks/useDebounce";
import { serverFetch } from "@/lib/serverFetch";
import { InvoiceProduct, IProduct } from "@/types/product";
import { toast } from "sonner";

type LookupMode = "search" | "barcode";

interface ProductLookupProps {
  onAddItem: (item: InvoiceProduct) => void;
}

export function ProductLookup({ onAddItem }: ProductLookupProps) {
  const [mode, setMode] = useState<LookupMode>("barcode");
  const [query, setQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(query, 500);

  // Update search results as user types
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/v1/product?search=${debouncedSearch}&limit=5&page=1`,
        );
        const data = await res.json();
        setResults(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    if (debouncedSearch) {
      fetchProducts();
    }
  }, [debouncedSearch]);

  // Auto-focus  input when switching modes
  useEffect(() => {
    setTimeout(() => {
      if (mode === "barcode") {
        barcodeRef.current?.focus();
      } else {
        searchRef.current?.focus();
      }
    }, 50);
  }, [mode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectProduct = useCallback(
    (product: InvoiceProduct) => {
      onAddItem(product);
      // setLastAdded(product.id);
      setTimeout(() => setLastAdded(null), 1500);
      setQuery("");
      setIsOpen(false);
      searchRef.current?.focus();
    },
    [onAddItem],
  );

  const handleBarcodeSubmit = useCallback(async () => {
    const trimmed = barcodeInput.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/product/${trimmed}`,
      );
      const data = await res.json();
      console.log(data);
      onAddItem({
        ...data.data,
        price: Number(data.data.price),
        quantity: 1,
        total: Number(data.data.price),
      });
    } catch (error) {
      console.error("Error fetching product by barcode:", error);
      toast.error("Product not found for the given barcode.");
    }

    setBarcodeInput("");
    barcodeRef.current?.focus();
  }, [barcodeInput, onAddItem]);

  const handleBarcodeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBarcodeSubmit();
    }
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("barcode")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            mode === "barcode"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Barcode className="size-3" />
          Barcode
        </button>
        <button
          type="button"
          onClick={() => setMode("search")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            mode === "search"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Search className="size-3" />
          Search
        </button>
      </div>

      {/* Search mode */}
      {mode === "search" && (
        <div ref={containerRef} className="relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search by product name or category..."
              className="h-9 pl-8 pr-8 text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {isOpen && query && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {isLoading ? (
                <div>Searching Products...</div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <PackageSearch className="size-8 opacity-40" />
                  <p className="text-xs">
                    No products found for &quot;{query}&quot;
                  </p>
                </div>
              ) : (
                <ul className="max-h-60 overflow-y-auto divide-y divide-border">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // prevent blur before click
                          handleSelectProduct({
                            ...product,
                            quantity: 1,
                            total: product.price,
                          });
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors",
                          false ? "bg-accent" : "hover:bg-muted",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-semibold text-foreground w-16 text-right">
                            ${product.price}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Barcode mode */}
      {mode === "barcode" && (
        <div className="space-y-2">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                ref={barcodeRef}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeKey}
                placeholder="Scan or type barcode number, then press Enter..."
                className="h-9 pl-8 text-sm font-mono tracking-wide"
                autoComplete="off"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleBarcodeSubmit}
              disabled={!barcodeInput.trim()}
              className="h-9 px-4"
            >
              Add
            </Button>
          </div>
          {/* <p className="text-xs text-muted-foreground">
            Connect a barcode scanner or type the barcode number manually. Press{" "}
            <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to add.
          </p> */}
          {/* Demo barcodes for quick testing */}
          {/* <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground self-center">
              Try:
            </span>
            {["8901234567890", "8901234567895", "7501234567891"].map((bc) => (
              <button
                key={bc}
                type="button"
                onClick={() => {
                  setBarcodeInput(bc);
                  barcodeRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded bg-muted hover:bg-accent text-xs font-mono text-muted-foreground hover:text-accent-foreground transition-colors border border-border"
              >
                {bc}
              </button>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}
