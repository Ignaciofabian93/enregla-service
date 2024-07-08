"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.protocol = exports.environment = void 0;
exports.environment = process.env.ENVIRONMENT || "development";
exports.protocol = exports.environment === "development" ? "http" : "https";
exports.port = process.env.PORT || 4000;
