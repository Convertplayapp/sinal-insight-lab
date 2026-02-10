import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CustomerData = {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  postalCode?: string;
  province?: string;
  city?: string;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');
  const ASAAS_API_URL = Deno.env.get('ASAAS_API_URL') || 'https://api.asaas.com/v3';

  if (!ASAAS_API_KEY) {
    return jsonResponse({ error: 'ASAAS_API_KEY not configured' });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === 'create-customer') {
      return await createCustomer(ASAAS_API_KEY, ASAAS_API_URL, params);
    } else if (action === 'create-pix') {
      return await createPixPayment(ASAAS_API_KEY, ASAAS_API_URL, params);
    } else if (action === 'create-credit-card') {
      return await createCreditCardPayment(ASAAS_API_KEY, ASAAS_API_URL, params);
    } else if (action === 'get-pix-qrcode') {
      return await getPixQrCode(ASAAS_API_KEY, ASAAS_API_URL, params);
    } else if (action === 'check-status') {
      return await checkPaymentStatus(ASAAS_API_KEY, ASAAS_API_URL, params);
    }

    return jsonResponse({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message });
  }
});

async function asaasFetch(apiKey: string, baseUrl: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const description = Array.isArray(data?.errors)
      ? data.errors.map((e: { description?: string }) => e.description).filter(Boolean).join(', ')
      : data?.message;
    throw new Error(description ? `ASAAS: ${description}` : `ASAAS API error [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

function buildCustomerPayload(data: CustomerData) {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
  };
  if (data.cpfCnpj) payload.cpfCnpj = data.cpfCnpj;
  if (data.phone) payload.phone = data.phone;
  if (data.address) payload.address = data.address;
  if (data.addressNumber) payload.addressNumber = data.addressNumber;
  if (data.complement) payload.complement = data.complement;
  if (data.postalCode) payload.postalCode = data.postalCode;
  if (data.province) payload.province = data.province;
  if (data.city) payload.city = data.city;
  return payload;
}

async function createCustomerRecord(apiKey: string, baseUrl: string, data: CustomerData) {
  const existing = await asaasFetch(apiKey, baseUrl, `/customers?email=${encodeURIComponent(data.email)}`);
  const payload = buildCustomerPayload(data);

  if (existing.data && existing.data.length > 0) {
    const current = existing.data[0];
    const shouldUpdate =
      (data.cpfCnpj && data.cpfCnpj !== current.cpfCnpj) ||
      (data.phone && data.phone !== current.phone) ||
      (data.postalCode && data.postalCode !== current.postalCode) ||
      (data.address && data.address !== current.address) ||
      (data.addressNumber && data.addressNumber !== current.addressNumber) ||
      (data.complement && data.complement !== current.complement) ||
      (data.province && data.province !== current.province) ||
      (data.city && data.city !== current.city);

    if (shouldUpdate) {
      await asaasFetch(apiKey, baseUrl, `/customers/${current.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    }
    return current.id as string;
  }

  const customer = await asaasFetch(apiKey, baseUrl, '/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return customer.id as string;
}

async function ensureCustomerCpfCnpj(apiKey: string, baseUrl: string, customerId: string, cpfCnpj?: string) {
  if (!cpfCnpj) return;
  const customer = await asaasFetch(apiKey, baseUrl, `/customers/${customerId}`);
  if (customer?.cpfCnpj !== cpfCnpj) {
    await asaasFetch(apiKey, baseUrl, `/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify({ cpfCnpj }),
    });
  }
}

async function createCustomer(
  apiKey: string,
  baseUrl: string,
  params: CustomerData
) {
  const customerId = await createCustomerRecord(apiKey, baseUrl, params);
  return jsonResponse({ customerId });
}

async function createPixPayment(
  apiKey: string,
  baseUrl: string,
  params: { customerId?: string; customerData?: CustomerData; value: number; description: string; cpfCnpj?: string }
) {
  const customerId = params.customerId || (params.customerData ? await createCustomerRecord(apiKey, baseUrl, params.customerData) : undefined);
  if (!customerId) {
    throw new Error('Customer data required');
  }

  await ensureCustomerCpfCnpj(apiKey, baseUrl, customerId, params.cpfCnpj || params.customerData?.cpfCnpj);

  const payment = await asaasFetch(apiKey, baseUrl, '/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: customerId,
      billingType: 'PIX',
      value: params.value,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: params.description,
    }),
  });

  // Get QR Code
  const qrCode = await asaasFetch(apiKey, baseUrl, `/payments/${payment.id}/pixQrCode`);

  return jsonResponse({
    paymentId: payment.id,
    status: payment.status,
    qrCodeImage: qrCode.encodedImage,
    qrCodePayload: qrCode.payload,
    expirationDate: qrCode.expirationDate,
  });
}

async function createCreditCardPayment(apiKey: string, baseUrl: string, params: {
  customerId?: string;
  customerData?: CustomerData;
  value: number;
  description: string;
  cpfCnpj?: string;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}) {
  const customerId = params.customerId || (params.customerData ? await createCustomerRecord(apiKey, baseUrl, params.customerData) : undefined);
  if (!customerId) {
    throw new Error('Customer data required');
  }

  await ensureCustomerCpfCnpj(apiKey, baseUrl, customerId, params.cpfCnpj || params.customerData?.cpfCnpj);

  const payment = await asaasFetch(apiKey, baseUrl, '/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: params.value,
      dueDate: new Date().toISOString().split('T')[0],
      description: params.description,
      creditCard: params.creditCard,
      creditCardHolderInfo: params.creditCardHolderInfo,
    }),
  });

  return jsonResponse({
    paymentId: payment.id,
    status: payment.status,
  });
}

async function getPixQrCode(apiKey: string, baseUrl: string, params: { paymentId: string }) {
  const qrCode = await asaasFetch(apiKey, baseUrl, `/payments/${params.paymentId}/pixQrCode`);
  return jsonResponse({
    qrCodeImage: qrCode.encodedImage,
    qrCodePayload: qrCode.payload,
    expirationDate: qrCode.expirationDate,
  });
}

async function checkPaymentStatus(apiKey: string, baseUrl: string, params: { paymentId: string }) {
  const payment = await asaasFetch(apiKey, baseUrl, `/payments/${params.paymentId}`);
  return jsonResponse({
    paymentId: payment.id,
    status: payment.status,
  });
}

function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
