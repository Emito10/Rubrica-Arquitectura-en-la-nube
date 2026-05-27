import "./App.css";
import { useEffect, useState } from "react";
import { PlusIcon, PackageIcon, TriangleAlertIcon } from "lucide-react";
import useProductStore from "@/store/useProductStore";
import type { Product, ProductFormData } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductTable } from "@/components/inventory/ProductTable";
import { ProductFormDialog } from "@/components/inventory/ProductFormDialog";
import { ConfirmDeleteDialog } from "@/components/inventory/ConfirmDeleteDialog";

function App() {
  const {
    productos,
    loading,
    error,
    obtenerProductos,
    guardarProducto,
    eliminarProducto,
  } = useProductStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  useEffect(() => {
    if (error) setErrorMsg(error);
  }, [error]);

  async function handleSave(data: ProductFormData) {
    const editando = editingProduct !== null;
    const idProducto = editingProduct?.product_id;
    const ok = await guardarProducto(data, editando, idProducto);
    if (!ok) setErrorMsg("Error al guardar el producto");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await eliminarProducto(deleteTarget.product_id);
    setDeleteTarget(null);
  }

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProduct(null);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-6 p-4 pt-8 sm:p-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PackageIcon className="size-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-medium">Inventario</h1>
            <p className="text-sm text-muted-foreground">
              {productos.length} producto{productos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Button onClick={openCreate}>
          <PlusIcon />
          Nuevo producto
        </Button>
      </header>

      <Separator />

      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlertIcon className="size-4 shrink-0" />
          <span>{errorMsg}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="ml-auto"
            onClick={() => setErrorMsg(null)}
          >
            <span className="sr-only">Cerrar</span>
            <TriangleAlertIcon className="size-3" />
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable
            productos={productos as Product[]}
            loading={loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </CardContent>
      </Card>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
          else setFormOpen(true);
        }}
        onSubmit={handleSave}
        product={editingProduct}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        productName={deleteTarget?.name ?? ""}
      />
    </div>
  );
}

export default App;
