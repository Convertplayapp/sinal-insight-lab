import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASAAS_API_URL = 'https://api.asaas.com/v3';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');
  if (!ASAAS_API_KEY) {
    return new Response(JSON.stringify({ error: 'ASAAS_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === 'create-customer') {
      return await createCustomer(ASAAS_API_KEY, params);
    } else if (action === 'create-pix') {
      return await createPixPayment(ASAAS_API_KEY, params);
    } else if (action === 'create-credit-card') {
      return await createCreditCardPayment(ASAAS_API_KEY, params);
    } else if (action === 'get-pix-qrcode') {
      return await getPixQrCode(ASAAS_API_KEY, params);
    } else if (action === 'check-status') {
      return await checkPaymentStatus(ASAAS_API_KEY, params);
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function asaasFetch(apiKey: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`${ASAAS_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`ASAAS API error [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

async function createCustomer(apiKey: string, params: { name: string; email: string }) {
  // Try to find existing customer by email first
  const existing = await asaasFetch(apiKey, `/customers?email=${encodeURIComponent(params.email)}`);
  if (existing.data && existing.data.length > 0) {
    return jsonResponse({ customerId: existing.data[0].id });
  }

  const customer = await asaasFetch(apiKey, '/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: params.name,
      email: params.email,
    }),
  });
  return jsonResponse({ customerId: customer.id });
}

async function createPixPayment(apiKey: string, params: { customerId: string; value: number; description: string }) {
  const payment = await asaasFetch(apiKey, '/payments', {
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
  const qrCode = await asaasFetch(apiKey, `/payments/${payment.id}/pixQrCode`);

  return jsonResponse({
    paymentId: payment.id,
    status: payment.status,
    qrCodeImage: qrCode.encodedImage,
    qrCodePayload: qrCode.payload,
    expirationDate: qrCode.expirationDate,
  });
}

async function createCreditCardPayment(apiKey: string, params: {
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
  const payment = await asaasFetch(apiKey, '/payments', {
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

async function getPixQrCode(apiKey: string, params: { paymentId: string }) {
  const qrCode = await asaasFetch(apiKey, `/payments/${params.paymentId}/pixQrCode`);
  return jsonResponse({
    qrCodeImage: qrCode.encodedImage,
    qrCodePayload: qrCode.payload,
    expirationDate: qrCode.expirationDate,
  });
}

async function checkPaymentStatus(apiKey: string, params: { paymentId: string }) {
  const payment = await asaasFetch(apiKey, `/payments/${params.paymentId}`);
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
