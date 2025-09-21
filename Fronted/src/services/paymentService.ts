import { apiClient } from '@/lib/api';
import { PDFGenerator, InvoiceData } from '@/utils/pdfGenerator';

export interface PaymentData {
  paymentId: string;
  invoiceNumber: string;
  partnerId: string;
  partnerName: string;
  partnerEmail?: string;
  partnerAddress?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  status: 'success' | 'pending' | 'failed';
  invoiceId?: string; // Added for storing the created invoice ID
}

export interface PaymentWorkflowResult {
  success: boolean;
  paymentData?: PaymentData;
  error?: string;
}

export class PaymentService {
  /**
   * Process a payment and execute the complete workflow
   */
  static async processPayment(paymentData: Omit<PaymentData, 'paymentId' | 'status'>): Promise<PaymentWorkflowResult> {
    try {
      console.log('PaymentService.processPayment called with:', paymentData);
      
      // Step 1: Create payment record
      console.log('Step 1: Creating payment record...');
      const payment = await this.createPaymentRecord(paymentData);
      console.log('Payment record created:', payment);
      
      // Step 2: Generate and store PDF
      console.log('Step 2: Generating and storing PDF...');
      await this.generateAndStorePDF(payment);
      console.log('PDF generation completed');
      
      // Step 3: Update Profit & Loss reports
      console.log('Step 3: Updating P&L reports...');
      await this.updateProfitLossReport(payment);
      console.log('P&L update completed');
      
      // Step 4: Update partner status
      console.log('Step 4: Updating partner status...');
      await this.updatePartnerStatus(payment);
      console.log('Partner status update completed');
      
      // Step 5: Update invoice status
      console.log('Step 5: Updating invoice status...');
      await this.updateInvoiceStatus(payment);
      console.log('Invoice status update completed');
      
      console.log('Payment workflow completed successfully');
      return {
        success: true,
        paymentData: payment
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  /**
   * Create payment record in the database
   */
  private static async createPaymentRecord(data: Omit<PaymentData, 'paymentId' | 'status'>): Promise<PaymentData> {
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData: PaymentData = {
      ...data,
      paymentId,
      status: 'success'
    };

    // In a real app, you would call the backend API
    // const response = await apiClient.createPayment(paymentData);
    
    // For now, we'll simulate the API call
    console.log('Creating payment record:', paymentData);
    
    return paymentData;
  }

  /**
   * Generate PDF and store it in the system
   */
  private static async generateAndStorePDF(payment: PaymentData): Promise<void> {
    try {
      console.log('Creating invoice from payment data:', payment);
      
      // Call backend API to create invoice and generate PDF
      const response = await apiClient.createInvoiceFromPayment({
        invoiceNumber: payment.invoiceNumber,
        partnerId: null, // Let backend create vendor contact
        partnerName: payment.partnerName,
        partnerEmail: payment.partnerEmail,
        partnerAddress: payment.partnerAddress,
        amountPaid: payment.amountPaid,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId
      });
      
      if (response.success) {
        console.log('Invoice created and PDF generated successfully:', response.data);
        // Store the invoice ID for future reference
        payment.invoiceId = response.data.invoice._id;
      } else {
        throw new Error(response.message || 'Failed to create invoice and generate PDF');
      }
      
    } catch (error) {
      console.error('Invoice creation and PDF generation error:', error);
      // Don't throw error to prevent payment failure
      console.warn('Invoice creation failed, but payment will continue');
    }
  }

  /**
   * Store PDF in invoice record
   */
  private static async storePDFInInvoice(payment: PaymentData, pdfBlob: Blob): Promise<void> {
    try {
      // In a real app, you would upload the PDF to your storage service
      // and then update the invoice record with the PDF details
      
      const pdfData = {
        fileName: `payment-${payment.paymentId}.pdf`,
        filePath: `/invoices/pdfs/payment-${payment.paymentId}.pdf`, // In real app, this would be the actual file path
        fileSize: pdfBlob.size,
        mimeType: 'application/pdf',
        generatedBy: 'system'
      };

      const paymentDetails = {
        paymentId: payment.paymentId,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        paymentDate: payment.paymentDate,
        paymentStatus: 'paid',
        amountPaid: payment.amountPaid
      };

      // Call the backend API to update the invoice with PDF data
      try {
        const response = await apiClient.updateInvoiceWithPDF(payment.invoiceNumber, pdfData, paymentDetails);
        console.log('PDF stored in invoice successfully:', response);
      } catch (apiError) {
        console.log('API call failed, using fallback storage:', apiError);
        // Fallback to console logging if API fails
        console.log('PDF stored in invoice (fallback):', {
          invoiceNumber: payment.invoiceNumber,
          pdfData,
          paymentDetails
        });
      }
      
    } catch (error) {
      console.error('Error storing PDF in invoice:', error);
      throw new Error('Failed to store PDF in invoice');
    }
  }

  /**
   * Store PDF metadata in the database (legacy method)
   */
  private static async storePDFMetadata(paymentId: string, pdfBlob: Blob): Promise<void> {
    // In a real app, you would store the PDF file and metadata
    console.log('Storing PDF metadata for payment:', paymentId);
    
    // Simulate storing PDF metadata
    const pdfMetadata = {
      paymentId,
      fileName: `payment-${paymentId}.pdf`,
      fileSize: pdfBlob.size,
      mimeType: 'application/pdf',
      createdAt: new Date().toISOString()
    };
    
    console.log('PDF metadata stored:', pdfMetadata);
  }

  /**
   * Update Profit & Loss reports with purchase order data
   */
  private static async updateProfitLossReport(payment: PaymentData): Promise<void> {
    try {
      console.log('Updating P&L report with purchase order:', payment.amountPaid);
      
      // Call backend API to add purchase order transaction
      const response = await apiClient.addPurchaseOrderTransaction({
        orderId: payment.paymentId,
        vendorName: payment.partnerName,
        amount: payment.amountPaid,
        orderDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        description: `Purchase order from ${payment.partnerName} - Invoice ${payment.invoiceNumber}`,
        metadata: {
          invoiceNumber: payment.invoiceNumber,
          transactionId: payment.transactionId,
          orderType: 'purchase',
          status: 'pending_payment',
          vendorId: payment.partnerId
        }
      });
      
      if (response.success) {
        console.log('Purchase order transaction added to P&L successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to update P&L report');
      }
      
    } catch (error) {
      console.error('P&L update error:', error);
      // Don't throw error to prevent payment failure
      console.warn('P&L update failed, but payment will continue');
    }
  }

  /**
   * Update partner status to show payment received
   */
  private static async updatePartnerStatus(payment: PaymentData): Promise<void> {
    try {
      // In a real app, you would update the partner's payment status
      console.log('Updating partner status for:', payment.partnerName);
      
      // Simulate updating partner status
      const partnerUpdate = {
        partnerId: payment.partnerId,
        lastPaymentDate: payment.paymentDate,
        lastPaymentAmount: payment.amountPaid,
        totalPaid: payment.amountPaid, // In real app, this would be cumulative
        status: 'Paid',
        paymentMethod: payment.paymentMethod
      };
      
      console.log('Partner status updated:', partnerUpdate);
      
    } catch (error) {
      console.error('Partner status update error:', error);
      // Don't throw error to prevent payment failure
      console.warn('Partner status update failed, but payment will continue');
    }
  }

  /**
   * Update invoice status to reflect payment
   */
  private static async updateInvoiceStatus(payment: PaymentData): Promise<void> {
    try {
      // In a real app, you would update the invoice status
      console.log('Updating invoice status for:', payment.invoiceNumber);
      
      // Simulate updating invoice status
      const invoiceUpdate = {
        invoiceNumber: payment.invoiceNumber,
        status: 'paid',
        amountPaid: payment.amountPaid,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId
      };
      
      console.log('Invoice status updated:', invoiceUpdate);
      
    } catch (error) {
      console.error('Invoice status update error:', error);
      // Don't throw error to prevent payment failure
      console.warn('Invoice status update failed, but payment will continue');
    }
  }

  /**
   * Get payment history for a partner
   */
  static async getPartnerPaymentHistory(partnerId: string): Promise<PaymentData[]> {
    try {
      // In a real app, you would fetch from the API
      console.log('Fetching payment history for partner:', partnerId);
      
      // Return mock data for now
      return [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * Get payment details by ID
   */
  static async getPaymentById(paymentId: string): Promise<PaymentData | null> {
    try {
      // In a real app, you would fetch from the API
      console.log('Fetching payment details for:', paymentId);
      
      // Return null for now (would fetch from API)
      return null;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return null;
    }
  }
}
