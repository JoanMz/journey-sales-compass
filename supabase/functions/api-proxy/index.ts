
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    // Parse the request body
    const { url, method, data } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({
          error: "URL is required",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    // Add body for non-GET requests if data is provided
    if (method !== "GET" && data) {
      fetchOptions.body = JSON.stringify(data);
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
      JSON.stringify(responseData),
      {
        headers: { "Content-Type": "application/json" },
        status: response.status,
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
