import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import type { NewsletterSubscriber } from "@shared/schema";

export default function NewsletterSubscribers() {
  const [, setLocation] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: subscribers = [], isLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/newsletter-subscribers"],
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Newsletter Pretplatnici</h1>
            <p className="text-muted-foreground mt-1">Lista svih email pretplatnika na newsletter</p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/admin')} data-testid="button-back">
            Nazad
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Lista ({subscribers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8" data-testid="text-loading">Učitavanje...</div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-empty">
                Nema pretplatnika
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum Pretplate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                        <TableCell className="font-medium" data-testid={`text-email-${subscriber.id}`}>
                          {subscriber.email}
                        </TableCell>
                        <TableCell data-testid={`badge-status-${subscriber.id}`}>
                          <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                            {subscriber.status === 'active' ? 'Aktivan' : 'Odjavljem'}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-date-${subscriber.id}`}>
                          {new Date(subscriber.subscribedAt).toLocaleDateString('sr-ME', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {subscribers.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Statistika</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-md">
                  <div className="text-3xl font-bold" data-testid="text-total-subscribers">
                    {subscribers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Ukupno Pretplatnika</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-md">
                  <div className="text-3xl font-bold text-green-600" data-testid="text-active-subscribers">
                    {subscribers.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Aktivnih</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-md">
                  <div className="text-3xl font-bold text-muted-foreground" data-testid="text-unsubscribed">
                    {subscribers.filter(s => s.status !== 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Odjavljenih</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
