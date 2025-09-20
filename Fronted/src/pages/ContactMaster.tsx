import { useState } from "react";
import { Plus, Edit, Trash2, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact, ContactFormData } from "@/types/contact";
import { ContactFormDialog } from "@/components/contact/ContactFormDialog";
import Header from "@/components/layout/Header";

// Sample data - in a real app, this would come from an API
const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "ABC Company Ltd",
    email: "contact@abccompany.com",
    mobileNo: "+91 98765 43210",
    address: "123 Business Park, Mumbai, Maharashtra 400001",
    gstNo: "27AABCU9603R1ZX",
    panNo: "AABCU9603R",
    bankName: "State Bank of India",
    accountNo: "1234567890",
    ifscCode: "SBIN0001234",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "XYZ Suppliers",
    email: "info@xyzsuppliers.com",
    mobileNo: "+91 87654 32109",
    address: "456 Industrial Area, Delhi, Delhi 110001",
    gstNo: "07XYZSU9603R1ZY",
    panNo: "XYZSU9603R",
    bankName: "HDFC Bank",
    accountNo: "0987654321",
    ifscCode: "HDFC0000987",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Tech Solutions Pvt Ltd",
    email: "hello@techsolutions.com",
    mobileNo: "+91 76543 21098",
    address: "789 Tech Hub, Bangalore, Karnataka 560001",
    gstNo: "29TECHS9603R1ZZ",
    panNo: "TECHS9603R",
    bankName: "ICICI Bank",
    accountNo: "1122334455",
    ifscCode: "ICIC0001122",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

const ContactMaster = () => {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  const handleCreateContact = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleViewContact = (contact: Contact) => {
    setViewingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const handleSaveContact = (formData: ContactFormData) => {
    if (editingContact) {
      // Update existing contact
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id 
          ? { 
              ...contact, 
              ...formData, 
              updatedAt: new Date() 
            }
          : contact
      ));
    } else {
      // Create new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setContacts([...contacts, newContact]);
    }
    setIsFormOpen(false);
    setEditingContact(null);
    setViewingContact(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
    setViewingContact(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Contact Master" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              Manage your contacts, vendors, and customers in one place
            </p>
          </div>

        {/* Actions Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              Total Contacts: {contacts.length}
            </Badge>
          </div>
          <Button onClick={handleCreateContact} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Contact</span>
          </Button>
        </div>

        {/* Contact List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile No.</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No contacts found. Click "Add New Contact" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.profileImage} alt={contact.name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.mobileNo}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {contact.address}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewContact(contact)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContact(contact)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(contact.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form Dialog */}
        <ContactFormDialog
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveContact}
          contact={editingContact || viewingContact}
          isViewMode={!!viewingContact}
        />
        </div>
      </div>
    </div>
  );
};

export default ContactMaster;
