"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorRouter = exports.HealthRouter = void 0;
var health_1 = require("./health");
Object.defineProperty(exports, "HealthRouter", { enumerable: true, get: function () { return health_1.router; } });
var calculator_1 = require("./calculator");
Object.defineProperty(exports, "CalculatorRouter", { enumerable: true, get: function () { return calculator_1.route; } });
