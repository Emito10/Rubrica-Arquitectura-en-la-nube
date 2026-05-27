import { PencilIcon, Trash2Icon, PackageOpenIcon } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

interface ProductTableProps {
  productos: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
      <PackageOpenIcon className="size-12" />
      <p className="text-base font-medium">No hay productos</p>
      <p className="text-sm">Agregá tu primer producto para empezar</p>
    </div>
  );
}

export function ProductTable({ productos, loading, onEdit, onDelete }: ProductTableProps) {
  if (loading) return <LoadingSkeleton />;
  if (productos.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Nombre</TableHead>
          <TableHead className="hidden md:table-cell">Descripción</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead className="w-[80px] text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.map((producto) => (
          <TableRow key={producto._id}>
            <TableCell className="font-medium">{producto.name}</TableCell>
            <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">
              {producto.description || "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {currencyFormatter.format(producto.price)}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={producto.stock === 0 ? "destructive" : "secondary"}
                className="tabular-nums"
              >
                {producto.stock}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(producto)}
                >
                  <PencilIcon />
                  <span className="sr-only">Editar {producto.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(producto)}
                >
                  <Trash2Icon className="text-destructive" />
                  <span className="sr-only">Eliminar {producto.name}</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
