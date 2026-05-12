import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "kilimolink-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_market_prices",
        description: "Get current market prices for produce in Nairobi",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Produce category (e.g., Vegetables, Fruits)",
            },
          },
        },
      },
      {
        name: "get_weather_forecast",
        description: "Get weather forecast for a specific farming region",
        inputSchema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Farming region name (e.g., Limuru, Thika)",
            },
          },
          required: ["location"],
        },
      },
    ],
  };
});

/**
 * Handle tool calls.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_market_prices": {
      const category = request.params.arguments?.category as string;
      return {
        content: [
          {
            type: "text",
            text: `Mock market price for ${category || 'all produce'}: Sukuma Wiki - 50 KES/kg, Milk - 60 KES/L.`,
          },
        ],
      };
    }
    case "get_weather_forecast": {
      const location = request.params.arguments?.location as string;
      return {
        content: [
          {
            type: "text",
            text: `Weather forecast for ${location}: Sunny with light showers in the evening. Optimal for harvesting.`,
          },
        ],
      };
    }
    default:
      throw new Error("Tool not found");
  }
});

/**
 * Start the server.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
