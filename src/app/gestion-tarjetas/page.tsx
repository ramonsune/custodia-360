"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, CreditCard, Shield, Star, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TarjetaPago {
  id: string;
  numero: string;
  nombre: string;
  mes: string;
  año: string;
  cvv: string;
  tipo: "visa" | "mastercard" | "american-express";
  predeterminada: boolean;
  fechaCreacion: Date;
}

export default function GestionTarjetas() {
  const [tarjetas, setTarjetas] = useState<TarjetaPago[]>([
    {
      id: "1",
      numero: "4532015112830366",
      nombre: "JUAN PÉREZ GARCÍA",
      mes: "12",
      año: "2026",
      cvv: "123",
      tipo: "visa",
      predeterminada: true,
      fechaCreacion: new Date("2023-01-15")
    },
    {
      id: "2",
      numero: "5555555555554444",
      nombre: "JUAN PÉREZ GARCÍA",
      mes: "09",
      año: "2025",
      cvv: "456",
      tipo: "mastercard",
      predeterminada: false,
      fechaCreacion: new Date("2023-06-20")
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tarjetaAEliminar, setTarjetaAEliminar] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const [formularioTarjeta, setFormularioTarjeta] = useState({
    numero: "",
    nombre: "",
    mes: "",
    año: "",
    cvv: "",
    tipo: "visa" as TarjetaPago["tipo"]
  });

  const formatearNumeroTarjeta = (numero: string): string => {
    return numero.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
  };

  const ocultarNumeroTarjeta = (numero: string): string => {
    const numeroLimpio = numero.replace(/\s/g, "");
    return `**** **** **** ${numeroLimpio.slice(-4)}`;
  };

  const obtenerColorTarjeta = (tipo: TarjetaPago["tipo"]): string => {
    switch (tipo) {
      case "visa":
        return "from-blue-500 to-blue-700";
      case "mastercard":
        return "from-red-500 to-orange-600";
      case "american-express":
        return "from-green-500 to-teal-600";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const validarFormulario = (): boolean => {
    if (!formularioTarjeta.numero || formularioTarjeta.numero.replace(/\s/g, "").length !== 16) {
      toast.error("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (!formularioTarjeta.nombre || formularioTarjeta.nombre.length < 3) {
      toast.error("El nombre del titular es requerido");
      return false;
    }
    if (!formularioTarjeta.mes || !formularioTarjeta.año) {
      toast.error("La fecha de vencimiento es requerida");
      return false;
    }
    if (!formularioTarjeta.cvv || formularioTarjeta.cvv.length !== 3) {
      toast.error("El CVV debe tener 3 dígitos");
      return false;
    }
    return true;
  };

  const agregarTarjeta = async () => {
    if (!validarFormulario()) return;

    setCargando(true);

    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const nuevaTarjeta: TarjetaPago = {
      id: Date.now().toString(),
      numero: formularioTarjeta.numero.replace(/\s/g, ""),
      nombre: formularioTarjeta.nombre.toUpperCase(),
      mes: formularioTarjeta.mes,
      año: formularioTarjeta.año,
      cvv: formularioTarjeta.cvv,
      tipo: formularioTarjeta.tipo,
      predeterminada: tarjetas.length === 0,
      fechaCreacion: new Date()
    };

    setTarjetas([...tarjetas, nuevaTarjeta]);
    setFormularioTarjeta({
      numero: "",
      nombre: "",
      mes: "",
      año: "",
      cvv: "",
      tipo: "visa"
    });
    setMostrarFormulario(false);
    setCargando(false);
    toast.success("Tarjeta agregada exitosamente");
  };

  const eliminarTarjeta = async (id: string) => {
    const tarjeta = tarjetas.find(t => t.id === id);
    if (tarjeta?.predeterminada && tarjetas.length > 1) {
      toast.error("No puedes eliminar la tarjeta predeterminada. Primero establece otra como predeterminada.");
      return;
    }

    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setTarjetas(tarjetas.filter(t => t.id !== id));
    setTarjetaAEliminar(null);
    setCargando(false);
    toast.success("Tarjeta eliminada exitosamente");
  };

  const establecerPredeterminada = async (id: string) => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setTarjetas(tarjetas.map(tarjeta => ({
      ...tarjeta,
      predeterminada: tarjeta.id === id
    })));
    setCargando(false);
    toast.success("Tarjeta predeterminada actualizada");
  };

  const generarAños = () => {
    const añoActual = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => añoActual + i);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Tarjetas
            </h1>
          </div>
          <p className="text-gray-600">
            Administra tus métodos de pago de manera segura y eficiente
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tarjetas</p>
                  <p className="text-2xl font-bold text-gray-900">{tarjetas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tarjetas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{tarjetas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Predeterminada</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón Agregar Tarjeta */}
        <div className="mb-8">
          <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nueva Tarjeta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Tarjeta</DialogTitle>
                <DialogDescription>
                  Ingresa los datos de tu nueva tarjeta de crédito o débito
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="numero">Número de Tarjeta</Label>
                  <Input
                    id="numero"
                    placeholder="1234 5678 9012 3456"
                    value={formatearNumeroTarjeta(formularioTarjeta.numero)}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                      if (valor.length <= 16) {
                        setFormularioTarjeta({...formularioTarjeta, numero: valor});
                      }
                    }}
                    maxLength={19}
                  />
                </div>

                <div>
                  <Label htmlFor="nombre">Nombre del Titular</Label>
                  <Input
                    id="nombre"
                    placeholder="JUAN PÉREZ GARCÍA"
                    value={formularioTarjeta.nombre}
                    onChange={(e) => setFormularioTarjeta({
                      ...formularioTarjeta,
                      nombre: e.target.value.toUpperCase()
                    })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mes">Mes</Label>
                    <Select value={formularioTarjeta.mes} onValueChange={(value) =>
                      setFormularioTarjeta({...formularioTarjeta, mes: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="año">Año</Label>
                    <Select value={formularioTarjeta.año} onValueChange={(value) =>
                      setFormularioTarjeta({...formularioTarjeta, año: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {generarAños().map(año => (
                          <SelectItem key={año} value={String(año)}>
                            {año}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formularioTarjeta.cvv}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, "");
                        if (valor.length <= 3) {
                          setFormularioTarjeta({...formularioTarjeta, cvv: valor});
                        }
                      }}
                      maxLength={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Tarjeta</Label>
                  <Select value={formularioTarjeta.tipo} onValueChange={(value: TarjetaPago["tipo"]) =>
                    setFormularioTarjeta({...formularioTarjeta, tipo: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="american-express">American Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button onClick={agregarTarjeta} disabled={cargando}>
                  {cargando ? "Procesando..." : "Agregar Tarjeta"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tarjetas.map((tarjeta) => (
            <Card key={tarjeta.id} className="relative overflow-hidden border-0 shadow-xl">
              {tarjeta.predeterminada && (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 z-10">
                  <Star className="h-3 w-3 mr-1" />
                  Predeterminada
                </Badge>
              )}

              {/* Tarjeta de Crédito Visual */}
              <div className={`relative h-48 bg-gradient-to-br ${obtenerColorTarjeta(tarjeta.tipo)} p-6 text-white`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-bold uppercase tracking-wider">
                      {tarjeta.tipo}
                    </div>
                    <CreditCard className="h-8 w-8 opacity-80" />
                  </div>

                  <div>
                    <div className="text-xl font-mono tracking-wider mb-2">
                      {ocultarNumeroTarjeta(tarjeta.numero)}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-80">TITULAR</div>
                        <div className="text-sm font-medium">{tarjeta.nombre}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">VENCE</div>
                        <div className="text-sm">{tarjeta.mes}/{tarjeta.año}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <CardContent className="p-4">
                <div className="flex gap-2">
                  {!tarjeta.predeterminada && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => establecerPredeterminada(tarjeta.id)}
                      disabled={cargando}
                      className="flex-1"
                    >
                      Hacer Predeterminada
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer.
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-900">
                              {ocultarNumeroTarjeta(tarjeta.numero)}
                            </div>
                            <div className="text-sm text-gray-600">{tarjeta.nombre}</div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancelar</Button>
                        <Button
                          variant="destructive"
                          onClick={() => eliminarTarjeta(tarjeta.id)}
                          disabled={cargando}
                        >
                          {cargando ? "Eliminando..." : "Eliminar Tarjeta"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tarjetas.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes tarjetas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Agrega tu primera tarjeta para comenzar a realizar pagos
            </p>
            <Button onClick={() => setMostrarFormulario(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Tarjeta
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
