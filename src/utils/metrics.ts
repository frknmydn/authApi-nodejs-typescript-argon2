require("dotenv").config();

import config from "config";

import express from 'express';
import log from './logger';
import client from "prom-client";

const app = express();
const port = config.get("metricsPort")

export const apiResponseTimeHistogram = new client.Histogram({
    name: "api_response_time_seconds",
    help: "API response time in seconds",
    labelNames: ["method", "route", "status_code"]
});


export const dbResponseTimeHistogram = new client.Histogram({
    name: "database_response_time_seconds",
    help: "Database response time in seconds",
    labelNames: ["operation", "success"]
})

export function startMetricsServer(){

    const collectDefaultMetrics = client.collectDefaultMetrics;
    collectDefaultMetrics();

    app.get('/metrics', async (req, res) => {
        res.set("Content-Type", client.register.contentType);
        return res.send(await client.register.metrics());
    });
    app.listen(port, () =>{
        log.info(`Metrics server started on port ${port}`);
    })
}