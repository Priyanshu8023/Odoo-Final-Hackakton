import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContactFormDialog } from "@/components/contact/ContactFormDialog";
import Header from "@/components/layout/Header";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Contact } from "@/types/contact";

const ContactMaster = () => {
  console.log('ContactMaster component rendering...');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      console.log('Fetching contacts...');
      setLoading(true);
      const response = await apiClient.getContacts();
      console.log('Contacts response:', response);
      if (response.success) {
        setContacts(response.data.contacts);
        console.log('Contacts set:', response.data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreateContact = async (contactData: any) => {
    try {
      // Transform frontend data to backend format
      const addressParts = contactData.address?.split(',') || [];
      const backendData = {
        name: contactData.name,
        type: ['customer'], // Default to customer
        email: contactData.email,
        mobile: contactData.mobileNo,
        address: {
          city: addressParts[0]?.trim() || '',
          state: addressParts[1]?.trim() || '',
          pincode: addressParts[2]?.trim() || ''
        },
        profileImageURL: contactData.profileImage || ''
      };
      
      const response = await apiClient.createContact(backendData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Contact created successfully",
        });
        fetchContacts();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create contact",
        variant: "destructive",
      });
    }
  };

  const handleUpdateContact = async (id: string, contactData: any) => {
    try {
      // Transform frontend data to backend format
      const addressParts = contactData.address?.split(',') || [];
      const backendData = {
        name: contactData.name,
        type: ['customer'], // Default to customer
        email: contactData.email,
        mobile: contactData.mobileNo,
        address: {
          city: addressParts[0]?.trim() || '',
          state: addressParts[1]?.trim() || '',
          pincode: addressParts[2]?.trim() || ''
        },
        profileImageURL: contactData.profileImage || ''
      };
      
      const response = await apiClient.updateContact(id, backendData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Contact updated successfully",
        });
        fetchContacts();
        setEditingContact(null);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await apiClient.deleteContact(id);
        if (response.success) {
          toast({
            title: "Success",
            description: "Contact deleted successfully",
          });
          fetchContacts();
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast({
          title: "Error",
          description: error instanceof ApiError ? error.message : "Failed to delete contact",
          variant: "destructive",
        });
      }
    }
  };

  const openCreateDialog = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const getTypeBadgeVariant = (types: string[]) => {
    if (types.includes("Both")) return "outline";
    if (types.includes("Vendor")) return "secondary";
    return "default";
  };

  if (loading) {
    console.log('ContactMaster loading...');
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Header title="Contact Master" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  console.log('ContactMaster rendering with contacts:', contacts);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header title="Contact Master" />
      
      <main className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <Button onClick={openCreateDialog} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contacts found. Create your first contact to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact._id}>
                        <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.profileImageURL} />
                            <AvatarFallback>
                              {contact.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{contact.name}</span>
                        </div>
                        </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(contact.type)}>
                          {contact.type.join(', ')}
                        </Badge>
                        </TableCell>
                      <TableCell>{contact.email || "-"}</TableCell>
                      <TableCell>{contact.mobile || "-"}</TableCell>
                      <TableCell>
                        {contact.address?.city && contact.address?.state 
                          ? `${contact.address.city}, ${contact.address.state}` 
                          : "-"
                        }
                        </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                            onClick={() => openEditDialog(contact)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(contact._id)}
                            className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

        <ContactFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingContact(null);
        }}
        onSubmit={editingContact ? 
          (data) => handleUpdateContact(editingContact.id, data) : 
          handleCreateContact
        }
        initialData={editingContact}
      />
    </div>
  );
};

export default ContactMaster;