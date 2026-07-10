import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import type { Invoice } from "@/types/invoice";
import { IStore } from "@/types/store";

// Optional: Register a font if you have one.
// Font.register({
//   family: "Roboto",
//   src: "/fonts/Roboto-Regular.ttf",
// });

const fmt = (val: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(typeof val === "string" ? parseFloat(val) : val);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
  },

  //---------------------------------------
  // Header
  //---------------------------------------

  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    borderBottomColor: "#D1D5DB",
  },

  storeContainer: {
    alignItems: "center",
  },

  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  address: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 2,
  },

  phone: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 12,
  },

  infoSection: {
    width: "100%",
    gap: 6,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoText: {
    fontSize: 10,
    color: "#374151",
  },

  //---------------------------------------
  // Table
  //---------------------------------------

  table: {
    marginTop: 12,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    borderBottomColor: "#D1D5DB",
    paddingBottom: 8,
    paddingHorizontal: 24,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },

  colIndex: {
    width: "8%",
  },

  colProduct: {
    width: "46%",
  },

  colQty: {
    width: "12%",
    textAlign: "right",
  },

  colPrice: {
    width: "17%",
    textAlign: "right",
  },

  colTotal: {
    width: "17%",
    textAlign: "right",
  },

  th: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "bold",
  },

  td: {
    fontSize: 10,
  },

  productName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },

  barcode: {
    fontSize: 8,
    color: "#6B7280",
  },

  //---------------------------------------
  // Image invoice
  //---------------------------------------

  invoiceImageWrapper: {
    padding: 24,
    alignItems: "center",
  },

  invoiceImage: {
    width: 340,
    height: 340,
    objectFit: "contain",
  },

  //---------------------------------------
  // Totals
  //---------------------------------------

  totalsContainer: {
    marginTop: 16,
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  totalsBox: {
    width: 220,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalLabel: {
    color: "#6B7280",
    fontSize: 10,
  },

  totalValue: {
    fontSize: 10,
  },

  //---------------------------------------
  // Footer
  //---------------------------------------

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  footerText: {
    textAlign: "center",
    fontSize: 9,
    color: "#6B7280",
  },
});

interface InvoicePdfProps {
  invoice: Invoice;
  store: IStore;
}

export function InvoicePdf({ invoice, store }: InvoicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.storeContainer}>
              <Text style={styles.storeName}>{store.name}</Text>

              <Text style={styles.address}>{store.address}</Text>

              <Text style={styles.phone}>{store.phone}</Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Bill: #{invoice.invoiceNo}</Text>

                <Text style={styles.infoText}>Clerk: John Doe</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  {fmtDate(invoice.createdAt)}
                </Text>

                <Text style={styles.infoText}>
                  Time: {fmtTime(invoice.createdAt)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  Customer Name: {invoice.customerName}
                </Text>

                <Text style={styles.infoText}>
                  Customer Phone: {invoice.customerPhone}
                </Text>
              </View>
            </View>
          </View>

          {/* Product table / Image invoice starts in Part 2 */}
          {invoice.type === "image" ? (
            <View style={styles.invoiceImageWrapper}>
              <Image
                src={invoice.imageUrl as string}
                style={styles.invoiceImage}
              />
            </View>
          ) : (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.th, styles.colIndex]}>#</Text>
                <Text style={[styles.th, styles.colProduct]}>Product</Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colPrice]}>Unit Price</Text>
                <Text style={[styles.th, styles.colTotal]}>Total</Text>
              </View>

              {/* Table Body */}
              {invoice.items.map((item, index) => (
                <View key={item.id} style={styles.tableRow} wrap={false}>
                  {/* Serial */}
                  <Text
                    style={[
                      styles.td,
                      styles.colIndex,
                      {
                        color: "#6B7280",
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>

                  {/* Product */}
                  <View style={styles.colProduct}>
                    <Text style={styles.productName}>{item.product.name}</Text>

                    <Text style={styles.barcode}>{item.product.barcode}</Text>
                  </View>

                  {/* Quantity */}
                  <Text
                    style={[
                      styles.td,
                      styles.colQty,
                      {
                        color: "#6B7280",
                      },
                    ]}
                  >
                    {item.quantity}
                  </Text>

                  {/* Price */}
                  <Text
                    style={[
                      styles.td,
                      styles.colPrice,
                      {
                        color: "#6B7280",
                      },
                    ]}
                  >
                    {fmt(item.price)}
                  </Text>

                  {/* Total */}
                  <Text
                    style={[
                      styles.td,
                      styles.colTotal,
                      {
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {fmt(item.total)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Totals start in Part 3 */}
          {/* Totals */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Bill Amount</Text>
                <Text style={styles.totalValue}>{fmt(invoice.total)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Paid Amount</Text>
                <Text style={styles.totalValue}>{fmt(invoice.paid)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Bal. Amount</Text>
                <Text style={styles.totalValue}>{fmt(invoice.due)}</Text>
              </View>
            </View>
          </View>

          {/* Optional Note */}
          {invoice.note && (
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#E5E7EB",
                borderTopStyle: "dashed",
                paddingHorizontal: 24,
                paddingVertical: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  color: "#6B7280",
                  marginBottom: 6,
                  fontWeight: "bold",
                }}
              >
                NOTE
              </Text>

              <Text
                style={{
                  fontSize: 10,
                  color: "#374151",
                  lineHeight: 1.5,
                }}
              >
                {invoice.note}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Thank you for your business — {store.name}
            </Text>
          </View>
        </View>

        {/* Page Number */}
        <Text
          fixed
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 9,
            color: "#9CA3AF",
          }}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
