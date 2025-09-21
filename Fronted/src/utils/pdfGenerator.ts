// PDF Generation Utility
// This is a simplified PDF generation service
// In a production app, you would use libraries like jsPDF, Puppeteer, or a backend service

export interface InvoiceData {
  invoiceNumber: string;
  partnerName: string;
  partnerEmail?: string;
  partnerAddress?: string;
  invoiceDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    tax?: number;
  }>;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod?: string;
  transactionId?: string;
}

export class PDFGenerator {
  static generateInvoicePDF(data: InvoiceData): Promise<Blob> {
    return new Promise((resolve) => {
      // Create a simple HTML representation of the invoice
      const htmlContent = this.generateInvoiceHTML(data);
      
      // In a real implementation, you would use jsPDF or similar library
      // For now, we'll create a simple text-based PDF representation
      const pdfContent = this.createSimplePDF(data);
      
      // Create a blob with the PDF content
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      resolve(blob);
    });
  }

  private static generateInvoiceHTML(data: InvoiceData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${data.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          .partner-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total-section { text-align: right; margin-top: 20px; }
          .amount { font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <h2>${data.invoiceNumber}</h2>
        </div>
        
        <div class="invoice-details">
          <p><strong>Invoice Date:</strong> ${new Date(data.invoiceDate).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
        </div>
        
        <div class="partner-details">
          <h3>Bill To:</h3>
          <p><strong>${data.partnerName}</strong></p>
          ${data.partnerEmail ? `<p>Email: ${data.partnerEmail}</p>` : ''}
          ${data.partnerAddress ? `<p>Address: ${data.partnerAddress}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>₹${item.rate.toFixed(2)}</td>
                <td>₹${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <p><strong>Subtotal: ₹${data.subtotal.toFixed(2)}</strong></p>
          <p><strong>Tax: ₹${data.totalTax.toFixed(2)}</strong></p>
          <p class="amount">Grand Total: ₹${data.grandTotal.toFixed(2)}</p>
          <p><strong>Amount Paid: ₹${data.amountPaid.toFixed(2)}</strong></p>
          <p><strong>Balance Due: ₹${data.balanceDue.toFixed(2)}</strong></p>
        </div>
        
        ${data.paymentMethod ? `
          <div class="payment-details">
            <h3>Payment Details:</h3>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }

  private static createSimplePDF(data: InvoiceData): string {
    // This is a simplified PDF content
    // In a real implementation, you would use a proper PDF library
    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 12 Tf
100 700 Td
(Invoice: ${data.invoiceNumber}) Tj
0 -20 Td
(Partner: ${data.partnerName}) Tj
0 -20 Td
(Amount: ₹${data.grandTotal.toFixed(2)}) Tj
0 -20 Td
(Date: ${new Date(data.invoiceDate).toLocaleDateString()}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
754
%%EOF
    `;
  }

  static downloadPDF(data: InvoiceData, filename?: string): void {
    this.generateInvoicePDF(data).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `invoice-${data.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  static printInvoice(data: InvoiceData): void {
    const htmlContent = this.generateInvoiceHTML(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
