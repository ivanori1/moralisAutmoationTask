// rpcUtils.ts

export async function rpcETHMethod(
  nodeURL: string,
  method: string,
  params: any[] = []
) {
  const rpcETHMethodRequest = await fetch(nodeURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  });

  const response = await rpcETHMethodRequest.json();
  return response;
}
