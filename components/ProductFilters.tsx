'use client';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { categories, products } from '@/types/data';
import { RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  className?: string;
  selectedCategory: string | null;
  selectedStyle: string | null;
  selectedMaterial: string | null;
  priceRange: [number, number];
  sortBy: string;
  onCategoryChange: (value: string | null) => void;
  onStyleChange: (value: string | null) => void;
  onMaterialChange: (value: string | null) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

const allStyles = [...new Set(products.map((p) => p.style))];
const allMaterials = [...new Set(products.map((p) => p.material))];

export default function ProductFilters({
  className,
  selectedCategory,
  selectedStyle,
  selectedMaterial,
  priceRange,
  sortBy,
  onCategoryChange,
  onStyleChange,
  onMaterialChange,
  onPriceRangeChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">分类</span>
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) =>
            onCategoryChange(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-36 text-sm">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">风格</span>
        <Select
          value={selectedStyle || 'all'}
          onValueChange={(value) =>
            onStyleChange(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-32 text-sm">
            <SelectValue placeholder="全部风格" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部风格</SelectItem>
            {allStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">材质</span>
        <Select
          value={selectedMaterial || 'all'}
          onValueChange={(value) =>
            onMaterialChange(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-36 text-sm">
            <SelectValue placeholder="全部材质" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部材质</SelectItem>
            {allMaterials.map((material) => (
              <SelectItem key={material} value={material}>
                {material}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">价格</span>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Slider
              min={0}
              max={5000}
              step={100}
              value={[priceRange[1]]}
              onValueChange={(value) =>
                onPriceRangeChange([priceRange[0], value[0]])
              }
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            ¥{priceRange[0]} - ¥{priceRange[1]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">排序</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-36 text-sm">
            <SelectValue placeholder="默认排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认排序</SelectItem>
            <SelectItem value="price-asc">价格从低到高</SelectItem>
            <SelectItem value="price-desc">价格从高到低</SelectItem>
            <SelectItem value="sales">销量优先</SelectItem>
            <SelectItem value="rating">评分优先</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="ml-auto"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        重置
      </Button>
    </div>
  );
}
