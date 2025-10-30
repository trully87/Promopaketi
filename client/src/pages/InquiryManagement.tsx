import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Phone, Building2, Package, Hash } from "lucide-react";
import { format } from "date-fns";
import type { Inquiry } from "@shared/schema";

export default function InquiryManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/inquiries/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      toast({
        title: "Uspješno",
        description: "Status upita je ažuriran",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Greška",
        description: error.message || "Greška prilikom ažuriranja statusa",
        variant: "destructive",
      });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "read":
        return "secondary";
      case "resolved":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Novo";
      case "read":
        return "Pročitano";
      case "resolved":
        return "Riješeno";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Upiti</h1>
                <p className="text-sm text-muted-foreground">
                  Pregled svih upita klijenata
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              Svi upiti ({inquiries?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Učitavanje...
              </div>
            ) : !inquiries || inquiries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nema upita
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Ime</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Kompanija</TableHead>
                      <TableHead>Detalji</TableHead>
                      <TableHead>Poruka</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(inquiry.createdAt), "dd.MM.yyyy HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {inquiry.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={`mailto:${inquiry.email}`}
                                className="text-primary hover:underline"
                                data-testid={`link-email-${inquiry.id}`}
                              >
                                {inquiry.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={`tel:${inquiry.phone}`}
                                className="text-primary hover:underline"
                                data-testid={`link-phone-${inquiry.id}`}
                              >
                                {inquiry.phone}
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {inquiry.company ? (
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{inquiry.company}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            {inquiry.packageType && (
                              <div className="flex items-center gap-1.5">
                                <Package className="h-3 w-3 text-muted-foreground" />
                                <span>{inquiry.packageType}</span>
                              </div>
                            )}
                            {inquiry.quantity && (
                              <div className="flex items-center gap-1.5">
                                <Hash className="h-3 w-3 text-muted-foreground" />
                                <span>{inquiry.quantity}</span>
                              </div>
                            )}
                            {!inquiry.packageType && !inquiry.quantity && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm line-clamp-2" title={inquiry.message}>
                            {inquiry.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={inquiry.status}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({ id: inquiry.id, status: value })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger
                              className="w-32"
                              data-testid={`select-status-${inquiry.id}`}
                            >
                              <SelectValue>
                                <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                                  {getStatusLabel(inquiry.status)}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">
                                <Badge variant="default">Novo</Badge>
                              </SelectItem>
                              <SelectItem value="read">
                                <Badge variant="secondary">Pročitano</Badge>
                              </SelectItem>
                              <SelectItem value="resolved">
                                <Badge variant="outline">Riješeno</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
