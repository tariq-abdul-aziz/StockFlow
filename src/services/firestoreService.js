import { ref, get, set, update } from "firebase/database";
import { db } from "../firebase";

// Products
export const getProducts = async (userId) => {
  try {
    const productsRef = ref(db, `users/${userId}/products`);
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
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

// Update Invoice
export const updateInvoiceStatus = async (userId, invoiceId, status) => {
  const invoiceRef = ref(db, `users/${userId}/invoices/${invoiceId}`);
  await update(invoiceRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
};

// Pro Formas
export const getProformas = async (userId) => {
  try {
    const proformasRef = ref(db, `users/${userId}/proformas`);
    const snapshot = await get(proformasRef);
    if (!snapshot.exists()) return[];
    const list = Object.values(snapshot.val());
    return list.reverse();
  } catch (err) {
    console.error("Error fetching proformas:", err);
    return [];
  }
};

export const saveProforma = async (userId, proformaData) => {
  const docId = String(proformaData.details?.proformaNumber || Date.now());
  const proformaRef = ref(db, `users/${userId}/proformas/${docId}`);

  const payload = {
    ...proformaData,
    id: docId,
    createdAt: new Date().toISOString(),
  };

  await set(proformaRef, payload);
  return payload;
};

// Business Setting
export const getBusinessSetting = async (userId) => {
  try {
    const settingsRef = ref(db, `users/${userId}/settings`);
    const snapshot = await get(settingsRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (err) {
    console.error("Error fetching settings:", err);
    return null;
  }
};

export const saveBusinessSettings = async (userId, settingsData) => {
  const settingsRef = ref(db, `users/${userId}/settings`);
  const payload = {
    ...settingsData, updatedAt: new Date().toISOString(),
  };
  await set(settingsRef, payload);
  return payload;
};
