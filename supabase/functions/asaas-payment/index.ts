import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

async function createCustomer(apiKey: string, baseUrl: string, params: { name: string; email: string }) {
  // Try to find existing customer by email first
  const existing = await asaasFetch(apiKey, baseUrl, `/customers?email=${encodeURIComponent(params.email)}`);
  if (existing.data && existing.data.length > 0) {
    return jsonResponse({ customerId: existing.data[0].id });
  }

  const customer = await asaasFetch(apiKey, baseUrl, '/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: params.name,
      email: params.email,
    }),
  });
  return jsonResponse({ customerId: customer.id });
}

async function createPixPayment(apiKey: string, baseUrl: string, params: { customerId: string; value: number; description: string }) {
  const payment = await asaasFetch(apiKey, baseUrl, '/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: params.customerId,
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
  customerId: string;
  value: number;
  description: string;
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
  const payment = await asaasFetch(apiKey, baseUrl, '/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: params.customerId,
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
