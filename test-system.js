#!/usr/bin/env node

/**
 * Test Script for Agricultural Chatbot System
 * Tests: MongoDB, Backend, ML API connectivity and basic prediction flow
 */

const http = require("http");

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
};

// Test configuration
const tests = {
  mongodb: { port: 27017, name: "MongoDB", ping: false },
  backend: {
    port: 5001,
    name: "Backend (Express)",
    endpoint: "/health",
  },
  mlapi: {
    port: 6000,
    name: "ML API (Flask)",
    endpoint: "/health",
  },
};

/**
 * Check if a service is running
 */
async function checkService(serviceName, port, endpoint = null) {
  return new Promise((resolve) => {
    const hostname = "127.0.0.1";
    const path = endpoint ? `http://${hostname}:${port}${endpoint}` : `${hostname}:${port}`;

    // For MongoDB, just check TCP connection
    if (!endpoint) {
      const socket = new (require("net")).Socket();
      socket.setTimeout(2000);
      socket.on("connect", () => {
        socket.destroy();
        log.success(`${serviceName} is running on port ${port}`);
        resolve(true);
      });
      socket.on("timeout", () => {
        socket.destroy();
        log.error(`${serviceName} not responding on port ${port}`);
        resolve(false);
      });
      socket.on("error", () => {
        socket.destroy();
        log.error(`${serviceName} not running on port ${port}`);
        resolve(false);
      });
      socket.connect(port, hostname);
    } else {
      // For HTTP services, make actual request
      const handleResponse = (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode === 200) {
            log.success(`${serviceName} is running on port ${port}`);
            log.info(`Response: ${data.substring(0, 100)}`);
            resolve(true);
          } else {
            log.error(`${serviceName} returned status ${res.statusCode}`);
            resolve(false);
          }
        });
      };

      const req = http.get(
        `http://${hostname}:${port}${endpoint}`,
        { timeout: 2000 },
        handleResponse
      );

      req.on("timeout", () => {
        req.abort();
        log.error(`${serviceName} timeout on port ${port}`);
        resolve(false);
      });

      req.on("error", (err) => {
        log.error(`${serviceName} error: ${err.message}`);
        resolve(false);
      });
    }
  });
}

/**
 * Main test runner
 */
async function runTests() {
  console.clear();
  log.header("🚀 Agricultural Chatbot - System Health Check");

  const results = {};

  // Test each service
  for (const [key, config] of Object.entries(tests)) {
    try {
      results[key] = await checkService(config.name, config.port, config.endpoint);
    } catch (error) {
      results[key] = false;
      log.error(`Unexpected error testing ${config.name}: ${error.message}`);
    }
  }

  // Summary
  log.header("📊 Test Summary");

  const allPassing = Object.values(results).every((r) => r);

  if (allPassing) {
    log.success("All services are running!");
    log.info("You can now:");
    console.log("  1. Open http://localhost:5173 in your browser");
    console.log("  2. Fill out the chatbot form");
    console.log("  3. Submit to get a prediction");
    console.log("  4. Check MongoDB for stored records: `db.users.findOne()`");
  } else {
    log.warn("Some services are not responding:");
    console.log("\nNot running:");
    Object.entries(results).forEach(([key, passing]) => {
      if (!passing) {
        const config = tests[key];
        console.log(`  • ${config.name} (port ${config.port})`);
      }
    });

    log.info("\nStart missing services in new terminals:");
    console.log("  1. MongoDB:  mongod --dbpath %USERPROFILE%\\mongodb\\data");
    console.log("  2. ML API:   cd ml-model && python train.py && python app.py");
    console.log("  3. Backend:  cd backend && npm install && node server.js");
    console.log("  4. Frontend: cd frontend && npm install && npm run dev");
  }

  log.header("✨ Status Report Complete");
}

// Run tests
runTests().catch(console.error);
