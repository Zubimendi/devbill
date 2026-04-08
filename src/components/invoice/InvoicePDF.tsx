"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#27272a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#09090b",
  },
  invoiceInfo: {
    textAlign: "right",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#71717a",
    marginBottom: 4,
    fontWeight: "bold",
  },
  businessInfo: {
    marginBottom: 40,
  },
  billingGrid: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 40,
  },
  billTo: {
    flex: 1,
  },
  billFrom: {
    flex: 1,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderColor: "#e4e4e7",
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#e4e4e7",
    borderBottomWidth: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f4f4f5",
    borderTopColor: "#e4e4e7",
    borderTopWidth: 1,
  },
  colDesc: { width: "60%" },
  colQty: { width: "10%", textAlign: "right" },
  colRate: { width: "15%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
  },
  summary: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
    marginBottom: 4,
  },
  totalRow: {
    marginTop: 8,
    borderTopColor: "#e4e4e7",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#09090b",
  },
  notes: {
    marginTop: 40,
    borderTopColor: "#e4e4e7",
    borderTopWidth: 1,
    paddingTop: 20,
  },
});

interface InvoicePDFProps {
  invoice: any;
  user: any;
}

export const InvoicePDF = ({ invoice, user }: InvoicePDFProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={{ color: "#71717a", marginTop: 4 }}>
              {invoice.invoiceNumber}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.sectionTitle}>Status</Text>
            <Text style={{ textTransform: "capitalize", fontWeight: "bold" }}>
              {invoice.status}
            </Text>
          </View>
        </View>

        {/* Billing Info */}
        <View style={styles.billingGrid}>
           <View style={styles.billFrom}>
             <Text style={styles.sectionTitle}>From</Text>
             <Text style={{ fontWeight: "bold", fontSize: 12 }}>
               {invoice.fromBusinessName || user.businessName || user.name}
             </Text>
             {(invoice.fromBusinessAddress || user.businessAddress) && (
               <Text>{invoice.fromBusinessAddress || user.businessAddress}</Text>
             )}
             <Text>{invoice.fromBusinessEmail || user.businessEmail || user.email}</Text>
             {(invoice.fromBusinessPhone || user.businessPhone) && (
               <Text>{invoice.fromBusinessPhone || user.businessPhone}</Text>
             )}
             {user.businessTaxId && (
               <Text style={{ marginTop: 4, fontSize: 8 }}>
                 Tax ID: {user.businessTaxId}
               </Text>
             )}
           </View>

          <View style={styles.billTo}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
              {invoice.clientId.name}
            </Text>
            {invoice.clientId.company && <Text>{invoice.clientId.company}</Text>}
            {invoice.clientId.address && <Text>{invoice.clientId.address}</Text>}
            <Text>{invoice.clientId.email}</Text>
          </View>
        </View>

        {/* Dates */}
        <View
          style={{ flexDirection: "row", gap: 40, marginBottom: 40, fontSize: 9 }}
        >
          <View>
            <Text style={styles.sectionTitle}>Date Issued</Text>
            <Text>{formatDate(invoice.createdAt)}</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Due Date</Text>
            <Text>{formatDate(invoice.dueDate)}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.colDesc}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.tableHeaderText}>Qty</Text>
            </View>
            <View style={styles.colRate}>
              <Text style={styles.tableHeaderText}>Rate</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>

          {invoice.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text>{item.description}</Text>
              </View>
              <View style={styles.colQty}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.colRate}>
                <Text>${item.rate.toFixed(2)}</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={{ fontWeight: "bold" }}>
                  ${item.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View>
            <View style={styles.summaryRow}>
              <Text style={{ color: "#71717a" }}>Subtotal</Text>
              <Text>${invoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: "#71717a" }}>Tax ({invoice.taxRate}%)</Text>
              <Text>${invoice.taxAmount.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>
                ${invoice.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={{ lineHeight: 1.5 }}>{invoice.notes}</Text>
          </View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            right: 40,
            textAlign: "center",
            color: "#a1a1aa",
            fontSize: 8,
          }}
        >
          <Text>Thank you for your business.</Text>
          <Text style={{ marginTop: 4 }}>
            Generated by devbill — Modern Invoicing for Developers
          </Text>
        </View>
      </Page>
    </Document>
  );
};
