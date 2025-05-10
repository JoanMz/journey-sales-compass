
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Your original API base URL
const API_BASE_URL = "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000";

serve(async (req) => {
  try {
    // Parse the request body
    const { path, method, body, params } = await req.json();
    
    // Construct the full URL
    let url = `${API_BASE_URL}${path}`;
    
    // Add any query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    // Add body for non-GET requests
    if (method !== "GET" && body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    console.log(`Proxying request to: ${url}`);
    
    // Make the request to the original API
    const response = await fetch(url, fetchOptions);
    
    // Get response data
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Return the proxied response
    return new Response(
      JSON.stringify({
        data: responseData,
        status: response.status,
        statusText: response.statusText,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Proxy error:", error.message);
    
    // Return error response
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
