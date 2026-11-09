import { ref, get, set, update } from "firebase/database";
import { db } from "../firebase";
import { products as defaultProducts } from "../components/data/products";

// Products
export const getProducts = async (userId) => {
  const productsRef = ref(db, `users/${userId}/products`);
  const snapshot = await get(productsRef);

  if (!snapshot.exists()) {
    // Seed default catalog for a new user
    const initialMap = {};
    for (const prod of defaultProducts) {
      initialMap[prod.id] = { ...prod, createdAt: new Date().toISOString() };
    }
    await set(productsRef, initialMap);
    return defaultProducts;
  }

  const data = snapshot.val();
  return Object.values(data);
};

export const saveProduct = async (userId, productData) => {
  const docId = productData.id ? String(productData.id) : String(Date.now());
  const productRef = ref(db, `users/${userId}/products/${docId}`);

  const payload = {
    ...productData,
    id: isNaN(docId) ? docId : Number(docId),
    updatedAt: new Date().toISOString(),
  };

  await set(productRef, payload);
  return payload;
};

export const updateProductStock = async (userId, productId, newStock, historyEntry) => {
  const productRef = ref(db, `users/${userId}/products/${productId}`);
  const snap = await get(productRef);

  if (!snap.exists()) return;
  const currentData = snap.val();
  const existingHistory = currentData.stockHistory || [];

  await update(productRef, {
    currentStock: Number(newStock),
    stockHistory: [historyEntry, ...existingHistory],
    updatedAt: new Date().toISOString(),
  });
};

// Customers
export const getCustomers = async (userId) => {
  try {
    const customerRef = ref(db, `users/${userId}/customers`);
    const snapshot = await get(customerRef);
    if (!snapshot.exists()) return[];
    const val = snapshot.val();
    return val ? Object.values(val) : [];
  } catch (err) {
    console.error("Error fetching customers:", err);
    return [];
  }
};

export const saveCustomer = async (userId, customerData) => {
  const docId = customerData.id ? String(customerData.id) : String(Date.now());
  const customerRef = ref(db, `users/${userId}/customers/${docId}`);

  const payload = {
    ...customerData,
    id: isNaN(docId) ? docId : Number(docId),
    updatedAt: new Date().toISOString(),
  };

  await set(customerRef, payload);
  return payload;
};

// Invoices
export const getInvoices = async (userId) => {
  const invoicesRef = ref(db, `users/${userId}/invoices`);
  const snapshot = await get(invoicesRef);
  if (!snapshot.exists()) return [];
  const list = Object.values(snapshot.val());
  return list.reverse();
};

export const saveInvoice = async (userId, invoiceData) => {
  const docId = String(invoiceData.invoiceNumber || Date.now());
  const invoiceRef = ref(db, `users/${userId}/invoices/${docId}`);

  const payload = {
    ...invoiceData,
    id: docId,
    createdAt: new Date().toISOString(),
  };

  await set(invoiceRef, payload);
  return payload;
};